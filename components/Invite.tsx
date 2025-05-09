import { Container } from "@/components/Container";
import globalStyles from "@/constants/styles";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";

export enum InviteAnswer {
  Accept = "accepted",
  Decline = "decline",
}

interface InviteProps {
  inviterName: string;
  groupName: string;
  handleInvite: (answer: InviteAnswer) => void;
}

export function Invite({ inviterName, groupName, handleInvite }: InviteProps) {
  return (
    <Container style={{ marginBottom: 8 }}>
      <View style={styles.column}>
        <View>
          <Text
            style={[globalStyles.textStyle, { fontSize: 12, color: "#4A4A4A" }]}
          >
            {inviterName} invited you to:
          </Text>
          <Text style={globalStyles.title}>{groupName}</Text>
        </View>
        <View style={{ width: "50%" }}>
          <TouchableOpacity
            style={{ marginBottom: 5 }}
            onPress={() => handleInvite(InviteAnswer.Accept)}
            testID="inviteAcceptButtonTestId"
          >
            <Text
              style={[
                globalStyles.smallTitle,
                styles.button,
                { backgroundColor: "#57A773", color: "white" },
              ]}
            >
              Accept
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleInvite(InviteAnswer.Decline)}
            testID="inviteDeclineButtonTestId"
          >
            <Text
              style={[
                globalStyles.smallTitle,
                styles.button,
                { backgroundColor: "#D0312D", color: "white" },
              ]}
            >
              Decline
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Container>
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
