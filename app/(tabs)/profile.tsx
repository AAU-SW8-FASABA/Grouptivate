import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity } from 'react-native';

import { Container } from '@/components/Container';

export default function Profile() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.center}>
        <Image source={require("@/assets/images/Aske.png")} style={styles.profilePhoto} />
        <Text style={[styles.text, styles.profileName]}>Aske #82</Text>
        <Text style={[styles.text, { fontSize: 32, marginTop: 50 }]}>Invitations</Text>
        <Container>
          <View style={styles.column}>
            <View>
              <Text style={[styles.text, { fontSize: 12, color: "#4A4A4A" }]}>Hald #81 invited you to:</Text>
              <Text style={[styles.text, { fontSize: 24 }]}>The Gulops</Text>
            </View>
            <View style={{width: "50%"}}>
              <TouchableOpacity style={{ marginBottom: 5 }}>
                <Text style={[styles.text, styles.button, { backgroundColor: "#57A773", color: "white" }]}>Accept</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={[styles.text, styles.button, { backgroundColor: "#D0312D", color: "white" }]}>Decline</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Container>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 20,
    paddingTop: 10,
  },
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
    borderRadius: "100%",
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
  }
});
