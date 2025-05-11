import { fetchApi, FetchReturnType } from "../fetch";
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
): Promise<FetchReturnType<null>> {
  return await fetchApi({
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
  FetchReturnType<Omit<Invite, "groupId" | "inviteeName">[]>
> {
  const invites = await fetchApi({
    path: "/group/invite",
    method: "GET",
    schema: InviteGetRequestSchema,
    searchParams: {},
    requestBody: undefined,
  });

  if (invites.error) return invites;

  return {
    data: invites.data,
    error: invites.error,
  };
}
