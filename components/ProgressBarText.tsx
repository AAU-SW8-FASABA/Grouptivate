import { StyleSheet, View, Text } from "react-native";
import { Bar } from "react-native-progress";

export function ProgressBarText({ progress, target = 100, unit }: { progress: number, target?: number, unit: string}) {
    const progressPercentage = Math.min((progress / target) * 100, 100);
    const isRightAligned = progressPercentage < 60;
    const indent = 5;

    return (
        <View style={styles.progress}>
            <Bar progress={progress / target} width={null} height={32} borderWidth={0} color="#2B70CA" unfilledColor="#FFFFFF"></Bar>
            <Text style={[
                styles.progressText,
                isRightAligned ? {
                  left: `${progressPercentage}%`,
                  transform: [{ translateX: indent }, { translateY: "-50%" }],
                  color: "#2B70CA",
                } : {
                  right: `${100 - progressPercentage}%`,
                  transform: [{ translateX: -indent }, { translateY: "-50%" }],
                  color: "#FFFFFF",
                }]}>
                    {progress} / {target} {unit}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
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
    }
});
