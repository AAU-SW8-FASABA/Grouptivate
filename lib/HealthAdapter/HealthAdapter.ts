import { Interval } from "../API/schemas/Interval";
import { Metric } from "../API/schemas/Metric";
import { OtherActivity, SportActivity } from "../API/schemas/Activity";

/**
 * Base options
 */
export interface DefaultOptions {
  startDate: Date;
  endDate: Date;
}

/**
 * Options that limit the metric based on activity
 */
export interface CaloriesOnlyOptions extends DefaultOptions {
  type: "calories";
  activity: OtherActivity.ActiveCaloriesBurned;
  metric: Metric.Calories;
}

export interface CountOnlyOptions extends DefaultOptions {
  type: "count";
  activity: OtherActivity.FloorsClimbed | OtherActivity.Steps;
  metric: Metric.Count;
}

export interface SportOptions extends DefaultOptions {
  type: "sport";
  activity: SportActivity;
  metric: Metric;
}

/**
 * Insert options that remove metric and adds required fields
 */
export type InsertOptions =
  | (Omit<CountOnlyOptions, "metric"> & {
      count: number;
    })
  | (Omit<SportOptions, "metric"> & {
      distance: number;
      caloriesBurned: number;
    });

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
  abstract insertData(data?: InsertOptions): Promise<void>;
}
