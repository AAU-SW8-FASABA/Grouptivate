import { setToken } from "./config";
import { fetchApi } from "./fetch";
import { Token } from "../API/schemas/Token";
import {
  Login,
  LoginRequestSchema,
  VerifyRequestSchema,
} from "../API/schemas/Login";

export async function login(
  name: Login["name"],
  password: Login["password"],
): Promise<boolean> {
  let response;
  try {
    response = await fetchApi({
      path: "/login",
      method: "POST",
      schema: LoginRequestSchema,
      searchParams: {},
      requestBody: { name, password },
    });
    if (!response?.token) {
      return false;
    }
    await setToken(response.token);
    return true;
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
