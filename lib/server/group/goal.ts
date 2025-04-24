import { is } from "valibot";
import { fetchApi } from "../fetch";
import { User } from "../../API/schemas/User";
import { Group } from "@/lib/API/schemas/Group";
import {
  Goal,
  GoalDeleteRequestSchema,
  GoalPatchRequestSchema,
  GroupGoal,
  GroupGoalCreateRequestSchema,
  IndividualGoal,
  IndividualGoalCreateRequestSchema,
} from "@/lib/API/schemas/Goal";

export async function create(
  user: User["uuid"],
  group: Group["uuid"],
  goal: Omit<IndividualGoal, "uuid" | "group" | "progress">,
): Promise<IndividualGoal>;
export async function create(
  user: User["uuid"],
  group: Group["uuid"],
  goal: Omit<GroupGoal, "uuid" | "group" | "progress">,
): Promise<GroupGoal>;
export async function create(
  user: User["uuid"],
  group: Group["uuid"],
  goal:
    | Omit<IndividualGoal, "uuid" | "group" | "progress">
    | Omit<GroupGoal, "uuid" | "group" | "progress">,
) {
  if (is(IndividualGoalCreateRequestSchema.requestBody, goal)) {
    const response = await fetchApi({
      path: "/group/goal",
      method: "POST",
      schema: IndividualGoalCreateRequestSchema,
      searchParams: { user, group },
      requestBody: goal,
    });
    return {
      group,
      ...goal,
      ...response,
    };
  } else {
    const response = await fetchApi({
      path: "/group/goal",
      method: "POST",
      schema: GroupGoalCreateRequestSchema,
      searchParams: { user, group },
      requestBody: goal,
    });
    return {
      ...goal,
      ...response,
    };
  }
}

export async function patch(
  user: User["uuid"],
  goals: { uuid: Goal["uuid"]; progress: IndividualGoal["progress"] }[],
): Promise<void> {
  await fetchApi({
    path: "/group/goal",
    method: "PATCH",
    schema: GoalPatchRequestSchema,
    searchParams: { user },
    requestBody: goals,
  });
}

export async function _delete(
  user: User["uuid"],
  uuid: Goal["uuid"],
): Promise<void> {
  await fetchApi({
    path: "/group/goal",
    method: "DELETE",
    schema: GoalDeleteRequestSchema,
    searchParams: { user },
    requestBody: { uuid },
  });
}
