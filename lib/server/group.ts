import {
  Group,
  GroupCreateRequestSchema,
  GroupGetRequestSchema,
} from "@/lib/API/schemas/Group";
import { fetchApi, FetchReturnType } from "./fetch";
import { User } from "../API/schemas/User";

export async function create(
  user: Pick<User, "name" | "userId">,
  groupName: Group["groupName"],
  interval: Group["interval"],
): Promise<FetchReturnType<Group>> {
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

  if (response.error) return response;

  return {
    data: {
      groupName,
      groupId: response.data.groupId,
      interval,
      users: {
        [user.userId]: user.name,
      },
      goals: [],
      streak: 0,
    },
    error: response.error,
  };
}

export async function get(
  groupId: Group["groupId"],
): Promise<FetchReturnType<Group>> {
  const response = await fetchApi({
    path: "/group",
    method: "GET",
    schema: GroupGetRequestSchema,
    searchParams: { groupId },
    requestBody: undefined,
  });

  if (response.error) return response;

  return {
    data: {
      groupId,
      ...response.data,
    },
    error: response.error,
  };
}
