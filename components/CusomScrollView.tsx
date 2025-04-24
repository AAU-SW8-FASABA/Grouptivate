import { Platform, ScrollView } from "react-native";

import React from "react";
import { StyleProp, ViewStyle } from "react-native";

export function CustomScrollView({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <ScrollView
      style={style}
      contentContainerStyle={{ paddingBottom: Platform.OS === "ios" ? 85 : 20 }}
    >
      {children}
    </ScrollView>
  );
}
