import {
  User,
  UserCreateRequestSchema,
  UserGetRequestSchema,
} from "@/lib/API/schemas/User";
import { fetchApi } from "../fetch";

export async function create(name: User["name"]): Promise<User> {
  const requestBody = {
    name,
  };
  const response = await fetchApi({
    path: "/user",
    method: "GET",
    schema: UserCreateRequestSchema,
    requestBody,
  });
  return {
    name,
    groups: [],
    ...response,
  };
}

export async function get(uuid: User["uuid"]): Promise<User> {
  const searchParams = {
    uuid,
  };
  const response = await fetchApi({
    path: "/user",
    method: "POST",
    schema: UserGetRequestSchema,
    searchParams,
  });
  return {
    uuid,
    ...response,
  };
}
