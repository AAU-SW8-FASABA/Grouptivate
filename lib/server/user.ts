import { setToken } from "./config";
import { fetchApi } from "./fetch";
import {
  User,
  UserCreateRequestSchema,
  UserGetRequestSchema,
} from "@/lib/API/schemas/User";
import type { Password } from "../API/schemas/Password";

export async function create(
  name: User["name"],
  password: Password,
): Promise<User | false> {
  let response;
  try {
    response = await fetchApi({
      path: "/user",
      method: "POST",
      schema: UserCreateRequestSchema,
      searchParams: {},
      requestBody: { name, password },
    });
    await setToken(response.token);
    return { name, groups: [], goals: [], userId: response.userId };
  } catch {
    return false;
  }
}

export async function get(): Promise<User> {
  const response = await fetchApi({
    path: "/user",
    method: "GET",
    schema: UserGetRequestSchema,
    searchParams: {},
    requestBody: undefined,
  });
  return response;
}
