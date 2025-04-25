import { Metric } from "../API/schemas/Metric";
import { OtherActivity, SportActivity } from "../API/schemas/Activity";

/**
 * Base options
 */
export interface DefaultOptions {
  startDate: Date;
  endDate: Date;
  activity: SportActivity | OtherActivity;
  metric: Metric;
}

/**
 * Options that limit the metric based on activity
 */
export interface CaloriesOnlyOptions extends DefaultOptions {
  activity: OtherActivity.ActiveCaloriesBurned;
  metric: Metric.Calories;
}
export function isCaloriesOnlyOptions(options: {
  activity: string;
}): options is CaloriesOnlyOptions {
  return OtherActivity.ActiveCaloriesBurned === options.activity;
}

export interface CountOnlyOptions extends DefaultOptions {
  activity: OtherActivity.FloorsClimbed | OtherActivity.Steps;
  metric: Metric.Count;
}
export function isCountOnlyOptions(options: {
  activity: string;
}): options is CountOnlyOptions {
  return (
    OtherActivity.FloorsClimbed === options.activity ||
    OtherActivity.Steps === options.activity
  );
}

export interface SportOptions extends DefaultOptions {
  activity: SportActivity;
  metric: Metric;
}
export function isSportOptions(options: {
  activity: string;
}): options is SportOptions {
  return Object.keys(SportActivity).includes(options.activity);
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

export type CountOnlyInsertOptions = Omit<CountOnlyOptions, "metric"> & {
  count: number;
};
export function isCountOnlyInsertOptions(options: {
  activity: string;
}): options is CountOnlyInsertOptions {
  return isCountOnlyOptions(options);
}

export type SportInsertOptions = Omit<SportOptions, "metric"> & {
  distance: number;
  caloriesBurned: number;
};
export function isSportInsertOptions(options: {
  activity: string;
}): options is SportInsertOptions {
  return isSportOptions(options);
}

export enum PermissionLevel {
  None = "None",
  Read = "Read",
  ReadWrite = "ReadWrite",
}

export abstract class HealthAdapter {
  abstract get permissionGranted(): PermissionLevel;

  abstract init(): Promise<void>;
  abstract getData(options: DefaultOptions): Promise<number>;
  abstract insertData(data?: InsertOptions): Promise<void>;
}
