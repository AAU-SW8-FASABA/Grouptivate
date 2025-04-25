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
  user: User["name"],
  group: Group["uuid"],
  goal: Omit<Goal, "uuid" | "group" | "progress">,
) {
  const response = await fetchApi({
    path: "/group/goal",
    method: "POST",
    schema: GoalCreateRequestSchema,
    searchParams: { user, group },
    requestBody: goal,
  });
  return {
    ...goal,
    ...response,
  };
}

export async function patch(
  goals: {
    uuid: Goal["uuid"];
    progress: Goal["progress"][keyof Goal["progress"]];
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

export async function _delete(uuid: Goal["uuid"]): Promise<void> {
  await fetchApi({
    path: "/group/goal",
    method: "DELETE",
    schema: GoalDeleteRequestSchema,
    searchParams: {},
    requestBody: { uuid },
  });
}
