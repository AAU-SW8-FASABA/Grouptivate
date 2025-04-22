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
import type { InsertOptions } from "./HealthAdapter";
import {
  CaloriesOnlyOptions,
  CountOnlyOptions,
  SportOptions,
  PermissionLevel,
  HealthAdapter,
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

type HealthKitInsertOptions = {
  type: keyof typeof HealthKit.Constants.Activities;
  startDate: string;
  endDate: string;
  energyBurned: number;
  energyBurnedUnit: "calorie" | "joule";
  distance: number;
  distanceUnit: "foot" | "inch" | "meter" | "mile";
};

/**
 * HealthKitAdapter Implementation
 */
export class HealthKitAdapter extends HealthAdapter {
  #permissionGranted: PermissionLevel = PermissionLevel.None;

  /**
   * Getter / Setter functions for private members
   */
  get permissionGranted(): PermissionLevel {
    return this.#permissionGranted;
  }

  generatePermissionObject(
    requestWrite: boolean = false
  ): HealthKitPermissions {
    // Generate permission Set and object
    const permissionSet: Set<HealthPermission> = new Set(
      Object.values(permissionMap)
    );

    const permissionObject: HealthKitPermissions = {
      permissions: {
        read: [...permissionSet],
        write: requestWrite ? [...permissionSet] : [],
      },
    };

    return permissionObject;
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
  async init(requestWrite: boolean = false): Promise<void> {
    // Check HealthKit availability
    if (!(await this.isAvailable())) {
      throw new Error("Error: Platform not supported");
    }

    // Only allow write requests when running in dev mode
    const willRequestWrite = requestWrite && __DEV__;
    const permissionObject = this.generatePermissionObject(willRequestWrite);

    // Create permission request promise
    return await new Promise((resolve, reject) => {
      HealthKit.initHealthKit(
        permissionObject,
        (err: string, results: HealthValue) => {
          if (err) {
            reject(new Error(`Failed to initialize permissions: ${err}`));
            return;
          }

          this.#permissionGranted = willRequestWrite
            ? PermissionLevel.ReadWrite
            : PermissionLevel.Read;
          resolve();
        }
      );
    });
  }

  /**
   * Retrieves data based on the provided options. The type of data retrieved
   * depends on the `type` property of the options parameter.
   *
   * @param options - The options specifying the type of data to retrieve.
   *   - `CaloriesOnlyOptions`: Used to retrieve calorie-related data.
   *   - `CountOnlyOptions`: Used to retrieve count-related data.
   *   - `SportOptions`: Used to retrieve sport activity data.
   *
   * @returns A promise that resolves to a number representing the requested data.
   *
   * @throws {Error} If permissions are not granted before requesting data.
   * @throws {Error} If an invalid option type is provided.
   */
  async getData(
    options: CaloriesOnlyOptions | CountOnlyOptions | SportOptions
  ): Promise<number> {
    if (this.#permissionGranted === PermissionLevel.None) {
      throw new Error(
        "Error: Requesting data before having all permissions will crash the application"
      );
    }

    switch (options.type) {
      case "sport":
        return await this.getActivityData(options);
      case "calories":
      case "count":
        return await this.getOtherData(options);
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
      return await new Promise<number>((resolve, reject) => {
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
    } else {
      const valuePromises: Promise<number>[] = dates.map(
        (date) =>
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

      const values = await Promise.all(valuePromises);
      return values.reduce((sum, curr) => sum + curr, 0);
    }
  }

  async insertData(data?: InsertOptions): Promise<void> {
    if (this.#permissionGranted !== PermissionLevel.ReadWrite) {
      throw new Error(
        `Error: Insufficient permissions - Has: ${
          this.#permissionGranted
        } Requires: ${PermissionLevel.ReadWrite}`
      );
    }

    // Insert default data
    if (!data) {
      const defaultData: HealthKitInsertOptions = {
        type: HealthKit.Constants.Activities.Cycling, // See HealthActivity Enum
        startDate: new Date(2020, 6, 2, 6, 0, 0).toISOString(),
        endDate: new Date(2020, 6, 2, 6, 30, 0).toISOString(),
        energyBurned: 50, // In Energy burned unit,
        energyBurnedUnit: "calorie",
        distance: 50, // In Distance unit
        distanceUnit: "meter",
      };

      return await this.insertHealthKitData(defaultData);
    }

    switch (data.type) {
      case "count":
        if (data.activity !== OtherActivity.Steps) {
          throw new Error(
            "The HealthKit adapter only supports saving 'OtherActivity.Steps'"
          );
        }

        const stepsData = {
          startDate: data.startDate.toISOString(),
          endDate: data.endDate.toISOString(),
          value: data.count,
        };

        return await new Promise<void>((resolve, reject) => {
          HealthKit.saveSteps(stepsData, (err, result) => {
            err ? reject(err) : resolve();
          });
        });
      case "sport":
        const activityData: HealthKitInsertOptions = {
          type: sportActivityHealthKitMap[data.activity][0], // Insert as the first activity in the map
          startDate: data.startDate.toISOString(),
          endDate: data.endDate.toISOString(),
          energyBurned: data.caloriesBurned,
          energyBurnedUnit: "calorie",
          distance: data.distance,
          distanceUnit: "meter",
        };
        return await this.insertHealthKitData(activityData);
    }
  }

  private insertHealthKitData(data: HealthKitInsertOptions): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      HealthKit.saveWorkout(data, (err, result) => {
        err ? reject(err) : resolve();
      });
    });
  }
}
