import { Interval } from "../API/schemas/Interval";
import { Metric } from "../API/schemas/Metric";
import { OtherActivity, SportActivity } from "../API/schemas/Activity";

export interface CaloriesOnlyOptions {
    activity: OtherActivity.ActiveCaloriesBurned;
    metric: Metric.Calories;
    startDate: Date;
    endDate: Date;
}

export interface CountOnlyOptions {
    activity: OtherActivity.FloorsClimbed | OtherActivity.Steps | OtherActivity.WheelchairPushes;
    metric: Metric.Count;
    startDate: Date;
    endDate: Date;
}

export interface SportOptions {
    activity: SportActivity;
    metric: Metric;
    startDate: Date;
    endDate: Date;
}

export abstract class HealthAdapter {
    abstract getData(
        options: CaloriesOnlyOptions | CountOnlyOptions | SportOptions
    ): Promise<number>

    abstract init(): Promise<void>
}