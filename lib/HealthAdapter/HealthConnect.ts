import { OtherActivity } from "../API/schemas/Activity";
import { activityMapping } from "./HealthConnect/HealthConnectConstants";
import {
  CaloriesOnlyOptions,
  CountOnlyInsertOption,
  CountOnlyOptions,
  HealthAdapter,
  InsertOptions,
  isCountOnlyOptions,
  isSportOptions,
  PermissionLevel,
  SportOptions,
} from "./HealthAdapter";

import {
  initialize,
  requestPermission,
  getSdkStatus,
  SdkAvailabilityStatus,
  readRecords,
  insertRecords,
  RecordingMethod,
} from "react-native-health-connect";
import { RecordEnum } from "./HealthConnect/HealthConnectRecordEnum";
import { Metric } from "../API/schemas/Metric";
import {
  Energy,
  Length,
} from "react-native-health-connect/lib/typescript/types/base.types";

type HealthConnectInsertData = {
  activity: number;
  calories: Energy;
  distance: Length;
  startDate: string;
  endDate: string;
};

/* The `HealthConnectAdapter` class extends `HealthAdapter` and provides
methods for initializing, retrieving, and inserting health-related data using a health-connect SDK. */
export class HealthConnectAdapter extends HealthAdapter {
  private _hasPermission: PermissionLevel;
  private _isInitialized: boolean;

  constructor() {
    super();
    this._hasPermission = PermissionLevel.None;
    this._isInitialized = false;
  }
  get permissionGranted(): PermissionLevel {
    return this._hasPermission;
  }

  /**
   * Check if HealthConnect is available on the given platform
   * @returns Promise<boolean>
   */
  static async isAvailable(): Promise<boolean> {
    const status = await getSdkStatus();
    if (status === SdkAvailabilityStatus.SDK_AVAILABLE) {
      console.log("SDK is available");
      return true;
    }
    if (status === SdkAvailabilityStatus.SDK_UNAVAILABLE) {
      console.log("SDK is not available");
      return false;
    }
    if (
      status === SdkAvailabilityStatus.SDK_UNAVAILABLE_PROVIDER_UPDATE_REQUIRED
    ) {
      console.log("SDK is not available, provider update or install required");
      return false;
    }
    console.log("SDK is not available for unknown reason");
    return false;
  }

  /**
   * The `init` function in TypeScript initializes the Health Connect SDK, requests permissions,
   * and handles errors.
   *
   * @param {boolean} [requestWrite=false] - The `requestWrite` parameter in the `init` function is a
   * boolean parameter that determines whether to request write permission. If `requestWrite` is `true`
   * and the application is in development mode (`__DEV__` is true)
   */
  async init(requestWrite: boolean = false): Promise<void> {
    try {
      const hasWritePermission: boolean = requestWrite && __DEV__;

      this._isInitialized = await initialize();
      if (hasWritePermission) {
        const permissions = await requestPermission([
          { accessType: "read", recordType: "ActiveCaloriesBurned" },
          { accessType: "read", recordType: "ExerciseSession" },
          { accessType: "read", recordType: "Steps" },
          { accessType: "read", recordType: "Distance" },
          { accessType: "read", recordType: "FloorsClimbed" },
          { accessType: "write", recordType: "ActiveCaloriesBurned" },
          { accessType: "write", recordType: "ExerciseSession" },
          { accessType: "write", recordType: "Steps" },
          { accessType: "write", recordType: "Distance" },
          { accessType: "write", recordType: "FloorsClimbed" },
        ]);

        if (permissions.length > 0) {
          this._hasPermission = PermissionLevel.ReadWrite;
        }
      } else {
        const permissions = await requestPermission([
          { accessType: "read", recordType: "ActiveCaloriesBurned" },
          { accessType: "read", recordType: "ExerciseSession" },
          { accessType: "read", recordType: "Steps" },
          { accessType: "read", recordType: "Distance" },
          { accessType: "read", recordType: "FloorsClimbed" },
        ]);

        if (permissions.length > 0) {
          this._hasPermission = PermissionLevel.Read;
        }
      }
    } catch (err) {
      console.log("Connection failed", err);
    }
  }

  /**
   *
   * @param {CaloriesOnlyOptions | CountOnlyOptions | SportOptions} options
   *
   * @returns The `getData` function returns an amount of the given activity
   */
  async getData(
    options: CaloriesOnlyOptions | CountOnlyOptions | SportOptions,
  ): Promise<number> {
    if (this._isInitialized) {
      if (isSportOptions(options)) {
        return await this.getActivityData(options);
      } else {
        return await this.getOtherData(options);
      }
    } else {
      throw Error("HealthConnect is not initialized");
    }
  }

  /**
   * The function `getActivityData` retrieves and calculates activity data based on specified options
   * such as activity type, date range, and metric.
   * @param {SportOptions} options
   * @returns The `getActivityData` function is returning a number of the amount of sport done
   */
  async getActivityData(options: SportOptions): Promise<number> {
    let result: number = 0;
    let activityNums: number[] = activityMapping[options.activity];

    try {
      const exerciseSessionRecords = await readRecords(
        RecordEnum.ExerciseSession,
        {
          timeRangeFilter: {
            operator: "between",
            startTime: options.startDate.toISOString(),
            endTime: options.endDate.toISOString(),
          },
        },
      );

      exerciseSessionRecords.records.forEach(async (record) => {
        if (activityNums.includes(record.exerciseType)) {
          let start: Date = new Date(record.startTime);
          let end: Date = new Date(record.endTime);

          switch (options.metric) {
            case Metric.Duration:
              result += Math.floor((end.getTime() - start.getTime()) / 1000);
            case Metric.Distance:
              result += await this.getSportDistance(start, end);
            case Metric.Count:
              result += 1;
            case Metric.Calories:
              result += await this.getSportCalories(start, end);
          }
        }
      });

      return result;
    } catch (err) {
      console.log("Could not read distance of activity:", err);
      throw new Error("Could not read distance of activity");
    }
  }

  /**
   * The function `getOtherData` retrieves data based on the specified activity type such as active
   * calories burned, steps, or floors climbed within a given time range.
   *
   * @param {CountOnlyOptions | CaloriesOnlyOptions} options
   *
   * @returns The function `getOtherData` returns a Promise that resolves to a number. The specific
   * number returned depends on the activity specified in the `options` parameter.
   */
  async getOtherData(
    options: CountOnlyOptions | CaloriesOnlyOptions,
  ): Promise<number> {
    if (options.activity === OtherActivity.ActiveCaloriesBurned) {
      try {
        let calorieTotal: number = 0;

        const calorieRecords = await readRecords(
          RecordEnum.ActiveCaloriesBurned,
          {
            timeRangeFilter: {
              operator: "between",
              startTime: options.startDate.toISOString(),
              endTime: options.endDate.toISOString(),
            },
          },
        );

        calorieRecords.records.forEach((record) => {
          calorieTotal += record.energy.inCalories;
        });

        return calorieTotal;
      } catch (err) {
        console.log("Could not read active calories burned:", err);
        throw new Error("Could not read active calories burned");
      }
    }

    if (options.activity === OtherActivity.Steps) {
      try {
        let stepCount: number = 0;

        const stepsRecords = await readRecords(RecordEnum.Steps, {
          timeRangeFilter: {
            operator: "between",
            startTime: options.startDate.toISOString(),
            endTime: options.endDate.toISOString(),
          },
        });

        stepsRecords.records.forEach((record) => {
          stepCount += record.count;
        });

        return stepCount;
      } catch (err) {
        console.log("Could not fetch steps:", err);
        throw new Error("Could not fetch steps");
      }
    }

    if (options.activity === OtherActivity.FloorsClimbed) {
      try {
        let floorsClimbedCount = 0;

        const floorsClimbed = await readRecords(RecordEnum.FloorsClimbed, {
          timeRangeFilter: {
            operator: "between",
            startTime: options.startDate.toISOString(),
            endTime: options.startDate.toISOString(),
          },
        });

        floorsClimbed.records.forEach((record) => {
          floorsClimbedCount += record.floors;
        });

        return floorsClimbedCount;
      } catch (err) {
        console.log("Could not read floors climbed:", err);
        throw new Error("Could not read floors climbed");
      }
    }

    readRecords("FloorsClimbed", {
      timeRangeFilter: {
        operator: "between",
        startTime: options.startDate.toISOString(),
        endTime: options.endDate.toISOString(),
      },
    });
    return 1;
  }

  /**
   * Retrieves the total distance covered during a specified time range for a
   * sport activity.
   * @param {Date} start - The `start` parameter is a Date object representing the start time for the
   * activity data you are trying to retrieve.
   * @param {Date} end - The `end` parameter in the `getSportDistance` function represents the end time
   *
   * @returns The `getSportDistance` function returns a Promise that resolves to a number representing
   * the total distance covered in meters for a specific sport activity within the given time range.
   */
  private async getSportDistance(start: Date, end: Date): Promise<number> {
    try {
      let distance: number = 0;
      const distRecord = await readRecords(RecordEnum.Distance, {
        timeRangeFilter: {
          operator: "between",
          startTime: start.toISOString(),
          endTime: end.toISOString(),
        },
      });
      distRecord.records.forEach((record) => {
        distance += record.distance.inMeters;
      });

      return distance;
    } catch (err) {
      console.log("Could not read distance of activity:", err);
      throw new Error("Could not read distance of activity");
    }
  }

  /**
   * The function `getSportCalories` retrieves the total calories burned during a specified time range
   * for sport activities.
   *
   * @param {Date} startDate - The `startDate` parameter represents the starting date and time
   * @param {Date} endDate - The `endDate` parameter represents the ending date and time
   *
   * @returns The `getSportCalories` function returns a Promise that resolves to a number representing
   * the total calories burned during a sport activity within the specified time range.
   */
  private async getSportCalories(
    startDate: Date,
    endDate: Date,
  ): Promise<number> {
    try {
      let calResult: number = 0;

      let calRecord = await readRecords(RecordEnum.ActiveCaloriesBurned, {
        timeRangeFilter: {
          operator: "between",
          startTime: startDate.toISOString(),
          endTime: endDate.toISOString(),
        },
      });

      calRecord.records.forEach((record) => {
        calResult += record.energy.inCalories;
      });

      return calResult;
    } catch (err) {
      console.log("Could not read calories of sport activity:", err);
      throw new Error("Could not read calories of sport activity");
    }
  }

  /**
   * The `insertData` function in TypeScript inserts default or specific health data records based on
   * the provided options.
   * @param {InsertOptions} [data] - The `insertData` function is an asynchronous function that takes
   * an optional parameter `data` of type `InsertOptions`. If the `data` parameter is not provided, it
   * inserts a default record of ActiveCaloriesBurned with specific details like energy, start time,
   * end time, and metadata.
   */
  async insertData(data?: InsertOptions): Promise<void> {
    if (!data) {
      try {
        await insertRecords([
          {
            recordType: RecordEnum.Steps,
            count: 100,
            startTime: new Date(2020, 6, 2, 6, 0, 0).toISOString(),
            endTime: new Date(2020, 6, 2, 6, 30, 0).toISOString(),
          },
        ]).then((ids) => {
          console.log("Records inserted ", { ids });
        });
      } catch (err) {
        console.log("Could not insert default data", err);
        throw new Error("Could not insert default data");
      }
    } else {
      if (isSportOptions(data)) {
        const activities: number[] = activityMapping[data.activity];
        const activity: number = activities?.[0];
        const sportInsertData: HealthConnectInsertData = {
          activity: activity,
          distance: {
            value: data.distance,
            unit: "meters",
          },
          calories: {
            value: data.caloriesBurned,
            unit: "calories",
          },
          startDate: data.startDate.toISOString(),
          endDate: data.endDate.toISOString(),
        };
        await this.insertSportData(sportInsertData);
      } else if (isCountOnlyOptions(data)) {
        if (data.activity === OtherActivity.FloorsClimbed) {
          await this.insertFloorsClimbedData(data);
        } else {
          await this.insertStepCountData(data);
        }
      }
    }
  }

  /**
   * The function `insertFloorsClimbedData` inserts records of climbed floors data with specific
   * details into Health Connect.
   *
   * @param {InsertOptions} data - Contains the timerange for the data and the amount of Floors climbed.
   *
   */
  private async insertFloorsClimbedData(
    data: CountOnlyInsertOption,
  ): Promise<void> {
    try {
      await insertRecords([
        {
          recordType: RecordEnum.FloorsClimbed,
          floors: data.count,
          startTime: data.startDate.toISOString(),
          endTime: data.endDate.toISOString(),
          metadata: {
            recordingMethod:
              RecordingMethod.RECORDING_METHOD_AUTOMATICALLY_RECORDED,
          },
        },
      ]).then((ids) => {
        console.log("Records inserted", { ids });
      });
    } catch (error) {
      console.log("Could not create record: ", error);
      throw new Error("Could not create record");
    }
  }

  /**
   * The function `insertStepCountData` inserts step count data with specific details into Health Connect
   *
   * @param {InsertOptions} data - Contains the timerange for the data and the amount of steps.
   */
  private async insertStepCountData(
    data: CountOnlyInsertOption,
  ): Promise<void> {
    try {
      await insertRecords([
        {
          recordType: RecordEnum.Steps,
          count: data.count,
          startTime: data.startDate.toISOString(),
          endTime: data.endDate.toISOString(),
          metadata: {
            recordingMethod:
              RecordingMethod.RECORDING_METHOD_AUTOMATICALLY_RECORDED,
          },
        },
      ]).then((ids) => {
        console.log("Records inserted with count: ", data.count, { ids });
      });
    } catch (error) {
      console.log("Could not insert step count data", error);
      throw new Error("Could not insert step count data");
    }
  }

  /**
   * The function `insertSportData` asynchronously inserts exercise session and active calories burned
   * records with specified data.
   *
   * @param {InsertOptions} data - Contains the data for creating a exercise session enrty.
   * @param {number} activity - The `activity` parameter in the `insertSportData` function represents
   * the type of exercise activity being recorded. It is a number that corresponds to a specific
   * exercise type.
   */
  private async insertSportData(data: HealthConnectInsertData): Promise<void> {
    try {
      let ids = await insertRecords([
        {
          recordType: RecordEnum.ExerciseSession,
          exerciseType: data.activity,
          startTime: data.startDate,
          endTime: data.endDate,
          title: "BingBong",
          metadata: {
            recordingMethod: RecordingMethod.RECORDING_METHOD_ACTIVELY_RECORDED,
          },
        },
      ]);
      console.log("Inserted: ", ids);

      if (data.calories.value > 0) {
        let calorieInsert = await insertRecords([
          {
            recordType: RecordEnum.ActiveCaloriesBurned,
            energy: data.calories,
            startTime: data.startDate,
            endTime: data.endDate,
            metadata: {
              recordingMethod:
                RecordingMethod.RECORDING_METHOD_ACTIVELY_RECORDED,
            },
          },
        ]);
        console.log(`Inserted calories: ${calorieInsert}`);
      }
      if (data.distance.value > 0) {
        let distanceInsert = await insertRecords([
          {
            recordType: RecordEnum.Distance,
            startTime: data.startDate,
            endTime: data.endDate,
            distance: data.distance,
            metadata: {
              recordingMethod:
                RecordingMethod.RECORDING_METHOD_ACTIVELY_RECORDED,
            },
          },
        ]);
        console.log(`Inserted distance: ${distanceInsert}`);
      }
    } catch (error) {
      console.log("Could not insert sport session", error);
      throw new Error("Could not insert sport session");
    }
  }
}
