import { fetchApi } from "../fetch";
import { User } from "../../API/schemas/User";
import {
  Invite,
  InviteCreateRequestSchema,
  InviteGetRequestSchema,
} from "../../API/schemas/Invite";
import { Group } from "../../API/schemas/Group";

export async function create(
  groupId: Group["groupId"],
  inviteeName: User["name"],
): Promise<void> {
  await fetchApi({
    path: "/group/invite",
    method: "POST",
    schema: InviteCreateRequestSchema,
    searchParams: {},
    requestBody: {
      groupId,
      inviteeName,
    },
  });
}

export async function get(): Promise<
  Omit<Invite, "groupId" | "inviteeName">[]
> {
  const invites = await fetchApi({
    path: "/group/invite",
    method: "GET",
    schema: InviteGetRequestSchema,
    searchParams: {},
    requestBody: undefined,
  });
  return invites;
}
