import { StyleSheet, View, Text } from "react-native";
import { Bar } from "react-native-progress";

export function ProgressBarText({ progress, target = 100, unit }: { progress: number, target?: number, unit: string }) {
    return (
        <View style={styles.progress}>
            <Bar progress={progress / target} width={null} height={32} borderWidth={0} color="#2B70CA" unfilledColor="#FFFFFF"></Bar>
            <Text style={styles.progressText}>{progress} / {target} {unit}</Text>
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
      color: "black", // No React Native solution to the HiFi thing
      top: "50%",
      left: "50%",
      transform: [{ translateX: "-50%" }, { translateY: "-50%" }],
    }
});
