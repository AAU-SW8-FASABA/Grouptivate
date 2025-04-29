import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import globalStyles from "@/constants/styles";
import { CustomScrollView } from "@/components/CusomScrollView";
import { DeveloperTools } from "@/components/DeveloperTools";
import { Invite, InviteAnswer } from "@/components/Invite";
import { useEffect, useState } from "react";
import { respond as respondInvite } from "@/lib/server/group/invite/respond";
import type { Invite as InviteType } from "@/lib/API/schemas/Invite";


function fetchInvites(): string {
  console.log("Anton er en peepeepoopoo");
  return "Anton er en peepeepoopoo";
}

export default function Profile() {
  useEffect(() => {
    // Call the initiate fetch of invites here
    fetchInvites();
    setInvites([{inviter: "Fryd", groupname: "Heow"}, {inviter: "GOng", groupname: "heow"}]);
  }, []);

  function inviteAnswer(answer: InviteAnswer, index: number): void {
    if (answer === InviteAnswer.Accept) {
      // Missing our user uuid from earlier requests.
      console.log("Yes");
    } else if (answer === InviteAnswer.Decline) {
      console.log("No");
    } else {
      console.log("Swoop");
      return;
    }
    // respondInvite(useruuid, invite, accepted)
    deleteInvite(index);
  }

  function deleteInvite(index: number) {
    setInvites((prev) => prev.filter((_, i) => i !== index));
  }

  const [invites, setInvites] = useState([
    { inviter: "Bong", groupname: "Bongers" },
    { inviter: "Bing", groupname: "Bingers" },
  ]);

  return (
    <CustomScrollView style={globalStyles.viewContainer}>
      <View style={[styles.center, { marginTop: 8 }]}>
        <Image
          source={require("@/assets/images/Aske.png")}
          borderRadius={100}
          style={styles.profilePhoto}
        />
        <Text style={[styles.text, styles.profileName]}>Aske #82</Text>
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
