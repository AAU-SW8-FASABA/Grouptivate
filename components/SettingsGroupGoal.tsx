import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { Container } from "./Container";
import { IconSource, UniversalIcon } from "./ui/UniversalIcon";

export function SettingsGroupGoal({
  name,
  target,
  unit,
}: {
  name: string;
  target: number;
  unit: string;
}) {
  return (
    <View style={styles.row}>
      <Container>
        <View style={styles.row}>
          <Text numberOfLines={1} style={[styles.text, { fontSize: 24 }]}>
            {name}
          </Text>
          <View style={styles.targetContainer}>
            <Text style={[styles.text, { fontSize: 16 }]}>
              {target} {unit}
            </Text>
          </View>
        </View>
      </Container>
      <UniversalIcon
        source={IconSource.FontAwesome6}
        name="circle-minus"
        size={24}
        style={{ marginTop: 10, marginLeft: 5 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: "Roboto",
    fontWeight: 500,
    textOverflow: "ellipsis",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  targetContainer: {
    backgroundColor: "#D9D9D9",
    borderRadius: 5,
    padding: 5,
  },
});
