import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { deleteToken, getToken } from "@/lib/server/config";
import { verify } from "@/lib/server/login";
import { useEffect } from "react";
import { useUser } from "@/lib/states/userState";
import { get as getUser } from "@/lib/server/user";
import globalStyles from "@/constants/styles";
import { showAlert } from "@/lib/Alert";

export default function Authentication() {
  const router = useRouter();
  const { setUser } = useUser();

  useEffect(() => {
    async function fetchData() {
      const token = await getToken();
      if (token) {
        const isValid = await verify();
        if (isValid) {
          const userResponse = await getUser();

          if (userResponse.error) {
            showAlert(userResponse);
            return;
          }

          setUser(userResponse.data);
          router.push("/(tabs)");
        } else {
          await deleteToken();
        }
      }
    }
    fetchData();
  }, [router, setUser]);

  return (
    <>
      <View style={styles.header}>
        <Text
          style={[globalStyles.textStyle, { fontSize: 40, color: "white" }]}
        >
          Grouptivate
        </Text>
        <Text style={[globalStyles.smallTitle, { color: "white" }]}>
          Cooperation based exercising
        </Text>
      </View>
      <View style={styles.buttons}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#4062BB" }]}
          onPress={() => router.push("/signin")}
        >
          <Text style={[globalStyles.smallTitle, { color: "white" }]}>
            Sign in
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#D9D9D9" }]}
          onPress={() => router.push("/signup")}
        >
          <Text style={globalStyles.smallTitle}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
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
