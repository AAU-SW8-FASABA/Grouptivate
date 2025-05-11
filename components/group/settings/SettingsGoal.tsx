import React from "react";
import {
  StyleSheet,
  Text,
  View,
  StyleProp,
  ViewStyle,
  TouchableOpacity,
} from "react-native";

import { Container } from "../../Container";
import { IconSource, UniversalIcon } from "../../ui/UniversalIcon";
import { prettyName } from "@/lib/PrettyName";
import globalStyles from "@/constants/styles";

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
    <View style={[globalStyles.row, { marginBottom: 8 }, style]}>
      <Container style={[globalStyles.row, { padding }]}>
        <Text numberOfLines={1} style={globalStyles.smallTitle}>
          {prettyName(activity)}
        </Text>
        <View style={styles.targetContainer}>
          <Text style={globalStyles.bodyText}>
            {target} {unit}
          </Text>
        </View>
      </Container>
      <TouchableOpacity
        testID="delete-goal"
        style={{ marginLeft: 8 }}
        onPress={onRemove}
      >
        <UniversalIcon
          source={IconSource.FontAwesome6}
          name="circle-minus"
          size={24}
          style={{ position: "relative" }}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  targetContainer: {
    backgroundColor: "#D9D9D9",
    borderRadius: 5,
    padding: 5,
  },
});
