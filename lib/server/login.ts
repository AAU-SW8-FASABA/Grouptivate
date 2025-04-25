import { setToken } from "./config";
import { fetchApi } from "./fetch";
import { Login, LoginRequestSchema } from "../API/schemas/Login";

export async function create(
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
  } catch {
    return false;
  }
  await setToken(response.token);
  return true;
}
