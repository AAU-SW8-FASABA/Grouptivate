import { primaryColor } from "@/constants/styles";
import { StyleSheet, View, Text } from "react-native";
import { Bar } from "react-native-progress";

export function ProgressBarPercentage({
  progress,
  target = 100,
}: {
  progress: number;
  target?: number;
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
        {((progress / target) * 100).toFixed(0)}%
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
    fontFamily: "Roboto",
    fontWeight: 500,
    fontSize: 16,
    position: "absolute",
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
});
