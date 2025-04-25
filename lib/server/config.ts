import * as SecureStore from "expo-secure-store";
import { Token } from "../API/schemas/Token";

const SESSION_TOKEN_NAME = "SESSION_TOKEN";

const SERVER_URL = process.env.EXPO_PUBLIC_SERVER_URL;
if (!SERVER_URL) throw new Error("Missing a SERVER_URL in env");

export const url = new URL(SERVER_URL);

export async function setToken(token: Token) {
  await SecureStore.setItemAsync(SESSION_TOKEN_NAME, token);
}
export async function getToken() {
  return await SecureStore.getItemAsync(SESSION_TOKEN_NAME);
}
export async function deleteToken(){
  return await SecureStore.deleteItemAsync(SESSION_TOKEN_NAME);
}
