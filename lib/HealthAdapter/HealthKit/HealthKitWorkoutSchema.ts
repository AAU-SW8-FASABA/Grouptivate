import HealthKit from "react-native-health";
import * as v from "valibot";

export const WorkoutSchema = v.object({
  activityId: v.number(),
  activityName: v.enum(HealthKit.Constants.Activities),
  calories: v.number(),
  distance: v.number(),
  start: v.string(),
  end: v.string(),
  id: v.string(),
});

export type Workout = v.InferOutput<typeof WorkoutSchema>;
