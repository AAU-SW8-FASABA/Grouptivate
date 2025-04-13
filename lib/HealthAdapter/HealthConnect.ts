import { SportActivity, SportActivitySchema } from "../API/schemas/Activity";
import {
  CaloriesOnlyOptions,
  CountOnlyOptions,
  HealthAdapter,
  SportOptions,
} from "./HealthAdapter";

import {
  initialize,
  requestPermission,
  readRecords,
} from "react-native-health-connect";

// Active calories is not a sport :( )
const activityMapping: Record<SportActivity, number> = {
  [SportActivity.Badminton]: 2, // EXERCISE_TYPE_BADMINTON
  [SportActivity.Baseball]: 4, // EXERCISE_TYPE_BASEBALL
  [SportActivity.Basketball]: 5, // EXERCISE_TYPE_BASKETBALL
  [SportActivity.Biking]: 8, // EXERCISE_TYPE_BIKING
  [SportActivity.Boxing]: 11, // EXERCISE_TYPE_BOXING
  [SportActivity.Cricket]: 14, // EXERCISE_TYPE_CRICKET
  [SportActivity.Dancing]: 16, // EXERCISE_TYPE_DANCING
  [SportActivity.Elliptical]: 25, // EXERCISE_TYPE_ELLIPTICAL
  [SportActivity.Fencing]: 27, // EXERCISE_TYPE_FENCING
  [SportActivity.Football]: 64, // EXERCISE_TYPE_SOCCER
  [SportActivity.FootballAmerican]: 28, // EXERCISE_TYPE_FOOTBALL_AMERICAN
  [SportActivity.FootballAustralian]: 29, // EXERCISE_TYPE_FOOTBALL_AUSTRALIAN
  [SportActivity.Frisbee]: 31, // EXERCISE_TYPE_FRISBEE_DISC
  [SportActivity.Golf]: 32, // EXERCISE_TYPE_GOLF
  [SportActivity.Gymnastics]: 34, // EXERCISE_TYPE_GYMNASTICS
  [SportActivity.Handball]: 35, // EXERCISE_TYPE_HANDBALL
  [SportActivity.Hiking]: 37, // EXERCISE_TYPE_HIKING
  [SportActivity.Hockey]: 38, // EXERCISE_TYPE_ICE_HOCKEY
  [SportActivity.MartialArts]: 44, // EXERCISE_TYPE_MARTIAL_ARTS
  [SportActivity.Other]: 0, // EXERCISE_TYPE_OTHER_WORKOUT
  [SportActivity.Paddling]: 46, // EXERCISE_TYPE_PADDLING
  [SportActivity.Pilates]: 48, // EXERCISE_TYPE_PILATES
  [SportActivity.Racquetball]: 50, // EXERCISE_TYPE_RACQUETBALL
  [SportActivity.RockClimbing]: 51, // EXERCISE_TYPE_ROCK_CLIMBING
  [SportActivity.Rowing]: 53, // EXERCISE_TYPE_ROWING OR 54 EXERCISE_TYPE_ROWING_MACHINE
  [SportActivity.Rugby]: 55, // EXERCISE_TYPE_RUGBY
  [SportActivity.Running]: 56, // EXERCISE_TYPE_RUNNING OR 57 EXERCISE_TYPE_RUNNING_TREADMILL
  [SportActivity.Sailing]: 58, // EXERCISE_TYPE_SAILING
  [SportActivity.ScubaDiving]: 59, // EXERCISE_TYPE_SCUBA_DIVING
  [SportActivity.Skating]: 60, // EXERCISE_TYPE_SKATING
  [SportActivity.Skiing]: 61, // EXERCISE_TYPE_SKIING
  [SportActivity.Snowboarding]: 62, // EXERCISE_TYPE_SNOWBOARDING
  [SportActivity.Softball]: 65, // EXERCISE_TYPE_SOFTBALL
  [SportActivity.Squash]: 66, // EXERCISE_TYPE_SQUASH
  [SportActivity.StairClimbing]: 68, // EXERCISE_TYPE_STAIR_CLIMBING OR 69 EXERCISE_TYPE_STAIR_CLIMBING_MACHINE
  [SportActivity.StrengthTraining]: 70, // EXERCISE_TYPE_STRENGTH_TRAINING
  [SportActivity.Stretching]: 71, // EXERCISE_TYPE_STRETCHING
  [SportActivity.Surfing]: 72, // EXERCISE_TYPE_SURFING
  [SportActivity.Swimming]: 74, // EXERCISE_TYPE_SWIMMING_POOL OR 73 EXERCISE_TYPE_SWIMMING_OPEN_WATER
  [SportActivity.TableTennis]: 75, // EXERCISE_TYPE_TABLE_TENNIS
  [SportActivity.Tennis]: 76, // EXERCISE_TYPE_TENNIS
  [SportActivity.Volleyball]: 78, // EXERCISE_TYPE_VOLLEYBALL
  [SportActivity.Walking]: 79, // EXERCISE_TYPE_WALKING
  [SportActivity.WaterPolo]: 80, // EXERCISE_TYPE_WATER_POLO
  [SportActivity.Weightlifting]: 81, // EXERCISE_TYPE_WEIGHTLIFTING
  [SportActivity.Wheelchair]: 82, // EXERCISE_TYPE_WHEELCHAIR
  [SportActivity.Yoga]: 83, // EXERCISE_TYPE_YOGA
};

//TODO COMMIT TO SUBMODULE AND COMMIT TO APP

class HealthConnectAdapter extends HealthAdapter {
  async init(): Promise<void> {
    const isInitialized = await initialize();

    const grantedPermissions = await requestPermission([
      { accessType: "read", recordType: "ActiveCaloriesBurned" },
      { accessType: "read", recordType: "ExerciseSession" },
    ]);
  }

  getData(
    options: CaloriesOnlyOptions | CountOnlyOptions | SportOptions
  ): Promise<number> {}
}

const readSampleData = async () => {
  const isInitialized = await initialize();

  const grantedPermissions = await requestPermission([
    { accessType: "read", recordType: "ActiveCaloriesBurned" },
    { accessType: "read", recordType: "ExerciseSession" },
  ]);

  const { records } = await readRecords("ActiveCaloriesBurned", {
    timeRangeFilter: {
      operator: "between",
      startTime: "2023-01-09T12:00:00.405Z",
      endTime: "2023-01-09T23:53:15.405Z",
    },
  });
};
