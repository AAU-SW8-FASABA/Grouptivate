import {
  OtherActivity,
  SportActivity,
  SportActivitySchema,
} from "../API/schemas/Activity";
import {
  activityMapping,
  metricMap,
} from "./HealthConnect/HealthConnectConstants";
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
  ActiveCaloriesBurnedRecord,
} from "react-native-health-connect";

import type {
  ReadRecordsResult,
  RecordResult,
  HealthConnectRecordResult,
  HealthConnectRecord,
  RecordType,
} from "react-native-health-connect";
import { RecordEnum } from "./HealthConnect/HealthConnectRecordEnum";

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
          return this.getActivityData(options);
        case "calories":
        case "count":
          return this.getOtherData(options);
      }
    } else {
      throw Error("HealthConnect is not initialized");
    }
  }

  getActivityData(options: SportOptions): number {
    return 1;
  }

  async getOtherData(
    options: CountOnlyOptions | CaloriesOnlyOptions
  ): Promise<number> {
    if (options.activity == OtherActivity.ActiveCaloriesBurned) {
      try {
        const calorieRecords = await readRecords("ActiveCaloriesBurned", {
          timeRangeFilter: {
            operator: "between",
            startTime: options.startDate.toISOString(),
            endTime: options.endDate.toISOString(),
          },
        });

        calorieRecords.records.forEach((record) => {
          record;
        });
      } catch (err) {}
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

  insertData(data?: InsertOptions): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
