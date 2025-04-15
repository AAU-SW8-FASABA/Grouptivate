import {
  CaloriesOnlyOptions,
  CountOnlyOptions,
  HealthAdapter,
  SportOptions,
} from "./HealthAdapter";
import { OtherActivity, SportActivity } from "../API/schemas/Activity";

import HealthKit, {
  HealthValue,
  HealthKitPermissions,
  HealthInputOptions,
  HealthPermission,
} from "react-native-health";

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
  [SportActivity.Other]: HealthPermission.Workout,
  [SportActivity.Padding]: HealthPermission.Workout,
  [SportActivity.Pilates]: HealthPermission.Workout,
  [SportActivity.Racquetball]: HealthPermission.Workout,
  [SportActivity.RockClimbing]: HealthPermission.Workout,
  [SportActivity.Rowing]: HealthPermission.Workout,
  [SportActivity.Rugby]: HealthPermission.Workout,
  [SportActivity.Running]: HealthPermission.Workout,
  [SportActivity.Sailing]: HealthPermission.Workout,
  [SportActivity.ScubaDiving]: HealthPermission.Workout,
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
  [SportActivity.Weightlifting]: HealthPermission.Workout,
  [SportActivity.Wheelchair]: HealthPermission.Workout,
  [SportActivity.Yoga]: HealthPermission.Workout,
  [OtherActivity.WheelchairPushes]: HealthPermission.ActiveEnergyBurned, // MARK: Remove this from the API as it is not supported by the package
};

class HealthKitAdapter extends HealthAdapter {
  init(): Promise<void> {
    const permissionSet: Set<HealthPermission> = new Set(
      Object.values(permissionMap)
    );

    return new Promise((resolve, reject) => {});
  }
  getData(
    options: CaloriesOnlyOptions | CountOnlyOptions | SportOptions
  ): Promise<number> {
    throw new Error("Method not implemented.");
  }
}
