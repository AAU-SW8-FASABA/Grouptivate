import {
  StyleSheet,
  StyleProp,
  ViewStyle,
  View,
  Text,
  Image,
} from "react-native";

import { HR } from "./HR";
import { IconSource } from "./ui/UniversalIcon";
import { Container } from "./Container";
import { ProgressBarIcon } from "./ProgressBar/ProgressBarIcon";

export function GroupContainer({
  name,
  days,
  groupProgress,
  groupTarget,
  individualProgress,
  individualTarget,
  style,
}: {
  name: string;
  days: number;
  groupProgress: number;
  groupTarget: number;
  individualProgress: number;
  individualTarget: number;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Container style={style}>
      <View style={styles.row}>
        <View style={{ flexDirection: "row" }}>
          <Image
            source={require("@/assets/images/Aske.png")}
            style={{ width: 32, height: 32, borderRadius: 100 }}
          />
          <Text style={[styles.text, { fontSize: 24, marginLeft: 10 }]}>
            {name}
          </Text>
        </View>
        <Text style={[styles.text, { fontSize: 16 }]}>{days} days left</Text>
      </View>
      <HR />
      <ProgressBarIcon
        progress={groupProgress}
        target={groupTarget}
        iconSource={IconSource.FontAwesome6}
        icon="users"
        iconSize={20}
      />
      <ProgressBarIcon
        progress={individualProgress}
        target={individualTarget}
        iconSource={IconSource.FontAwesome6}
        icon="user-large"
        iconSize={20}
      />
    </Container>
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
  progress: {
    flex: 1,
  },
  progressText: {
    fontFamily: "Roboto",
    fontWeight: 500,
    fontSize: 16,
    position: "absolute",
    top: "50%",
    transform: "translate(-50%, -50%)",
  },
});
