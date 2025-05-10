import { setToken } from "./config";
import { fetchApi } from "./fetch";
import {
  User,
  UserCreateRequestSchema,
  UserGetRequestSchema,
} from "@/lib/API/schemas/User";
import type { Password } from "../API/schemas/Password";

export async function create(name: User["name"], password: Password) {
  const response = await fetchApi({
    path: "/user",
    method: "POST",
    schema: UserCreateRequestSchema,
    searchParams: {},
    requestBody: { name, password },
  });

  if (!response.error) await setToken(response.data.token);

  return response;
}

export async function get() {
  const response = await fetchApi({
    path: "/user",
    method: "GET",
    schema: UserGetRequestSchema,
    searchParams: {},
    requestBody: undefined,
  });

  if (response.error) return response;

  return {
    data: response.data,
    error: response.error,
  };
}
