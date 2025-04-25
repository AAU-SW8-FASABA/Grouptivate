import {
  Group,
  GroupCreateRequestSchema,
  GroupGetRequestSchema,
} from "@/lib/API/schemas/Group";
import { fetchApi } from "./fetch";

export async function create(
  name: Group["name"],
  interval: Group["interval"],
): Promise<Group> {
  const response = await fetchApi({
    path: "/group",
    method: "POST",
    schema: GroupCreateRequestSchema,
    searchParams: {},
    requestBody: {
      name,
      interval,
    },
  });
  return {
    name,
    interval,
    users: [],
    goals: [],
    streak: 0,
    ...response,
  };
}

export async function get(uuid: Group["uuid"]): Promise<Group> {
  const response = await fetchApi({
    path: "/group",
    method: "GET",
    schema: GroupGetRequestSchema,
    searchParams: { uuid },
    requestBody: undefined,
  });
  return {
    uuid,
    ...response,
  };
}
