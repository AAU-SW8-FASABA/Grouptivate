import { fetchApi } from "../../fetch";
import {
  Invite,
  InviteRespondRequestSchema,
} from "../../../API/schemas/Invite";

export async function respond(
  inviteId: Invite["inviteId"],
  accepted: boolean,
): Promise<void> {
  await fetchApi({
    path: "/group/invite/respond",
    method: "POST",
    schema: InviteRespondRequestSchema,
    searchParams: { inviteId },
    requestBody: { accepted },
  });
}
