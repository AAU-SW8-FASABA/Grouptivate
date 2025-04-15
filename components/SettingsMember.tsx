import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { Container } from "./Container";
import { IconSource, UniversalIcon } from "./ui/UniversalIcon";

export function SettingsMember({ name }: { name: string }) {
  return (
    <View style={styles.row}>
      <Container>
        <Text numberOfLines={1} style={styles.text}>
          {name}
        </Text>
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
    fontSize: 24,
    textOverflow: "ellipsis",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
});
