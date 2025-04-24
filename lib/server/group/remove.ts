import { Group, GroupRemoveRequestSchema } from "@/lib/API/schemas/Group";
import { User } from "../../API/schemas/User";
import { fetchApi } from "../fetch";

export async function remove(
  user: User["uuid"],
  group: Group["uuid"],
): Promise<void> {
  await fetchApi({
    path: "/group/remove",
    method: "POST",
    schema: GroupRemoveRequestSchema,
    searchParams: { user },
    requestBody: {
      group,
    },
  });
}
