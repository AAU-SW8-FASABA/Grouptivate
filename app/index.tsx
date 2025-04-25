import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useEffect } from "react";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";

export default function Authentication() {
  const router = useRouter();

  //TODO: Splash screen?
  useEffect(() => {
    async function fetchData() {
      const token = await SecureStore.getItemAsync("sessionToken");
      if (token) {
        const response = await fetch("http://10.0.2.2:3000/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          router.push("/(tabs)");
        }
      }
    }
    fetchData();
  }, [router]);

  return (
    <>
      <View style={styles.header}>
        <Text style={[styles.text, { fontSize: 40, color: "white" }]}>
          Grouptivate
        </Text>
        <Text style={[styles.text, { fontSize: 20, color: "white" }]}>
          Cooperation based exercising
        </Text>
      </View>
      <View style={styles.buttons}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#4062BB" }]}
          onPress={() => router.push("/signin")}
        >
          <Text style={[styles.text, { fontSize: 20, color: "white" }]}>
            Sign in
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#D9D9D9" }]}
          onPress={() => router.push("/signup")}
        >
          <Text style={[styles.text, { fontSize: 20, color: "black" }]}>
            Sign up
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
    backgroundColor: "#1E4E8C",
    marginTop: 175,
    marginHorizontal: 25,
    paddingTop: 15,
    paddingBottom: 25,
    paddingHorizontal: 25,
    borderRadius: 10,
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
