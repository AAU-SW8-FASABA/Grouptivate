import { Container } from "@/components/Container";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";

export enum InviteAnswer {
  Accept = "accepted",
  Decline = "decline",
}

interface InviteProps {
  inviter: string;
  groupname: string;
  handleInvite: (answer: InviteAnswer) => void;
}

export function Invite({ inviter, groupname, handleInvite }: InviteProps) {
  return (
    <Container style={{ marginBottom: 8 }}>
      <View style={styles.column}>
        <View>
          <Text style={[styles.text, { fontSize: 12, color: "#4A4A4A" }]}>
            {inviter} invited you to:
          </Text>
          <Text style={[styles.text, { fontSize: 24 }]}>{groupname}</Text>
        </View>
        <View style={{ width: "50%" }}>
          <TouchableOpacity
            style={{ marginBottom: 5 }}
            onPress={() => handleInvite(InviteAnswer.Accept)}
          >
            <Text
              style={[
                styles.text,
                styles.button,
                { backgroundColor: "#57A773", color: "white" },
              ]}
            >
              Accept
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleInvite(InviteAnswer.Decline)}>
            <Text
              style={[
                styles.text,
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
