import { StyleSheet, View } from "react-native";
import { SFSymbols6_0 } from "sf-symbols-typescript";

import { IconSymbol } from '@/components/ui/IconSymbol';
import { ProgressBarPercentage } from "@/components/ProgressBarPercentage";

export function ProgressBarIcon({ progress, target = 100, icon }: { progress: number, target?: number, icon: SFSymbols6_0 }) {
    return (
        <View style={[styles.row, {marginTop: 10}]}>
            <IconSymbol size={28} name={icon} color="black" style={{paddingRight: 10}}/>
            <ProgressBarPercentage progress={progress} target={target}/>
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
