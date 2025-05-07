import { ConfigContext } from "expo/config";

let apiUrl = process.env.EXPO_PUBLIC_SERVER_URL;

if (process.env.ENDTOEND === "true") {
  if (process.env.PLATFORM === "android") {
    apiUrl = "http://10.0.2.2:3000";
  } else if (process.env.PLATFORM === "ios") {
    apiUrl = "http://localhost:3000";
  } else {
    throw new Error(
      "Must specify PLATFORM environment variable: ios | android",
    );
  }
}

export default ({ config }: ConfigContext) => {
  return {
    ...config,
    extra: {
      endtoend: process.env.ENDTOEND === "true" ? true : false,
      apiUrl,
    },
  };
};
