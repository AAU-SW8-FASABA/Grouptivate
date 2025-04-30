import {
  Group,
  GroupCreateRequestSchema,
  GroupGetRequestSchema,
} from "@/lib/API/schemas/Group";
import { fetchApi } from "./fetch";

export async function create(
  groupName: Group["groupName"],
  interval: Group["interval"],
): Promise<Group> {
  const response = await fetchApi({
    path: "/group",
    method: "POST",
    schema: GroupCreateRequestSchema,
    searchParams: {},
    requestBody: {
      groupName,
      interval,
    },
  });
  return {
    groupName,
    interval,
    users: {},
    goals: [],
    streak: 0,
    ...response,
  };
}

export async function get(groupId: Group["groupId"]): Promise<Group> {
  const response = await fetchApi({
    path: "/group",
    method: "GET",
    schema: GroupGetRequestSchema,
    searchParams: { groupId },
    requestBody: undefined,
  });
  return {
    groupId,
    ...response,
  };
}
