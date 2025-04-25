import React from "react";
import {
  StyleSheet,
  Text,
  View,
  StyleProp,
  ViewStyle,
  TouchableOpacity,
} from "react-native";

import { Container } from "./Container";
import { IconSource, UniversalIcon } from "./ui/UniversalIcon";

interface Props {
  name: string;
  style?: StyleProp<ViewStyle>;
  onRemove?: () => void;
}

export function SettingsMember({ name, style, onRemove }: Props) {
  return (
    <View style={[styles.row, style]}>
      <Container>
        <Text numberOfLines={1} style={styles.text}>
          {name}
        </Text>
      </Container>
      <TouchableOpacity onPress={onRemove}>
        <UniversalIcon
          source={IconSource.FontAwesome6}
          name="circle-minus"
          size={24}
          style={{ marginTop: 10, marginLeft: 5 }}
        />
      </TouchableOpacity>
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
