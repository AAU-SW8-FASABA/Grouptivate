import { StyleSheet, View } from "react-native";

import { IconSource, UniversalIcon } from "@/components/ui/UniversalIcon";
import { ProgressBarPercentage } from "@/components/ProgressBarPercentage";

export function ProgressBarIcon({
  progress,
  target = 100,
  iconSource,
  icon,
  iconSize = 20,
}: {
  progress: number;
  target?: number;
  iconSource: IconSource;
  icon: string;
  iconSize?: number;
}) {
  return (
    <View style={[styles.row, { marginTop: 10 }]}>
      <UniversalIcon
        source={iconSource}
        name={icon}
        size={iconSize}
        color="black"
        style={{ paddingLeft: 2, paddingRight: 10 }}
      />
      <ProgressBarPercentage progress={progress} target={target} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
