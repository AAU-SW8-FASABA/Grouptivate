import { fetchApi } from "../fetch";
import { User } from "../../API/schemas/User";
import {
  Invite,
  InviteCreateRequestSchema,
  InviteGetRequestSchema,
} from "../../API/schemas/Invite";
import { Group } from "../../API/schemas/Group";

export async function create(
  user: User["userId"],
  groupId: Group["groupId"],
  inviteeName: User["name"],
): Promise<void> {
  await fetchApi({
    path: "/group/invite",
    method: "POST",
    schema: InviteCreateRequestSchema,
    searchParams: { user },
    requestBody: {
      groupId,
      inviteeName,
    },
  });
}

export async function get(
  userId: User["userId"], //The person who recieves invites
  name: User["name"], // The person who sends 
): Promise<Invite[]> {
  const invites = await fetchApi({
    path: "/group/invite",
    method: "GET",
    schema: InviteGetRequestSchema,
    searchParams: { userId },
    requestBody: undefined,
  });
  return invites.map((invite) => ({
    inviteeName: name,
    ...invite,
  }));
}
