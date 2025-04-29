import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import globalStyles from "@/constants/styles";
import { CustomScrollView } from "@/components/CusomScrollView";
import { DeveloperTools } from "@/components/DeveloperTools";
import { Invite, InviteAnswer } from "@/components/Invite";
import { useEffect, useState } from "react";
import { respond as respondInvite } from "@/lib/server/group/invite/respond";
import { get as getInvites } from "@/lib/server/group/invite"
import type { Invite as InviteType } from "@/lib/API/schemas/Invite";



function fetchInvites(): InviteType[] {
  // This function is redundant when api is done. 
  
  // example to work before api is done.
  const exampleArray:InviteType[] = []
  const example:InviteType = {uuid: "", group: "Heow", invited: "Aske", inviter: "Fryd"}
  const example2:InviteType = {uuid: "", group: "heow", invited: "Aske", inviter: "Gong"}
  exampleArray.push(example)
  exampleArray.push(example2)
  return exampleArray
}

export default function Profile() {
  useEffect(() => {
    // Call the initiate fetch of invites here
    // TODO: Remove function fetchInvites and use getInvites when api is done
    const fetchedInvites = fetchInvites();
    // return getInvites(userId)

    const inviteState = []
    for (const invite of fetchedInvites){
      inviteState.push({inviteId: invite.uuid, groupname: invite.group, invited: invite.invited, inviter: invite.inviter})
    }
    setInvites(inviteState);
  }, []);

  function inviteAnswer(answer: InviteAnswer, index: number): void {
    let accepted
    if (answer === InviteAnswer.Accept) {
      accepted = true
    } else if (answer === InviteAnswer.Decline) {
      accepted = false
    } else {
      console.log("Swoop");
      return;
    }
    console.log(accepted)
    // Missing our user uuid and invite uuid from earlier requests.
    // respondInvite(userId, inviteId, accepted)
    deleteInvite(index);
  }

  function deleteInvite(index: number) {
    setInvites((prev) => prev.filter((_, i) => i !== index));
  }

  const [invites, setInvites] = useState([
    { inviteId: "", groupname: "Bongers", invited: "", inviter: "Bong" },
    { inviteId: "", groupname: "Bingers", invited: "", inviter: "Bing" },
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
