import { PropsWithChildren, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";

import { IconSource, UniversalIcon } from "./ui/UniversalIcon";

export function Collapsible({
  children,
  title,
}: PropsWithChildren & { title: string }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <View>
      <TouchableOpacity
        style={styles.heading}
        onPress={() => setIsOpen((value) => !value)}
        activeOpacity={0.8}
      >
        <Text style={styles.text}>{title}</Text>
        <UniversalIcon
          source={IconSource.FontAwesome6}
          name={isOpen ? "chevron-up" : "chevron-down"}
          size={23}
          color="black"
          style={{ marginTop: 11, marginRight: 5, marginBottom: 6 }}
        />
      </TouchableOpacity>
      {isOpen && <View style={styles.content}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    backgroundColor: "white",
    color: "black",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  text: {
    fontFamily: "Roboto",
    fontWeight: 500,
    fontSize: 28,
  },
  content: {
    backgroundColor: "white",
  },
});
