import React from "react";
import { StyleSheet, Text, View, StyleProp, ViewStyle } from "react-native";

import { Container } from "./Container";
import { IconSource, UniversalIcon } from "./ui/UniversalIcon";

interface Props {
  name: string;
  style?: StyleProp<ViewStyle>;
}

export function SettingsMember({ name, style }: Props) {
  return (
    <View style={[styles.row, style]}>
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
    fontSize: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
});
