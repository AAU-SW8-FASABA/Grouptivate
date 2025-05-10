import { setToken } from "./config";
import { fetchApi, FetchReturnType } from "./fetch";
import {
  Login,
  LoginRequestSchema,
  VerifyRequestSchema,
} from "../API/schemas/Login";

export async function login(
  name: Login["name"],
  password: Login["password"],
): Promise<FetchReturnType<{ token: string; userId: string }>> {
  const response = await fetchApi({
    path: "/user/login",
    method: "POST",
    schema: LoginRequestSchema,
    searchParams: {},
    requestBody: { name, password },
  });

  if (!response.error) await setToken(response.data.token);

  return response;
}

export async function verify(): Promise<boolean> {
  const response = await fetchApi({
    path: "/user/verify",
    method: "POST",
    schema: VerifyRequestSchema,
    searchParams: {},
    requestBody: undefined,
  });

  if (response.error) return false;

  return true;
}
