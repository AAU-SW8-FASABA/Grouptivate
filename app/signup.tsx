import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";

export default function Login() {
  const router = useRouter();

  return (
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
        <TextInput style={styles.input}></TextInput>
      </View>
      <View style={styles.buttons}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#4062BB" }]}
          onPress={() => router.push("/(tabs)")}
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
  input: {
    backgroundColor: "#EFEFF3",
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
