import React from "react";
import { StyleSheet, View, StyleProp, ViewStyle } from "react-native";

export function Container({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return <View style={[styles.container, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    backgroundColor: "#EFEFF3",
    width: "100%",
    borderRadius: 5,
    padding: 10,
    flex: 1,
  },
});
