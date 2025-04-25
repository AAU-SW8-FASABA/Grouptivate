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
  activity: string;
  target: number;
  unit: string;
  padding?: number;
  style?: StyleProp<ViewStyle>;
  onRemove?: () => void;
}

export function SettingsGoal({
  activity,
  target,
  unit,
  padding = 10,
  style,
  onRemove,
}: Props) {
  return (
    <View style={[styles.row, { marginBottom: 8 }]}>
      <Container style={{ padding }}>
        <View style={styles.row}>
          <Text numberOfLines={1} style={[styles.text, { fontSize: 20 }]}>
            {activity}
          </Text>
          <View style={styles.targetContainer}>
            <Text style={[styles.text, { fontSize: 16 }]}>
              {target} {unit}
            </Text>
          </View>
        </View>
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
