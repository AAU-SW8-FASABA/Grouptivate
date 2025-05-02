import { Group, GroupsGetRequestSchema } from "@/lib/API/schemas/Group";
import { fetchApi } from "./fetch";

export async function get(): Promise<Group[]> {
  const response = await fetchApi({
    path: "/groups",
    method: "GET",
    schema: GroupsGetRequestSchema,
    searchParams: {},
    requestBody: undefined,
  });
  return response;
}
