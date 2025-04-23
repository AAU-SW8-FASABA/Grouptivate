import {
  Group,
  GroupCreateRequestSchema,
  GroupGetRequestSchema,
} from "@/lib/API/schemas/Group";
import { User } from "../API/schemas/User";
import { fetchApi } from "./fetch";

export async function create(
  user: User["uuid"],
  name: Group["name"],
  interval: Group["interval"],
): Promise<Group> {
  const response = await fetchApi({
    path: "/group",
    method: "POST",
    schema: GroupCreateRequestSchema,
    searchParams: { user },
    requestBody: {
      name,
      interval,
    },
  });
  return {
    name,
    interval,
    users: [],
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
