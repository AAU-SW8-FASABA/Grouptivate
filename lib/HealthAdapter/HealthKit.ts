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
  [OtherActivity.WheelchairPushes]: HealthPermission.ActiveEnergyBurned, // Shit
  [SportActivity.Badminton]: HealthPermission.ActiveEnergyBurned,
  [SportActivity.Baseball]: HealthPermission.ActiveEnergyBurned,
  [SportActivity.Basketball]: HealthPermission.ActiveEnergyBurned,
  [SportActivity.Biking]: HealthPermission.ActiveEnergyBurned,
  [SportActivity.Boxing]: HealthPermission.ActiveEnergyBurned,
  [SportActivity.Cricket]: HealthPermission.ActiveEnergyBurned,
  [SportActivity.Dancing]: HealthPermission.ActiveEnergyBurned,
  [SportActivity.Elliptical]: HealthPermission.ActiveEnergyBurned,
  [SportActivity.Fencing]: HealthPermission.ActiveEnergyBurned,
  [SportActivity.Football]: HealthPermission.ActiveEnergyBurned,
  [SportActivity.FootballAmerican]: HealthPermission.ActiveEnergyBurned,
  [SportActivity.FootballAustralian]: HealthPermission.ActiveEnergyBurned,
  [SportActivity.Frisbee]: HealthPermission.ActiveEnergyBurned,
  [SportActivity.Golf]: HealthPermission.ActiveEnergyBurned,
  [SportActivity.Gymnastics]: HealthPermission.ActiveEnergyBurned,
  [SportActivity.Handball]: HealthPermission.ActiveEnergyBurned,
  [SportActivity.Hiking]: HealthPermission.ActiveEnergyBurned,
  [SportActivity.Hockey]: HealthPermission.ActiveEnergyBurned,
  [SportActivity.MartialArts]: HealthPermission.ActiveEnergyBurned,
  [SportActivity.Other]: HealthPermission.ActiveEnergyBurned,
  [SportActivity.Paddling]: HealthPermission.ActiveEnergyBurned,
  [SportActivity.Pilates]: HealthPermission.ActiveEnergyBurned,
  [SportActivity.Racquetball]: HealthPermission.ActiveEnergyBurned,
  [SportActivity.RockClimbing]: HealthPermission.ActiveEnergyBurned,
  [SportActivity.Rowing]: HealthPermission.ActiveEnergyBurned,
  [SportActivity.Rugby]: HealthPermission.ActiveEnergyBurned,
  [SportActivity.Running]: HealthPermission.ActiveEnergyBurned,
  [SportActivity.Sailing]: HealthPermission.ActiveEnergyBurned,
  [SportActivity.ScubaDiving]: HealthPermission.ActiveEnergyBurned,
  [SportActivity.Skating]: HealthPermission.ActiveEnergyBurned,
  [SportActivity.Skiing]: HealthPermission.ActiveEnergyBurned,
  [SportActivity.Snowboarding]: HealthPermission.ActiveEnergyBurned,
  [SportActivity.Softball]: HealthPermission.ActiveEnergyBurned,
  [SportActivity.Squash]: HealthPermission.ActiveEnergyBurned,
  [SportActivity.StairClimbing]: HealthPermission.ActiveEnergyBurned,
  [SportActivity.StrengthTraining]: HealthPermission.ActiveEnergyBurned,
  [SportActivity.Stretching]: HealthPermission.ActiveEnergyBurned,
  [SportActivity.Surfing]: HealthPermission.ActiveEnergyBurned,
  [SportActivity.Swimming]: HealthPermission.ActiveEnergyBurned,
  [SportActivity.TableTennis]: HealthPermission.ActiveEnergyBurned,
  [SportActivity.Tennis]: HealthPermission.ActiveEnergyBurned,
  [SportActivity.Volleyball]: HealthPermission.ActiveEnergyBurned,
  [SportActivity.Walking]: HealthPermission.ActiveEnergyBurned,
  [SportActivity.WaterPolo]: HealthPermission.ActiveEnergyBurned,
  [SportActivity.Weightlifting]: HealthPermission.ActiveEnergyBurned,
  [SportActivity.Wheelchair]: HealthPermission.ActiveEnergyBurned,
  [SportActivity.Yoga]: HealthPermission.ActiveEnergyBurned,
};

class HealthKitAdapter extends HealthAdapter {
  getData(
    options: CaloriesOnlyOptions | CountOnlyOptions | SportOptions
  ): Promise<number> {
    throw new Error("Method not implemented.");
  }
}
