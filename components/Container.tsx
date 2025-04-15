import React from "react";
import { StyleSheet, View } from "react-native";

export function Container({ children }: { children: React.ReactNode }) {
  return <View style={styles.container}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    backgroundColor: "#EFEFF3",
    borderRadius: 5,
    marginTop: 10,
    padding: 10,
  },
});
