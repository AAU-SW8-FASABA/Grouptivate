import {
  User,
  UserCreateRequestSchema,
  UserGetRequestSchema,
} from "@/lib/API/schemas/User";
import type { Password } from "../API/schemas/Password";
import { fetchApi } from "./fetch";

export async function create(
  name: User["name"],
  password: Password,
): Promise<User> {
  const response = await fetchApi({
    path: "/user",
    method: "POST",
    schema: UserCreateRequestSchema,
    searchParams: {},
    requestBody: { name, password },
  });
  return {
    name,
    groups: [],
    ...response,
  };
}

export async function get(uuid: User["uuid"]): Promise<User> {
  const response = await fetchApi({
    path: "/user",
    method: "GET",
    schema: UserGetRequestSchema,
    searchParams: { uuid },
    requestBody: undefined,
  });
  return {
    uuid,
    ...response,
  };
}
