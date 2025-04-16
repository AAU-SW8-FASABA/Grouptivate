import { StyleSheet, View, Text } from "react-native";
import { Container } from "./Container";
import { ProgressBarIcon } from "./ProgressBarIcon";
import { OtherActivity, SportActivity } from "@/lib/API/schemas/Activity";
import {
  otherActivityMetadata,
  sportActivityMetadata,
} from "@/lib/ActivityMetadata";
import { Metric } from "@/lib/API/schemas/Metric";
import { metricMetadata } from "@/lib/MetricMetadata";

export function GoalContainer({
  activity,
  metric,
  progress,
  target,
  days,
}: {
  activity: SportActivity | OtherActivity;
  metric: Metric;
  progress: number;
  target: number;
  days: number;
}) {
  const aMeta = { ...otherActivityMetadata, ...sportActivityMetadata }[
    activity
  ];
  const mMeta = metricMetadata[metric];

  return (
    <Container>
      <View style={styles.row}>
        <View style={styles.box}>
          <Text style={[styles.text, { fontSize: 24, marginRight: "auto" }]}>
            {prettyName(activity)}
          </Text>
        </View>
        <View style={styles.box}>
          <Text style={[styles.text, { fontSize: 16 }]}>
            {progress} / {target} {mMeta.unit}
          </Text>
        </View>
        <View style={styles.box}>
          <Text style={[styles.text, { fontSize: 16, marginLeft: "auto" }]}>
            {days} days left
          </Text>
        </View>
      </View>
      <ProgressBarIcon
        {...{ progress, target }}
        iconSource={aMeta.iconSource}
        icon={aMeta.icon}
        iconSize={20}
      />
    </Container>
  );
}

/**
 * Take an id such as "fancyId" and returns the pretty version of it:
 * "Fancy id"
 */
function prettyName(id: string) {
  if (!id) return "";

  let formatted = id[0].toUpperCase();

  for (const char of id.slice(1)) {
    if (char === char.toUpperCase() && char !== char.toLowerCase()) {
      formatted += " " + char.toLowerCase();
    } else {
      formatted += char;
    }
  }

  return formatted;
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
