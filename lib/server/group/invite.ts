import { fetchApi } from "../fetch";
import { User } from "../../API/schemas/User";
import {
  Invite,
  InviteCreateRequestSchema,
  InviteGetRequestSchema,
} from "../../API/schemas/Invite";
import { Group } from "../../API/schemas/Group";

export async function create(
  user: User["uuid"],
  group: Group["uuid"],
  invited: User["uuid"],
): Promise<void> {
  await fetchApi({
    path: "/group/invite",
    method: "POST",
    schema: InviteCreateRequestSchema,
    searchParams: { user },
    requestBody: {
      group,
      invited,
    },
  });
}

export async function get(user: User["uuid"]): Promise<Invite[]> {
  const invites = await fetchApi({
    path: "/group/invite",
    method: "GET",
    schema: InviteGetRequestSchema,
    searchParams: { user },
    requestBody: undefined,
  });
  return invites.map((invite) => ({
    invited: user,
    ...invite,
  }));
}
