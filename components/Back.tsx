import { Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

import { IconSource, UniversalIcon } from "@/components/ui/UniversalIcon";
import globalStyles from "@/constants/styles";

export function Back() {
  const router = useRouter();

  return (
    <TouchableOpacity
      testID="back-button"
      style={{ flexDirection: "row", alignItems: "center", marginLeft: 5 }}
      onPress={() => router.back()}
    >
      <UniversalIcon
        source={IconSource.FontAwesome6}
        name={"chevron-left"}
        size={16}
        color="white"
        style={{ marginLeft: 10, marginRight: 5 }}
      />
      <Text style={[globalStyles.smallTitle, { color: "white" }]}>Back</Text>
    </TouchableOpacity>
  );
}
