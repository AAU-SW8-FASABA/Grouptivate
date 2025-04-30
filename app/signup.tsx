import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import globalStyles from "@/constants/styles";
import { create, get as getUser } from "@/lib/server/user";
import { initialUser, UserContext } from "@/lib/states/userState";
import { User } from "@/lib/API/schemas/User";

export default function Signup() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(initialUser);

  async function createAccount() {
    // TODO: Input Validation

    const success = await create(username, password);
    if (!success) {
      // TODO: Handle error
      console.log("Error creating account");
      return;
    }

    let theUser: User = await getUser();
    setUser(theUser);
    router.push("/(tabs)");
  }

  return (
    <UserContext.Provider value={user}>
      <>
        <View style={styles.header}>
          <Text style={[styles.text, { fontSize: 40, color: "black" }]}>
            Create account
          </Text>
          <Text
            style={[
              styles.text,
              { fontSize: 20, color: "black", textAlign: "center" },
            ]}
          >
            To create an account you must select a unique username
          </Text>
        </View>
        <View style={styles.inputView}>
          <Text style={[styles.text, { fontSize: 20, color: "black" }]}>
            Username
          </Text>
          <TextInput
            value={username}
            onChangeText={(text) => setUsername(text)}
            style={globalStyles.inputField}
          />
          <Text
            style={[
              styles.text,
              { fontSize: 20, color: "black", marginTop: 10 },
            ]}
          >
            Password
          </Text>
          <TextInput
            secureTextEntry
            value={password}
            onChangeText={(text) => setPassword(text)}
            style={globalStyles.inputField}
          />
        </View>
        <View style={styles.buttons}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#4062BB" }]}
            onPress={() => createAccount()}
          >
            <Text style={[styles.text, { fontSize: 20, color: "white" }]}>
              Create account
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#D9D9D9" }]}
            onPress={() => router.back()}
          >
            <Text style={[styles.text, { fontSize: 20, color: "black" }]}>
              Back
            </Text>
          </TouchableOpacity>
        </View>
      </>
    </UserContext.Provider>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: "Roboto",
    fontWeight: 500,
  },
  header: {
    alignItems: "center",
    marginTop: 175,
    marginHorizontal: 25,
    borderRadius: 10,
  },
  inputView: {
    flex: 1,
    justifyContent: "center",
    marginHorizontal: 25,
  },
  buttons: {
    flex: 1,
    justifyContent: "flex-end",
    marginBottom: 50,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    marginHorizontal: 50,
    marginVertical: 10,
    borderRadius: 5,
  },
});
