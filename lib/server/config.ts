import { Platform } from "react-native";
import { Token } from "../API/schemas/Token";
import Constants from "expo-constants";

const SESSION_TOKEN_NAME = "SESSION_TOKEN";

const SERVER_URL = Constants?.expoConfig?.extra?.apiUrl;
if (!SERVER_URL) throw new Error("Missing a SERVER_URL in env");

export const url = new URL(SERVER_URL);

export async function setToken(token: Token) {
  const SecureStore = await getSecureStore();
  await SecureStore.setItemAsync(SESSION_TOKEN_NAME, token);
}
export async function getToken() {
  const SecureStore = await getSecureStore();
  return await SecureStore.getItemAsync(SESSION_TOKEN_NAME);
}
export async function deleteToken() {
  const SecureStore = await getSecureStore();
  return await SecureStore.deleteItemAsync(SESSION_TOKEN_NAME);
}

async function getSecureStore() {
  if (Platform.OS === "web") {
    return {
      setItemAsync: async (key: string, value: string) => {
        return localStorage.setItem(key, value);
      },
      getItemAsync: async (key: string): Promise<string | null> => {
        return localStorage.getItem(key);
      },
      deleteItemAsync: async (key: string) => {
        return localStorage.removeItem(key);
      },
    };
  } else {
    return await require("expo-secure-store");
  }
}
