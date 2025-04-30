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

    if (!response?.token) {
      return false;
    }
    await setToken(response.token);
    return await get(name);
  } catch {
    return false;
  }
}

export async function get(userId: User["userId"]): Promise<User> {
  const response = await fetchApi({
    path: "/user",
    method: "GET",
    schema: UserGetRequestSchema,
    searchParams: { userId },
    requestBody: undefined,
  });
  return { userId: userId, name: response.name, groups: response.groups };
}
