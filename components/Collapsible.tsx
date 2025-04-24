import { PropsWithChildren, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from "react-native";

import { IconSource, UniversalIcon } from "./ui/UniversalIcon";
import globalStyles from "@/constants/styles";

export function Collapsible({
  children,
  title,
  style,
}: PropsWithChildren & { title: string; style?: StyleProp<ViewStyle> }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <View style={style}>
      <TouchableOpacity
        style={styles.heading}
        onPress={() => setIsOpen((value) => !value)}
      >
        <Text style={globalStyles.sectionHeader}>{title}</Text>
        <UniversalIcon
          source={IconSource.FontAwesome6}
          name={isOpen ? "chevron-up" : "chevron-down"}
          size={23}
          color="black"
          style={{ marginRight: 5 }}
        />
      </TouchableOpacity>
      {isOpen && <View style={styles.content}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    backgroundColor: "white",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  content: {
    backgroundColor: "white",
  },
});
