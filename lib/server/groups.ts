import { Group, GroupsGetRequestSchema } from "@/lib/API/schemas/Group";
import { fetchApi, FetchReturnType } from "./fetch";

export async function get(): Promise<FetchReturnType<Group[]>> {
  return await fetchApi({
    path: "/groups",
    method: "GET",
    schema: GroupsGetRequestSchema,
    searchParams: {},
    requestBody: undefined,
  });
}
