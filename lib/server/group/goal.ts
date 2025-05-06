import { fetchApi } from "../fetch";
import { User } from "../../API/schemas/User";
import { Group } from "@/lib/API/schemas/Group";
import {
  Goal,
  GoalDeleteRequestSchema,
  GoalPatchRequestSchema,
  GoalCreateRequestSchema,
} from "@/lib/API/schemas/Goal";

export async function create(
  userId: User["userId"],
  groupId: Group["groupId"],
  goal: Omit<Goal, "goalId" | "group" | "progress">,
) {
  const response = await fetchApi({
    path: "/group/goal",
    method: "POST",
    schema: GoalCreateRequestSchema,
    searchParams: { userId, groupId },
    requestBody: goal,
  });
  return {
    ...goal,
    progress: { [userId]: 0 },
    ...response,
  };
}

export async function patch(
  goals: {
    goalId: Goal["goalId"];
    progress: number;
  }[],
): Promise<void> {
  await fetchApi({
    path: "/group/goal",
    method: "PATCH",
    schema: GoalPatchRequestSchema,
    searchParams: {},
    requestBody: goals,
  });
}

export async function _delete(goalId: Goal["goalId"]): Promise<void> {
  await fetchApi({
    path: "/group/goal",
    method: "DELETE",
    schema: GoalDeleteRequestSchema,
    searchParams: {},
    requestBody: { goalId },
  });
}
