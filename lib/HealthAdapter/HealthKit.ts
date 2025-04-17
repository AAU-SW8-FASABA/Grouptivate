/**
 * IMPORTS
 */
// External libraries
import HealthKit, {
  HealthInputOptions,
  HealthKitPermissions,
  HealthPermission,
  HealthValue,
} from "react-native-health";
import * as v from "valibot";

// Internal modules - Adapters
import {
  CaloriesOnlyOptions,
  CountOnlyOptions,
  HealthAdapter,
  SportOptions,
} from "./HealthAdapter";

// Internal modules - HealthKit
import {
  otherActivityFunctionMap,
  permissionMap,
  sportActivityHealthKitMap,
} from "./HealthKit/HealthKitConstants";
import { Workout, WorkoutSchema } from "./HealthKit/HealthKitWorkoutSchema";

// Internal modules - Helpers
import { getDatesBetween } from "./Helpers";

// Internal modules - Schemas
import { OtherActivity } from "../API/schemas/Activity";
import { Metric } from "../API/schemas/Metric";

/**
 * HealthKitAdapter Implementation
 */
export class HealthKitAdapter extends HealthAdapter {
  #permissionGranted = false;

  /**
   * Getter / Setter functions for private members
   */
  get permissionGranted(): boolean {
    return this.#permissionGranted;
  }

  /**
   * Check if HealthKit is available on the given platform
   * @returns Promise<boolean>
   */
  isAvailable(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      HealthKit.isAvailable((err, results) => {
        err ? reject(err) : resolve(results);
      });
    });
  }

  /**
   * Initialize the HealthKit adapter and request permissions
   * @returns Promise<void>
   */
  async init(): Promise<void> {
    // Check HealthKit availability
    if (!(await this.isAvailable())) {
      throw new Error("Error: Platform not supported");
    }

    // Generate permission Set and object
    const permissionSet: Set<HealthPermission> = new Set(
      Object.values(permissionMap)
    );

    const permissionObject: HealthKitPermissions = {
      permissions: { read: [...permissionSet], write: [] },
    };

    // Create permission request promise
    return new Promise((resolve, reject) => {
      HealthKit.initHealthKit(
        permissionObject,
        (err: string, results: HealthValue) => {
          if (err) {
            reject(new Error(`Failed to initialize permissions: ${err}`));
            return;
          }

          this.#permissionGranted = true;
          resolve();
        }
      );
    });
  }

  async getData(
    options: CaloriesOnlyOptions | CountOnlyOptions | SportOptions
  ): Promise<number> {
    if (!this.#permissionGranted) {
      throw new Error(
        "Error: Requesting data before having all permissions will crash the application"
      );
    }

    if (options.type === "sport") {
      return await this.getActivityData({
        ...options,
        activity: options.activity,
      });
    } else if (options.type === "calories" && options.type === "calories") {
      return this.getOtherData({ ...options, activity: options.activity });
    } else {
      throw new Error("Unexpected Error: Invalid option type");
    }
  }

  private getActivityData(options: SportOptions): Promise<number> {
    // Creates object with the startdate and enddate
    const baseOptionsObject: HealthInputOptions = {
      startDate: options.startDate.toISOString(),
      endDate: options.endDate.toISOString(),
      type: HealthKit.Constants.Observers.Workout,
    };

    return new Promise<number>((resolve, reject) => {
      HealthKit.getSamples(baseOptionsObject, (err, results: unknown[]) => {
        if (err) {
          reject(err);
          return;
        }

        // Gather relevant workout entries within the timeframe
        const relevantWorkouts: Workout[] = [];
        for (const result of results) {
          const parsedWorkout = v.safeParse(WorkoutSchema, result);
          if (
            parsedWorkout.success &&
            sportActivityHealthKitMap[options.activity].includes(
              parsedWorkout.output.activityName
            )
          ) {
            relevantWorkouts.push(parsedWorkout.output);
          }
        }

        // Gater relevant information based on metric
        switch (options.metric) {
          case Metric.Calories:
            resolve(
              relevantWorkouts.reduce((sum, curr) => sum + curr.calories, 0)
            );
            break;
          case Metric.Distance:
            resolve(
              relevantWorkouts.reduce(
                (sum, curr) => sum + curr.distance * 1.609344 * 1000, // Convert miles -> kilometers -> meters
                0
              )
            );
            break;
          case Metric.Count:
            resolve(
              relevantWorkouts.reduce(
                (set, curr) => set.add(curr.id),
                new Set<string>()
              ).size
            );
            break;
          case Metric.Duration:
            resolve(
              relevantWorkouts.reduce(
                (sum, curr) =>
                  sum +
                  (new Date(curr.end).getTime() -
                    new Date(curr.start).getTime()),
                0
              ) / 1000 // Milliseconds to seconds
            );
            break;
        }
      });
    });
  }

  private async getOtherData(
    options: CaloriesOnlyOptions | CountOnlyOptions
  ): Promise<number> {
    // Creates object with the startdate and enddate
    const baseOptionsObject: HealthInputOptions = {
      startDate: options.startDate.toISOString(),
      endDate: options.endDate.toISOString(),
    };

    // Create an array of dateobjects between the start- and end date
    const dates = getDatesBetween(options.startDate, options.endDate);

    if (options.activity === OtherActivity.ActiveCaloriesBurned) {
      const number = new Promise<number>((resolve, reject) => {
        otherActivityFunctionMap[options.activity](
          baseOptionsObject,
          (err, results) => {
            if (err) {
              reject(err);
              return;
            }
            resolve(results.reduce((sum, curr) => sum + curr.value, 0));
          }
        );
      });

      return await number;
    } else {
      let valuePromises: Promise<number>[] = [];
      for (const date of dates) {
        valuePromises.push(
          new Promise<number>((resolve, reject) => {
            otherActivityFunctionMap[options.activity](
              {
                date: date.toISOString(),
              },
              (err, results) => {
                if (err) {
                  reject(err);
                  return;
                }
                resolve(results.value);
              }
            );
          })
        );
      }

      const values = await Promise.all(valuePromises);
      return values.reduce((sum, curr) => sum + curr, 0);
    }
  }
}
