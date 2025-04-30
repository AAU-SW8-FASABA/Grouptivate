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
import { login as loginApi } from "@/lib/server/login";

export default function Signin() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function login() {
    // TODO: Input Validation

    const success = await loginApi(username, password);
    if (!success && !__DEV__) {
      // TODO: Handle error
      console.log("Error signing in");
      return;
    }

    router.push("/(tabs)");
  }

  return (
    <>
      <View style={styles.header}>
        <Text style={[styles.text, { fontSize: 40, color: "black" }]}>
          Log in
        </Text>
        <Text
          style={[
            styles.text,
            { fontSize: 20, color: "black", textAlign: "center" },
          ]}
        >
          Please enter username and password
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
          style={[styles.text, { fontSize: 20, color: "black", marginTop: 10 }]}
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
          onPress={() => login()}
        >
          <Text style={[styles.text, { fontSize: 20, color: "white" }]}>
            Log in
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
