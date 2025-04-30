import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

import { deleteToken } from "@/lib/server/config";
import { Container } from "@/components/Container";
import globalStyles from "@/constants/styles";
import { CustomScrollView } from "@/components/CusomScrollView";
import { DeveloperTools } from "@/components/DeveloperTools";
import { Invite, InviteAnswer } from "@/components/Invite";
import { useEffect, useState } from "react";
import { respond as respondInvite } from "@/lib/server/group/invite/respond";
import { get as getInvites } from "@/lib/server/group/invite";
import type { Invite as InviteType } from "@/lib/API/schemas/Invite";
import { UserContext } from "@/lib/states/userState";
import { value } from "valibot";
import { useContext } from "react";

function fetchInvites(): InviteType[] {
  // This function is redundant when api is done.
  // example to test setInvites before api is done.
  const exampleArray: InviteType[] = [];
  const example: InviteType = {
    inviteId: "",
    groupName: "Kinda group",
    groupId: "",
    inviteeName: "Aske",
    inviterName: "Fryd",
  };
  const example2: InviteType = {
    inviteId: "",
    groupName: "Heow",
    groupId: "",
    inviteeName: "Aske",
    inviterName: "bank",
  };
  exampleArray.push(example);
  exampleArray.push(example2);
  return exampleArray;
}

export default function Profile() {
  const user = useContext(UserContext);
  useEffect(() => {
    // Call the initiate fetch of invites here
    // TODO: Remove function fetchInvites and use getInvites when api is done
    const fetchedInvites = fetchInvites();
    const fetchedInvites2 = getInvites();

    const inviteState = [];
    for (const invite of fetchedInvites) {
      inviteState.push({
        inviteId: invite.inviteId,
        groupname: invite.groupName,
        groupId: invite.groupId,
        inviteeName: invite.inviteeName,
        inviterName: invite.inviterName,
      });
    }
    setInvites(inviteState);
  }, []);

  function inviteAnswer(answer: InviteAnswer, index: number): void {
    let accepted;
    if (answer === InviteAnswer.Accept) {
      accepted = true;
    } else if (answer === InviteAnswer.Decline) {
      accepted = false;
    } else {
      console.log("Swoop");
      return;
    }
    console.log(accepted);
    // respondInvite send a post api call, to respond on the inviteId.
    respondInvite(invites[index].inviteId, accepted);
    deleteInvite(index);
  }

  function deleteInvite(index: number) {
    setInvites((prev) => prev.filter((_, i) => i !== index));
  }

  const [invites, setInvites] = useState([
    {
      inviteId: "",
      groupname: "Bongers",
      groupId: "",
      inviteeName: "",
      inviterName: "Bong",
    },
    {
      inviteId: "",
      groupname: "Bingers",
      groupId: "",
      inviteeName: "",
      inviterName: "Bing",
    },
  ]);

  return (
    <CustomScrollView style={globalStyles.viewContainer}>
      <View style={[styles.center, { marginTop: 8 }]}>
        <Image
          source={require("@/assets/images/Aske.png")}
          borderRadius={100}
          style={styles.profilePhoto}
        />
        <Text style={[styles.text, styles.profileName]}>{user.name}</Text>
        <Text style={[styles.text, { fontSize: 32, marginTop: 50 }]}>
          Invitations
        </Text>
        {invites.map((invite, index) => (
          <Invite
            key={index}
            {...invite}
            handleInvite={(answer: InviteAnswer) => {
              inviteAnswer(answer, index);
            }}
          />
        ))}
        <Text
          style={[
            styles.text,
            { fontSize: 32, marginTop: 50, marginBottom: 10 },
          ]}
        >
          Developer tools
        </Text>
        <DeveloperTools />
      </View>
    </CustomScrollView>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: "Roboto",
    fontWeight: 500,
  },
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
  profileName: {
    fontSize: 24,
    marginTop: 20,
  },
  column: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    textAlign: "center",
    fontSize: 20,
    borderRadius: 5,
    height: 32,
    lineHeight: 32,
  },
});
