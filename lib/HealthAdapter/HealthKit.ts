import {
  CaloriesOnlyOptions,
  CountOnlyOptions,
  HealthAdapter,
  SportOptions,
  isSportActivity,
} from "./HealthAdapter";
import { OtherActivity, SportActivity } from "../API/schemas/Activity";

import HealthKit, {
  HealthActivity,
  HealthValue,
  HealthKitPermissions,
  HealthInputOptions,
  HealthPermission,
  HealthObserver,
} from "react-native-health";

import { getDatesBetween } from "./Helpers";

const permissionMap: Record<OtherActivity | SportActivity, HealthPermission> = {
  [OtherActivity.ActiveCaloriesBurned]: HealthPermission.ActiveEnergyBurned,
  [OtherActivity.FloorsClimbed]: HealthPermission.FlightsClimbed,
  [OtherActivity.Steps]: HealthPermission.StepCount,
  [SportActivity.Badminton]: HealthPermission.Workout,
  [SportActivity.Baseball]: HealthPermission.Workout,
  [SportActivity.Basketball]: HealthPermission.Workout,
  [SportActivity.Biking]: HealthPermission.Workout,
  [SportActivity.Boxing]: HealthPermission.Workout,
  [SportActivity.Cricket]: HealthPermission.Workout,
  [SportActivity.Dancing]: HealthPermission.Workout,
  [SportActivity.Elliptical]: HealthPermission.Workout,
  [SportActivity.Fencing]: HealthPermission.Workout,
  [SportActivity.Football]: HealthPermission.Workout,
  [SportActivity.FootballAmerican]: HealthPermission.Workout,
  [SportActivity.FootballAustralian]: HealthPermission.Workout,
  [SportActivity.Frisbee]: HealthPermission.Workout,
  [SportActivity.Golf]: HealthPermission.Workout,
  [SportActivity.Gymnastics]: HealthPermission.Workout,
  [SportActivity.Handball]: HealthPermission.Workout,
  [SportActivity.Hiking]: HealthPermission.Workout,
  [SportActivity.Hockey]: HealthPermission.Workout,
  [SportActivity.MartialArts]: HealthPermission.Workout,
  [SportActivity.Paddling]: HealthPermission.Workout,
  [SportActivity.Pilates]: HealthPermission.Workout,
  [SportActivity.Racquetball]: HealthPermission.Workout,
  [SportActivity.RockClimbing]: HealthPermission.Workout,
  [SportActivity.Rowing]: HealthPermission.Workout,
  [SportActivity.Rugby]: HealthPermission.Workout,
  [SportActivity.Running]: HealthPermission.Workout,
  [SportActivity.Sailing]: HealthPermission.Workout,
  [SportActivity.Skating]: HealthPermission.Workout,
  [SportActivity.Skiing]: HealthPermission.Workout,
  [SportActivity.Snowboarding]: HealthPermission.Workout,
  [SportActivity.Softball]: HealthPermission.Workout,
  [SportActivity.Squash]: HealthPermission.Workout,
  [SportActivity.StairClimbing]: HealthPermission.Workout,
  [SportActivity.StrengthTraining]: HealthPermission.Workout,
  [SportActivity.Stretching]: HealthPermission.Workout,
  [SportActivity.Surfing]: HealthPermission.Workout,
  [SportActivity.Swimming]: HealthPermission.Workout,
  [SportActivity.TableTennis]: HealthPermission.Workout,
  [SportActivity.Tennis]: HealthPermission.Workout,
  [SportActivity.Volleyball]: HealthPermission.Workout,
  [SportActivity.Walking]: HealthPermission.Workout,
  [SportActivity.WaterPolo]: HealthPermission.Workout,
  [SportActivity.Wheelchair]: HealthPermission.Workout,
  [SportActivity.Yoga]: HealthPermission.Workout,
};

const workoutSportActivityHealthKitMap: Record<
  SportActivity,
  HealthActivity[]
> = {
  [SportActivity.Badminton]: [HealthActivity.Badminton],
  [SportActivity.Baseball]: [HealthActivity.Baseball],
  [SportActivity.Basketball]: [HealthActivity.Basketball],
  [SportActivity.Biking]: [HealthActivity.Cycling],
  [SportActivity.Boxing]: [HealthActivity.Boxing],
  [SportActivity.Cricket]: [HealthActivity.Cricket],
  [SportActivity.Dancing]: [
    HealthActivity.SocialDance,
    HealthActivity.CardioDance,
  ],
  [SportActivity.Elliptical]: [HealthActivity.Elliptical],
  [SportActivity.Fencing]: [HealthActivity.Fencing],
  [SportActivity.Football]: [HealthActivity.Soccer],
  [SportActivity.FootballAmerican]: [HealthActivity.AmericanFootball],
  [SportActivity.FootballAustralian]: [HealthActivity.AustralianFootball],
  [SportActivity.Frisbee]: [HealthActivity.DiscSports],
  [SportActivity.Golf]: [HealthActivity.Golf],
  [SportActivity.Gymnastics]: [HealthActivity.Gymnastics],
  [SportActivity.Handball]: [HealthActivity.Handball],
  [SportActivity.Hiking]: [HealthActivity.Hiking],
  [SportActivity.Hockey]: [HealthActivity.Hockey],
  [SportActivity.MartialArts]: [HealthActivity.MartialArts],
  [SportActivity.Paddling]: [HealthActivity.PaddleSports],
  [SportActivity.Pilates]: [HealthActivity.Pilates],
  [SportActivity.Racquetball]: [HealthActivity.Racquetball],
  [SportActivity.RockClimbing]: [HealthActivity.Climbing],
  [SportActivity.Rowing]: [HealthActivity.Rowing],
  [SportActivity.Rugby]: [HealthActivity.Rugby],
  [SportActivity.Running]: [HealthActivity.Running],
  [SportActivity.Sailing]: [HealthActivity.Sailing],
  [SportActivity.Skating]: [HealthActivity.SkatingSports],
  [SportActivity.Skiing]: [
    HealthActivity.CrossCountrySkiing,
    HealthActivity.DownhillSkiing,
  ],
  [SportActivity.Snowboarding]: [HealthActivity.Snowboarding],
  [SportActivity.Softball]: [HealthActivity.Softball],
  [SportActivity.Squash]: [HealthActivity.Squash],
  [SportActivity.StairClimbing]: [
    HealthActivity.StairClimbing,
    HealthActivity.Stairs,
  ],
  [SportActivity.StrengthTraining]: [
    HealthActivity.FunctionalStrengthTraining,
    HealthActivity.TraditionalStrengthTraining,
  ],
  [SportActivity.Stretching]: [
    HealthActivity.Cooldown,
    HealthActivity.PreparationAndRecovery,
  ],
  [SportActivity.Surfing]: [HealthActivity.SurfingSports],
  [SportActivity.Swimming]: [HealthActivity.Swimming],
  [SportActivity.TableTennis]: [HealthActivity.TableTennis],
  [SportActivity.Tennis]: [HealthActivity.Tennis],
  [SportActivity.Volleyball]: [HealthActivity.Volleyball],
  [SportActivity.Walking]: [HealthActivity.Walking],
  [SportActivity.WaterPolo]: [HealthActivity.WaterPolo],
  [SportActivity.Wheelchair]: [
    HealthActivity.WheelchairRunPace,
    HealthActivity.WheelchairWalkPace,
  ],
  [SportActivity.Yoga]: [HealthActivity.Yoga],
};

const otherActivityFunctionMap = {
  [OtherActivity.ActiveCaloriesBurned]: HealthKit.getActiveEnergyBurned, // Uses Start and end date
  [OtherActivity.FloorsClimbed]: HealthKit.getFlightsClimbed, // Uses the date field
  [OtherActivity.Steps]: HealthKit.getStepCount, // Uses the date field
};

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

  getData(
    options: CaloriesOnlyOptions | CountOnlyOptions | SportOptions
  ): Promise<number> {
    if (!this.permissionGranted) {
      throw new Error(
        "Error: Requesting data before having all permissions will crash the application"
      );
    }

    if (options.type === "sport") {
      return this.getActivityData({ ...options, activity: options.activity });
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
      type: HealthObserver.Workout,
    };

    return new Promise<number>((resolve, reject) => {
      HealthKit.getSamples(baseOptionsObject, (err, results: unknown[]) => {
        if (err) {
          reject(err);
          return;
        }

        for (const result of results) {
          console.log(result);
        }
        resolve(2);
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
