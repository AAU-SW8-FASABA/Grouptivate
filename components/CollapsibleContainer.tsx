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
    <View style={[styles.container, style]}>
      <TouchableOpacity
        testID="open-collapsible-container"
        onPress={() => setIsOpen((value) => !value)}
      >
        <View style={styles.top}>
          {child1}
          <UniversalIcon
            source={IconSource.FontAwesome6}
            name={"chevron-down"}
            size={20}
            color="black"
            style={{
              position: "relative",
              transform: [{ rotate: isOpen ? "180deg" : "0deg" }],
            }}
          />
        </View>
        {isOpen && (
          <>
            <HR />
            <View>{child2}</View>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  top: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  container: {
    flexDirection: "column",
    backgroundColor: "#EFEFF3",
    width: "100%",
    borderRadius: 5,
    padding: 10,
    flex: 1,
  },
});
