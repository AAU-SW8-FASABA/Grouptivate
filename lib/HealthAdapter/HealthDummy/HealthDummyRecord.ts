import { OtherActivity, SportActivity } from "@/lib/API/schemas/Activity";
import * as v from "valibot";

export const HealthRecordSchema = v.object({
  start: v.number(),
  end: v.number(),
  activity: v.union([v.enum(SportActivity), v.enum(OtherActivity)]),
  count: v.optional(v.number()),
  distance: v.optional(v.number()),
  caloriesBurned: v.optional(v.number()),
});
export type HealthRecord = v.InferOutput<typeof HealthRecordSchema>;
