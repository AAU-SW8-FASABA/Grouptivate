import { setToken } from "./config";
import { fetchApi } from "./fetch";
import {
  Login,
  LoginRequestSchema,
  VerifyRequestSchema,
} from "../API/schemas/Login";
import { User } from "../API/schemas/User";

export async function login(
  name: Login["name"],
  password: Login["password"],
): Promise<User | false> {
  let response;
  try {
    response = await fetchApi({
      path: "/user/login",
      method: "POST",
      schema: LoginRequestSchema,
      searchParams: {},
      requestBody: { name, password },
    });
    await setToken(response.token);
    return { name, groups: [], goals: [], userId: response.userId };
  } catch {
    return false;
  }
}

export async function verify(): Promise<boolean> {
  try {
    await fetchApi({
      path: "/user/verify",
      method: "POST",
      schema: VerifyRequestSchema,
      searchParams: {},
      requestBody: undefined,
    });
  } catch {
    return false;
  }
  return true;
}
