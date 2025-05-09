import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

import { deleteToken } from "@/lib/server/config";
import globalStyles from "@/constants/styles";
import { CustomScrollView } from "@/components/CusomScrollView";
import { DeveloperTools } from "@/components/DeveloperTools";
import { Invite, InviteAnswer } from "@/components/Invite";
import { useEffect, useState } from "react";
import { respond as respondInvite } from "@/lib/server/group/invite/respond";
import { get as getInvites } from "@/lib/server/group/invite";
import type { Invite as InviteType } from "@/lib/API/schemas/Invite";
import { useUser } from "@/lib/states/userState";
import { defaultAske, getAske } from "@/lib/aske";

export default function Profile() {
  const router = useRouter();
  const { user } = useUser();
  const [userImage, setUserImage] = useState(defaultAske);
  useEffect(() => {
    async function fetchInvites() {
      const fetchedInvites = await getInvites();

      const inviteState = [];
      for (const invite of fetchedInvites) {
        inviteState.push({
          inviteId: invite.inviteId,
          groupName: invite.groupName,
          inviteeName: user.name,
          inviterName: invite.inviterName,
        });
      }
      setInvites(inviteState);
    }

    fetchInvites();
  }, [user]);
  useEffect(() => {
    setUserImage(getAske(user));
  }, [user]);

  async function logout() {
    await deleteToken();
    router.dismissAll();
  }

  function inviteAnswer(answer: InviteAnswer, index: number): void {
    // respondInvite send a post api call, to respond on the inviteId.
    respondInvite(invites[index].inviteId, answer === InviteAnswer.Accept);
    deleteInvite(index);
  }

  function deleteInvite(index: number) {
    setInvites((prev) => prev.filter((_, i) => i !== index));
  }

  const [invites, setInvites] = useState<Omit<InviteType, "groupId">[]>([]);

  return (
    <CustomScrollView style={globalStyles.viewContainer}>
      <View style={[styles.center, { marginTop: 8 }]}>
        <Image
          source={userImage}
          borderRadius={100}
          style={styles.profilePhoto}
        />
        <Text style={[globalStyles.title, { marginTop: 20 }]}>{user.name}</Text>
        <TouchableOpacity onPress={logout}>
          <Text
            style={[
              globalStyles.smallTitle,
              styles.button,
              {
                backgroundColor: "#D9D9D9",
                color: "black",
                marginTop: 10,
                paddingLeft: 10,
                paddingRight: 10,
              },
            ]}
          >
            Log out
          </Text>
        </TouchableOpacity>
        <Text style={[globalStyles.textStyle, { fontSize: 32, marginTop: 50 }]}>
          Invitations
        </Text>
        {invites.map((invite, index) => (
          <Invite
            key={invite.inviteId}
            {...invite}
            handleInvite={(answer: InviteAnswer) => {
              inviteAnswer(answer, index);
            }}
          />
        ))}
        <DeveloperTools />
      </View>
    </CustomScrollView>
  );
}

const styles = StyleSheet.create({
  center: {
    display: "flex",
    alignItems: "center",
  },
  profilePhoto: {
    width: 200,
    height: 200,
    borderWidth: 1,
    borderColor: "black",
  },
  column: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    textAlign: "center",
    borderRadius: 5,
    height: 32,
    lineHeight: 32,
  },
});
