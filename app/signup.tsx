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
import { useUser } from "@/lib/states/userState";
import { showAlert } from "@/lib/Alert";

export default function Signup() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useUser();

  async function createAccount() {
    // TODO: Input Validation

    const response = await create(username, password);
    if (response.error) {
      showAlert(response);
      return;
    }

    const userResponse = await getUser();
    if (userResponse.error) {
      showAlert(userResponse);
      return;
    }

    setUser(userResponse.data);
    router.push("/(tabs)");
  }

  return (
    <>
      <View style={styles.header}>
        <Text
          style={[globalStyles.textStyle, { fontSize: 40, color: "black" }]}
        >
          Create account
        </Text>
        <Text style={[globalStyles.smallTitle, { textAlign: "center" }]}>
          To create an account you must select a unique username
        </Text>
      </View>
      <View style={styles.inputView}>
        <Text style={globalStyles.smallTitle}>Username</Text>
        <TextInput
          placeholder="Username"
          value={username}
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="username-new"
          onChangeText={(text) => setUsername(text)}
          style={globalStyles.inputField}
        />
        <Text style={[globalStyles.smallTitle, { marginTop: 10 }]}>
          Password
        </Text>
        <TextInput
          placeholder="Password"
          autoCapitalize="none"
          autoComplete="password-new"
          autoCorrect={false}
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
          <Text style={[globalStyles.smallTitle, { color: "white" }]}>
            Create account
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#D9D9D9" }]}
          onPress={() => router.back()}
        >
          <Text style={[globalStyles.smallTitle, { color: "black" }]}>
            Back
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
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
