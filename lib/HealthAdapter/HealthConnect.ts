import { OtherActivity, SportActivity } from "../API/schemas/Activity";
import { activityMapping } from "./HealthConnect/HealthConnectConstants";
import {
  CaloriesOnlyOptions,
  CountOnlyOptions,
  HealthAdapter,
  InsertOptions,
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
  DeviceType,
  RecordingMethod,
} from "react-native-health-connect";
import { RecordEnum } from "./HealthConnect/HealthConnectRecordEnum";
import { Metric } from "../API/schemas/Metric";

class HealthConnectAdapter extends HealthAdapter {
  private _hasPermission: PermissionLevel;
  private _hasHealthConnect: boolean;
  private _isInitialized: boolean;

  constructor() {
    super();
    this._hasPermission = PermissionLevel.None;
    this._hasHealthConnect = false;
    this._isInitialized = false;
  }
  get permissionGranted(): PermissionLevel {
    return this._hasPermission;
  }

  get hasHealthConnect(): boolean {
    return this._hasHealthConnect;
  }

  async init(requestWrite: boolean = false): Promise<void> {
    try {
      const hasWritePermission: boolean = requestWrite && __DEV__;

      const checkAvailability = async () => {
        const status = await getSdkStatus();
        if (status === SdkAvailabilityStatus.SDK_AVAILABLE) {
          this._hasHealthConnect = true;
          console.log("SDK is available");
        }
        if (status === SdkAvailabilityStatus.SDK_UNAVAILABLE) {
          console.log("SDK is not available");
        }
        if (
          status ===
          SdkAvailabilityStatus.SDK_UNAVAILABLE_PROVIDER_UPDATE_REQUIRED
        ) {
          console.log(
            "SDK is not available, provider update or install required"
          );
        }
      };

      this._isInitialized = await initialize();
      if (this._hasHealthConnect && hasWritePermission) {
        const permissions = await requestPermission([
          { accessType: "read", recordType: "ActiveCaloriesBurned" },
          { accessType: "read", recordType: "ExerciseSession" },
          { accessType: "read", recordType: "Steps" },
          { accessType: "read", recordType: "Distance" },
          { accessType: "read", recordType: "FloorsClimbed" },
          { accessType: "read", recordType: "WheelchairPushes" },
          { accessType: "write", recordType: "ActiveCaloriesBurned" },
          { accessType: "write", recordType: "ExerciseSession" },
          { accessType: "write", recordType: "Steps" },
          { accessType: "write", recordType: "Distance" },
          { accessType: "write", recordType: "FloorsClimbed" },
          { accessType: "write", recordType: "WheelchairPushes" },
        ]);

        if (permissions.length > 0) {
          this._hasPermission = PermissionLevel.ReadWrite;
        }
      } else if (this._hasHealthConnect) {
        const permissions = await requestPermission([
          { accessType: "read", recordType: "ActiveCaloriesBurned" },
          { accessType: "read", recordType: "ExerciseSession" },
          { accessType: "read", recordType: "Steps" },
          { accessType: "read", recordType: "Distance" },
          { accessType: "read", recordType: "FloorsClimbed" },
          { accessType: "read", recordType: "WheelchairPushes" },
        ]);

        if (permissions.length > 0) {
          this._hasPermission = PermissionLevel.Read;
        }
      }
    } catch (err) {
      console.log("Connection failed", err);
    }
  }

  async getData(
    options: CaloriesOnlyOptions | CountOnlyOptions | SportOptions
  ): Promise<number> {
    if (this._isInitialized) {
      switch (options.type) {
        case "sport":
          return await this.getActivityData(options);
        case "calories":
          return await this.getOtherData(options);
        case "count":
          return await this.getOtherData(options);
      }
    } else {
      throw Error("HealthConnect is not initialized");
    }
  }

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
        }
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

  async getOtherData(
    options: CountOnlyOptions | CaloriesOnlyOptions
  ): Promise<number> {
    if (options.activity == OtherActivity.ActiveCaloriesBurned) {
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
          }
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

    if (options.activity == OtherActivity.Steps) {
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

    if (options.activity == OtherActivity.FloorsClimbed) {
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

  private async getSportCalories(
    startDate: Date,
    endDate: Date
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

  async insertData(data?: InsertOptions): Promise<void> {
    if (!data) {
      try {
        insertRecords([
          {
            recordType: "ActiveCaloriesBurned",
            energy: { unit: "kilocalories", value: 10000 },
            startTime: new Date(2020, 6, 2, 6, 0, 0).toISOString(),
            endTime: new Date(2020, 6, 2, 6, 30, 0).toISOString(),
            metadata: {
              recordingMethod:
                RecordingMethod.RECORDING_METHOD_AUTOMATICALLY_RECORDED,
              device: {
                manufacturer: "Google",
                model: "Pixel 4",
                type: DeviceType.TYPE_PHONE,
              },
            },
          },
        ]).then((ids) => {
          console.log("Records inserted ", { ids });
        });
      } catch (err) {
        console.log("Could not insert default data", err);
        throw new Error("Could not insert default data");
      }
    } else {
      switch (data.type) {
        case "count":
          if (data.activity === OtherActivity.FloorsClimbed) {
            await this.insertFloorsClimbedData(data);
          } else {
            await this.insertStepCountData(data);
          }
          break;

        case "sport":
          let activity: number = activityMapping[data.activity].indexOf(0);
          await this.insertSportData(data, activity);
      }
    }
  }

  private async insertFloorsClimbedData(data: InsertOptions): Promise<void> {
    try {
      await insertRecords([
        {
          recordType: RecordEnum.FloorsClimbed,
          floors: 26700,
          startTime: data.startDate.toISOString(),
          endTime: data.endDate.toISOString(),
          metadata: {
            recordingMethod:
              RecordingMethod.RECORDING_METHOD_AUTOMATICALLY_RECORDED,
            device: {
              manufacturer: "Google",
              model: "Pixel 4",
              type: DeviceType.TYPE_PHONE,
            },
          },
        },
      ]).then((ids) => {
        console.log("Records inserted", { ids });
      });
    } catch (error) {}
  }

  private async insertStepCountData(data: InsertOptions): Promise<void> {
    try {
      await insertRecords([
        {
          recordType: RecordEnum.Steps,
          count: 1,
          startTime: data.startDate.toISOString(),
          endTime: data.endDate.toISOString(),
          metadata: {
            recordingMethod:
              RecordingMethod.RECORDING_METHOD_AUTOMATICALLY_RECORDED,
            device: {
              manufacturer: "Google",
              model: "Pixel 7",
              type: DeviceType.TYPE_PHONE,
            },
          },
        },
      ]).then((ids) => {
        console.log("Records inserted", { ids });
      });
    } catch (error) {}
  }

  private async insertSportData(
    data: InsertOptions,
    activity: number
  ): Promise<void> {
    try {
      await insertRecords([
        {
          recordType: RecordEnum.ExerciseSession,
          exerciseType: activity,
          startTime: data.startDate.toISOString(),
          endTime: data.endDate.toISOString(),
          title: "BingBong",
          metadata: {
            recordingMethod: RecordingMethod.RECORDING_METHOD_ACTIVELY_RECORDED,
            device: {
              manufacturer: "Google",
              model: "Pixel 6",
              type: DeviceType.TYPE_PHONE,
            },
          },
        },
        {
          recordType: RecordEnum.ActiveCaloriesBurned,
          energy: {
            value: 720,
            unit: "calories",
          },
          startTime: data.startDate.toISOString(),
          endTime: data.endDate.toISOString(),
          metadata: {
            recordingMethod:
              RecordingMethod.RECORDING_METHOD_AUTOMATICALLY_RECORDED,
            device: {
              manufacturer: "Google",
              model: "Pixel 6",
              type: DeviceType.TYPE_PHONE,
            },
          },
        },
      ]);
    } catch (error) {}
  }
}
