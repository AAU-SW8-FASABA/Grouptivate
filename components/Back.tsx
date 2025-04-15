import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

import { IconSource, UniversalIcon } from "@/components/ui/UniversalIcon";

export function Back() {
    const router = useRouter();

    return (
        <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", marginLeft: 5 }} onPress={() => router.back()}>
            <UniversalIcon source={IconSource.FontAwesome6} name={"chevron-left"} size={16} color="white" style={{ marginLeft: 10, marginRight: 5 }} />
            <Text style={[styles.text, { color: "white", fontSize: 20 }]}>Back</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: "Roboto",
    fontWeight: 500,
  },
});
