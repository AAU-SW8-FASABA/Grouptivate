import { StyleSheet, View, Text } from "react-native";
import { Container } from "./Container";
import { ProgressBarIcon } from "./ProgressBar/ProgressBarIcon";
import { OtherActivity, SportActivity } from "@/lib/API/schemas/Activity";
import {
  otherActivityMetadata,
  sportActivityMetadata,
} from "@/lib/ActivityMetadata";
import { Metric } from "@/lib/API/schemas/Metric";
import { metricMetadata } from "@/lib/MetricMetadata";
import { prettyName } from "@/lib/PrettyName";
import globalStyles from "@/constants/styles";

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
  let daysLeftOfGoal = days === 0 ? "Today" : days.toString();

  return (
    <Container style={{ marginBottom: 8 }}>
      <View style={styles.row}>
        <View style={styles.box}>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={[
              globalStyles.title,
              { textAlign: "center", marginRight: "auto" },
            ]}
          >
            {prettyName(activity)}
          </Text>
        </View>
        <View style={styles.box}>
          <Text style={[globalStyles.bodyText, { textAlign: "center" }]}>
            {progress} / {target} {mMeta.unit}
          </Text>
        </View>
        <View style={styles.box}>
          <Text
            style={[
              globalStyles.bodyText,
              { textAlign: "center", marginLeft: "auto" },
            ]}
          >
            {daysLeftOfGoal}
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

const styles = StyleSheet.create({
  row: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  box: {
    display: "flex",
    justifyContent: "center",
    flex: 1,
  },
});
