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

export function isSportActivity(value: any): value is SportActivity {
  return Object.values(SportActivity).includes(value);
}

export abstract class HealthAdapter {
  abstract get permissionGranted(): boolean;

  abstract init(): Promise<void>;
  abstract getData(
    options: CaloriesOnlyOptions | CountOnlyOptions | SportOptions
  ): Promise<number>;
}
