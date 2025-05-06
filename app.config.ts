import { ConfigContext } from "expo/config";

export default ({ config }: ConfigContext) => {
  return {
    ...config,
    extra: {
      apiUrl:
        process.env.SERVER === "local"
          ? "http://localhost:3000"
          : process.env.EXPO_PUBLIC_SERVER_URL,
    },
  };
};
