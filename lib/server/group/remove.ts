import { Group, GroupRemoveRequestSchema } from "@/lib/API/schemas/Group";
import { User } from "../../API/schemas/User";
import { fetchApi, FetchReturnType } from "../fetch";

export async function remove(
  userId: User["userId"],
  groupId: Group["groupId"],
): Promise<FetchReturnType<null>> {
  return await fetchApi({
    path: "/group/remove",
    method: "POST",
    schema: GroupRemoveRequestSchema,
    searchParams: { userId },
    requestBody: {
      userId,
      groupId,
    },
  });
}
