import { Metric } from "@/lib/API/schemas/Metric";
import { SportActivity } from "../../API/schemas/Activity";

// Active calories is not a sport :( )
export const activityMapping: Record<SportActivity, number[]> = {
  [SportActivity.Badminton]: [2], // EXERCISE_TYPE_BADMINTON [2]
  [SportActivity.Baseball]: [4], // EXERCISE_TYPE_BASEBALL [4]
  [SportActivity.Basketball]: [5], // EXERCISE_TYPE_BASKETBALL [5]
  [SportActivity.Biking]: [8], // EXERCISE_TYPE_BIKING [8]
  [SportActivity.Boxing]: [11], // EXERCISE_TYPE_BOXING [11]
  [SportActivity.Cricket]: [14], // EXERCISE_TYPE_CRICKET [14]
  [SportActivity.Dancing]: [16], // EXERCISE_TYPE_DANCING [16]
  [SportActivity.Elliptical]: [25], // EXERCISE_TYPE_ELLIPTICAL [25]
  [SportActivity.Fencing]: [27], // EXERCISE_TYPE_FENCING [27]
  [SportActivity.Football]: [64], // EXERCISE_TYPE_SOCCER [64]
  [SportActivity.FootballAmerican]: [28], // EXERCISE_TYPE_FOOTBALL_AMERICAN [28]
  [SportActivity.FootballAustralian]: [29], // EXERCISE_TYPE_FOOTBALL_AUSTRALIAN [29]
  [SportActivity.Frisbee]: [31], // EXERCISE_TYPE_FRISBEE_DISC [31]
  [SportActivity.Golf]: [32], // EXERCISE_TYPE_GOLF [32]
  [SportActivity.Gymnastics]: [34], // EXERCISE_TYPE_GYMNASTICS [34]
  [SportActivity.Handball]: [35], // EXERCISE_TYPE_HANDBALL [35]
  [SportActivity.Hiking]: [37], // EXERCISE_TYPE_HIKING [37]
  [SportActivity.Hockey]: [38], // EXERCISE_TYPE_ICE_HOCKEY [38]
  [SportActivity.MartialArts]: [44], // EXERCISE_TYPE_MARTIAL_ARTS [44]
  [SportActivity.Paddling]: [46], // EXERCISE_TYPE_PADDLING [46]
  [SportActivity.Pilates]: [48], // EXERCISE_TYPE_PILATES [48]
  [SportActivity.Racquetball]: [50], // EXERCISE_TYPE_RACQUETBALL [50]
  [SportActivity.RockClimbing]: [51], // EXERCISE_TYPE_ROCK_CLIMBING [51]
  [SportActivity.Rowing]: [53, 54], // EXERCISE_TYPE_ROWING [53], EXERCISE_TYPE_ROWING_MACHINE [54]
  [SportActivity.Rugby]: [55], // EXERCISE_TYPE_RUGBY [55]
  [SportActivity.Running]: [56, 57], // EXERCISE_TYPE_RUNNING [56], EXERCISE_TYPE_RUNNING_TREADMILL [57]
  [SportActivity.Sailing]: [58], // EXERCISE_TYPE_SAILING [58]
  [SportActivity.Skating]: [60], // EXERCISE_TYPE_SKATING [60]
  [SportActivity.Skiing]: [61], // EXERCISE_TYPE_SKIING [61]
  [SportActivity.Snowboarding]: [62], // EXERCISE_TYPE_SNOWBOARDING [62]
  [SportActivity.Softball]: [65], // EXERCISE_TYPE_SOFTBALL [65]
  [SportActivity.Squash]: [66], // EXERCISE_TYPE_SQUASH [66]
  [SportActivity.StairClimbing]: [68, 69], // EXERCISE_TYPE_STAIR_CLIMBING [68], EXERCISE_TYPE_STAIR_CLIMBING_MACHINE [69]
  [SportActivity.StrengthTraining]: [70], // EXERCISE_TYPE_STRENGTH_TRAINING [70]
  [SportActivity.Stretching]: [71], // EXERCISE_TYPE_STRETCHING [71]
  [SportActivity.Surfing]: [72], // EXERCISE_TYPE_SURFING [72]
  [SportActivity.Swimming]: [73, 74], // EXERCISE_TYPE_SWIMMING_OPEN_WATER [73], EXERCISE_TYPE_SWIMMING_POOL [74]
  [SportActivity.TableTennis]: [75], // EXERCISE_TYPE_TABLE_TENNIS [75]
  [SportActivity.Tennis]: [76], // EXERCISE_TYPE_TENNIS [76]
  [SportActivity.Volleyball]: [78], // EXERCISE_TYPE_VOLLEYBALL [78]
  [SportActivity.Walking]: [79], // EXERCISE_TYPE_WALKING [79]
  [SportActivity.WaterPolo]: [80], // EXERCISE_TYPE_WATER_POLO [80]
  [SportActivity.Wheelchair]: [82], // EXERCISE_TYPE_WHEELCHAIR [82]
  [SportActivity.Yoga]: [83], // EXERCISE_TYPE_YOGA [83]
};

export const metricMap: Record<Metric, string> = {
  [Metric.Calories]: "ActiveCaloriesBurned",
  [Metric.Distance]: "Distance",
  [Metric.Duration]: "Duration",
  [Metric.Count]: "Count",
};
