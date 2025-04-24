import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from "react-native";

import { HR } from "./HR";
import { IconSource, UniversalIcon } from "@/components/ui/UniversalIcon";

export function CollapsibleContainer({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [child1, child2] = React.Children.toArray(children);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.collapse}
        onPress={() => setIsOpen((value) => !value)}
      >
        <UniversalIcon
          source={IconSource.FontAwesome6}
          name={"chevron-down"}
          size={20}
          color="black"
          style={{
            transform: [{ rotate: isOpen ? "180deg" : "0deg" }],
            marginTop: 5,
            marginRight: 5,
          }}
        />
      </TouchableOpacity>
      {child1}
      {isOpen && (
        <>
          <HR />
          <View>{child2}</View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    backgroundColor: "#EFEFF3",
    width: "100%",
    borderRadius: 5,
    padding: 10,
    flex: 1,
    marginBottom: 8,
  },
  collapse: {
    position: "absolute",
    top: 8,
    right: 10,
    zIndex: 99,
  },
});
