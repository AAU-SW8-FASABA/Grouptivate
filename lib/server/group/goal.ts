import { fetchApi, FetchReturnType } from "../fetch";
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
): Promise<FetchReturnType<Goal>> {
  const response = await fetchApi({
    path: "/group/goal",
    method: "POST",
    schema: GoalCreateRequestSchema,
    searchParams: { userId, groupId },
    requestBody: goal,
  });

  if (response.error) return response;

  return {
    data: {
      ...goal,
      ...response.data,
      progress: { [userId]: 0 },
    },
    error: response.error,
  };
}

export async function patch(
  goals: {
    goalId: Goal["goalId"];
    progress: number;
  }[],
): Promise<FetchReturnType<null>> {
  return await fetchApi({
    path: "/group/goal",
    method: "PATCH",
    schema: GoalPatchRequestSchema,
    searchParams: {},
    requestBody: goals,
  });
}

export async function _delete(
  goalId: Goal["goalId"],
): Promise<FetchReturnType<null>> {
  return await fetchApi({
    path: "/group/goal",
    method: "DELETE",
    schema: GoalDeleteRequestSchema,
    searchParams: {},
    requestBody: { goalId },
  });
}
