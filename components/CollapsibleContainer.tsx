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
  const childArray = React.Children.toArray(children);

  if (childArray.length < 1) return;

  const topElements = childArray.slice(0, -1);
  const contentElement =
    childArray.length > 1 ? childArray[childArray.length - 1] : undefined;

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        testID="open-collapsible-container"
        onPress={() => setIsOpen((value) => !value)}
      >
        {topElements.map((elem, index) => (
          <View style={styles.top}>
            {elem}
            {index === 0 && (
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
            )}
          </View>
        ))}
        {isOpen && (
          <>
            <HR />
            <View>{contentElement}</View>
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
