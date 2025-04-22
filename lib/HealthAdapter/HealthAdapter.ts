import { Interval } from "../API/schemas/Interval";
import { Metric } from "../API/schemas/Metric";
import { OtherActivity, SportActivity } from "../API/schemas/Activity";

export interface CaloriesOnlyOptions {
  type: "calories";
  activity: OtherActivity.ActiveCaloriesBurned;
  metric: Metric.Calories;
  startDate: Date;
  endDate: Date;
}

export interface CountOnlyOptions {
  type: "count";
  activity: OtherActivity.FloorsClimbed | OtherActivity.Steps;
  metric: Metric.Count;
  startDate: Date;
  endDate: Date;
}

export interface SportOptions {
  type: "sport";
  activity: SportActivity;
  metric: Metric;
  startDate: Date;
  endDate: Date;
}

export enum PermissionLevel {
  None = "None",
  Read = "Read",
  ReadWrite = "ReadWrite",
}

export abstract class HealthAdapter {
  abstract get permissionGranted(): PermissionLevel;

  abstract init(): Promise<void>;
  abstract getData(
    options: CaloriesOnlyOptions | CountOnlyOptions | SportOptions
  ): Promise<number>;
}
