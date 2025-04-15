import { StyleSheet, View, Text } from "react-native";
import { IconSource } from "./ui/UniversalIcon";
import { Container } from "./Container";
import { ProgressBarIcon } from "./ProgressBarIcon";

export function GoalContainer({
  activity,
  unit,
  progress,
  target,
  days,
  iconSource,
  icon,
  iconSize,
}: {
  activity: string;
  unit: string;
  progress: number;
  target: number;
  days: number;
  iconSource: IconSource;
  icon: string;
  iconSize: number;
}) {
  return (
    <Container>
      <View style={styles.row}>
        <View style={styles.box}>
          <Text style={[styles.text, { fontSize: 24, marginRight: "auto" }]}>
            {activity}
          </Text>
        </View>
        <View style={styles.box}>
          <Text style={[styles.text, { fontSize: 16 }]}>
            {progress} / {target} {unit}
          </Text>
        </View>
        <View style={styles.box}>
          <Text style={[styles.text, { fontSize: 16, marginLeft: "auto" }]}>
            {days} days left
          </Text>
        </View>
      </View>
      <ProgressBarIcon {...{ progress, target, iconSource, icon, iconSize }} />
    </Container>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: "Roboto",
    fontWeight: 500,
    textAlign: "center",
  },
  box: {
    display: "flex",
    justifyContent: "center",
    flex: 1,
  },
  row: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
});
