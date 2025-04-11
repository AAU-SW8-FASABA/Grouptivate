import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

import { IconSymbol } from "@/components/ui/IconSymbol";

export function Back() {
    const router = useRouter();

    return (
        <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", marginLeft: 5 }} onPress={() => router.back()}>
            <IconSymbol name="chevron.left" size={24} color="white" />
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
