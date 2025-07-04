import globalStyles, { primaryColor } from "@/constants/styles";
import { StyleSheet, View, Text } from "react-native";
import { Bar } from "react-native-progress";

export function ProgressBarText({
  progress,
  target = 100,
  unit,
}: {
  progress: number;
  target?: number;
  unit: string;
}) {
  const progressPercentage = Math.min((progress / target) * 100, 100);
  const isRightAligned = progressPercentage < 90;
  const indent = 5.5;

  return (
    <View style={styles.progress}>
      <Bar
        progress={progress / target}
        width={null}
        height={32}
        borderWidth={0}
        color={primaryColor}
        unfilledColor="#FFFFFF"
      ></Bar>
      <Text
        style={[
          globalStyles.bodyText,
          styles.progressText,
          isRightAligned
            ? {
                left: `${progressPercentage}%`,
                transform: [{ translateX: indent }],
                color: primaryColor,
              }
            : {
                right: `${100 - progressPercentage}%`,
                transform: [{ translateX: -indent }],
                color: "#FFFFFF",
              },
        ]}
      >
        {progress} / {target} {unit}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  progress: {
    flex: 1,
    justifyContent: "center",
  },
  progressText: {
    position: "absolute",
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
});
