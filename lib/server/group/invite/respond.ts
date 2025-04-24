import { fetchApi } from "../../fetch";
import { User } from "../../../API/schemas/User";
import {
  Invite,
  InviteRespondRequestSchema,
} from "../../../API/schemas/Invite";

export async function respond(
  user: User["uuid"],
  invite: Invite["uuid"],
  accepted: boolean,
): Promise<void> {
  await fetchApi({
    path: "/group/invite/respond",
    method: "POST",
    schema: InviteRespondRequestSchema,
    searchParams: { user, invite },
    requestBody: { accepted },
  });
}
