import { setToken } from "./config";
import { fetchApi } from "./fetch";
import { Token } from "../API/schemas/Token";
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
      path: "/login",
      method: "POST",
      schema: LoginRequestSchema,
      searchParams: {},
      requestBody: { name, password },
    });
    await setToken(response.token);
    return { name, groups: [], userId: response.userId };
  } catch {
    return false;
  }
}

export async function verify(token: Token): Promise<boolean> {
  try {
    await fetchApi({
      path: "/login",
      method: "POST",
      schema: VerifyRequestSchema,
      searchParams: {},
      requestBody: { token },
    });
  } catch {
    return false;
  }
  return true;
}
