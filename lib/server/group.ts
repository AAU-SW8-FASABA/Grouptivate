import {
  Group,
  GroupCreateRequestSchema,
  GroupGetRequestSchema,
} from "@/lib/API/schemas/Group";
import { fetchApi } from "./fetch";
import { User } from "../API/schemas/User";

export async function create(
  user: Pick<User, "name" | "userId">,
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
    users: {
      [user.userId]: user.name,
    },
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
