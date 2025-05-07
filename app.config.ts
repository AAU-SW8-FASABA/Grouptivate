import { ConfigContext } from "expo/config";

export default ({ config }: ConfigContext) => {
  return {
    ...config,
    extra: {
      endtoend: process.env.ENDTOEND === "true" ? true : false,
      apiUrl:
        process.env.ENDTOEND === "true"
          ? "http://localhost:3000"
          : process.env.EXPO_PUBLIC_SERVER_URL,
    },
  };
};
