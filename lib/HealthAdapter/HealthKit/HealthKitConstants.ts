import { OtherActivity, SportActivity } from "../../API/schemas/Activity";

import HealthKit, {
  HealthActivity,
  HealthPermission,
} from "react-native-health";

export const permissionMap: Record<
  OtherActivity | SportActivity,
  HealthPermission
> = {
  [OtherActivity.ActiveCaloriesBurned]:
    HealthKit.Constants.Permissions.ActiveEnergyBurned,
  [OtherActivity.FloorsClimbed]: HealthKit.Constants.Permissions.FlightsClimbed,
  [OtherActivity.Steps]: HealthKit.Constants.Permissions.StepCount,
  [SportActivity.Badminton]: HealthKit.Constants.Permissions.Workout,
  [SportActivity.Baseball]: HealthKit.Constants.Permissions.Workout,
  [SportActivity.Basketball]: HealthKit.Constants.Permissions.Workout,
  [SportActivity.Biking]: HealthKit.Constants.Permissions.Workout,
  [SportActivity.Boxing]: HealthKit.Constants.Permissions.Workout,
  [SportActivity.Cricket]: HealthKit.Constants.Permissions.Workout,
  [SportActivity.Dancing]: HealthKit.Constants.Permissions.Workout,
  [SportActivity.Elliptical]: HealthKit.Constants.Permissions.Workout,
  [SportActivity.Fencing]: HealthKit.Constants.Permissions.Workout,
  [SportActivity.Football]: HealthKit.Constants.Permissions.Workout,
  [SportActivity.FootballAmerican]: HealthKit.Constants.Permissions.Workout,
  [SportActivity.FootballAustralian]: HealthKit.Constants.Permissions.Workout,
  [SportActivity.Frisbee]: HealthKit.Constants.Permissions.Workout,
  [SportActivity.Golf]: HealthKit.Constants.Permissions.Workout,
  [SportActivity.Gymnastics]: HealthKit.Constants.Permissions.Workout,
  [SportActivity.Handball]: HealthKit.Constants.Permissions.Workout,
  [SportActivity.Hiking]: HealthKit.Constants.Permissions.Workout,
  [SportActivity.Hockey]: HealthKit.Constants.Permissions.Workout,
  [SportActivity.MartialArts]: HealthKit.Constants.Permissions.Workout,
  [SportActivity.Paddling]: HealthKit.Constants.Permissions.Workout,
  [SportActivity.Pilates]: HealthKit.Constants.Permissions.Workout,
  [SportActivity.Racquetball]: HealthKit.Constants.Permissions.Workout,
  [SportActivity.RockClimbing]: HealthKit.Constants.Permissions.Workout,
  [SportActivity.Rowing]: HealthKit.Constants.Permissions.Workout,
  [SportActivity.Rugby]: HealthKit.Constants.Permissions.Workout,
  [SportActivity.Running]: HealthKit.Constants.Permissions.Workout,
  [SportActivity.Sailing]: HealthKit.Constants.Permissions.Workout,
  [SportActivity.Skating]: HealthKit.Constants.Permissions.Workout,
  [SportActivity.Skiing]: HealthKit.Constants.Permissions.Workout,
  [SportActivity.Snowboarding]: HealthKit.Constants.Permissions.Workout,
  [SportActivity.Softball]: HealthKit.Constants.Permissions.Workout,
  [SportActivity.Squash]: HealthKit.Constants.Permissions.Workout,
  [SportActivity.StairClimbing]: HealthKit.Constants.Permissions.Workout,
  [SportActivity.StrengthTraining]: HealthKit.Constants.Permissions.Workout,
  [SportActivity.Stretching]: HealthKit.Constants.Permissions.Workout,
  [SportActivity.Surfing]: HealthKit.Constants.Permissions.Workout,
  [SportActivity.Swimming]: HealthKit.Constants.Permissions.Workout,
  [SportActivity.TableTennis]: HealthKit.Constants.Permissions.Workout,
  [SportActivity.Tennis]: HealthKit.Constants.Permissions.Workout,
  [SportActivity.Volleyball]: HealthKit.Constants.Permissions.Workout,
  [SportActivity.Walking]: HealthKit.Constants.Permissions.Workout,
  [SportActivity.WaterPolo]: HealthKit.Constants.Permissions.Workout,
  [SportActivity.Wheelchair]: HealthKit.Constants.Permissions.Workout,
  [SportActivity.Yoga]: HealthKit.Constants.Permissions.Workout,
};

export const sportActivityHealthKitMap: Record<
  SportActivity,
  HealthActivity[]
> = {
  [SportActivity.Badminton]: [HealthKit.Constants.Activities.Badminton],
  [SportActivity.Baseball]: [HealthKit.Constants.Activities.Baseball],
  [SportActivity.Basketball]: [HealthKit.Constants.Activities.Basketball],
  [SportActivity.Biking]: [HealthKit.Constants.Activities.Cycling],
  [SportActivity.Boxing]: [HealthKit.Constants.Activities.Boxing],
  [SportActivity.Cricket]: [HealthKit.Constants.Activities.Cricket],
  [SportActivity.Dancing]: [
    HealthKit.Constants.Activities.SocialDance,
    HealthKit.Constants.Activities.CardioDance,
  ],
  [SportActivity.Elliptical]: [HealthKit.Constants.Activities.Elliptical],
  [SportActivity.Fencing]: [HealthKit.Constants.Activities.Fencing],
  [SportActivity.Football]: [HealthKit.Constants.Activities.Soccer],
  [SportActivity.FootballAmerican]: [
    HealthKit.Constants.Activities.AmericanFootball,
  ],
  [SportActivity.FootballAustralian]: [
    HealthKit.Constants.Activities.AustralianFootball,
  ],
  [SportActivity.Frisbee]: [HealthKit.Constants.Activities.DiscSports],
  [SportActivity.Golf]: [HealthKit.Constants.Activities.Golf],
  [SportActivity.Gymnastics]: [HealthKit.Constants.Activities.Gymnastics],
  [SportActivity.Handball]: [HealthKit.Constants.Activities.Handball],
  [SportActivity.Hiking]: [HealthKit.Constants.Activities.Hiking],
  [SportActivity.Hockey]: [HealthKit.Constants.Activities.Hockey],
  [SportActivity.MartialArts]: [HealthKit.Constants.Activities.MartialArts],
  [SportActivity.Paddling]: [HealthKit.Constants.Activities.PaddleSports],
  [SportActivity.Pilates]: [HealthKit.Constants.Activities.Pilates],
  [SportActivity.Racquetball]: [HealthKit.Constants.Activities.Racquetball],
  [SportActivity.RockClimbing]: [HealthKit.Constants.Activities.Climbing],
  [SportActivity.Rowing]: [HealthKit.Constants.Activities.Rowing],
  [SportActivity.Rugby]: [HealthKit.Constants.Activities.Rugby],
  [SportActivity.Running]: [HealthKit.Constants.Activities.Running],
  [SportActivity.Sailing]: [HealthKit.Constants.Activities.Sailing],
  [SportActivity.Skating]: [HealthKit.Constants.Activities.SkatingSports],
  [SportActivity.Skiing]: [
    HealthKit.Constants.Activities.CrossCountrySkiing,
    HealthKit.Constants.Activities.DownhillSkiing,
  ],
  [SportActivity.Snowboarding]: [HealthKit.Constants.Activities.Snowboarding],
  [SportActivity.Softball]: [HealthKit.Constants.Activities.Softball],
  [SportActivity.Squash]: [HealthKit.Constants.Activities.Squash],
  [SportActivity.StairClimbing]: [
    HealthKit.Constants.Activities.StairClimbing,
    HealthKit.Constants.Activities.Stairs,
  ],
  [SportActivity.StrengthTraining]: [
    HealthKit.Constants.Activities.FunctionalStrengthTraining,
    HealthKit.Constants.Activities.TraditionalStrengthTraining,
  ],
  [SportActivity.Stretching]: [
    HealthKit.Constants.Activities.Cooldown,
    HealthKit.Constants.Activities.PreparationAndRecovery,
  ],
  [SportActivity.Surfing]: [HealthKit.Constants.Activities.SurfingSports],
  [SportActivity.Swimming]: [HealthKit.Constants.Activities.Swimming],
  [SportActivity.TableTennis]: [HealthKit.Constants.Activities.TableTennis],
  [SportActivity.Tennis]: [HealthKit.Constants.Activities.Tennis],
  [SportActivity.Volleyball]: [HealthKit.Constants.Activities.Volleyball],
  [SportActivity.Walking]: [HealthKit.Constants.Activities.Walking],
  [SportActivity.WaterPolo]: [HealthKit.Constants.Activities.WaterPolo],
  [SportActivity.Wheelchair]: [
    HealthKit.Constants.Activities.WheelchairRunPace,
    HealthKit.Constants.Activities.WheelchairWalkPace,
  ],
  [SportActivity.Yoga]: [HealthKit.Constants.Activities.Yoga],
};

export const otherActivityFunctionMap = {
  [OtherActivity.ActiveCaloriesBurned]: HealthKit.getActiveEnergyBurned, // Uses Start and end date
  [OtherActivity.FloorsClimbed]: HealthKit.getFlightsClimbed, // Uses the date field
  [OtherActivity.Steps]: HealthKit.getStepCount, // Uses the date field
};
