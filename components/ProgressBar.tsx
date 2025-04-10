import { StyleSheet, View, Text } from "react-native";
import { Bar } from "react-native-progress";
import { SFSymbols6_0 } from "sf-symbols-typescript";

import { IconSymbol } from '@/components/ui/IconSymbol';

export function ProgressBar({ progress, target, icon }: { progress: number, target: number, icon: SFSymbols6_0 }) {
    const progressPercentage = Math.min((progress / target) * 100, 100);
    const isRightAligned = progressPercentage < 90;
    const indent = isRightAligned ? 5 : -7.5;
  
    return (
        <View style={[styles.row, {marginTop: 10}]}>
            <IconSymbol size={28} name={icon} color="black" style={{paddingRight: 10}}/>
            <View style={styles.progress}>
                <Bar progress={progress / target} width={null} height={32} borderWidth={0} color="#2B70CA" unfilledColor="#FFFFFF"></Bar>
                <Text style={[
                    styles.progressText,
                    {
                        left: `${progressPercentage + indent}%`,
                        color: isRightAligned ? "#2B70CA" : "#FFFFFF",
                    }]}>
                        {(progress / target * 100).toFixed(0)}%
                </Text>
            </View>
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
      transform: [{ translateX: "-50%" }, { translateY: "-50%" }]
    }
});
