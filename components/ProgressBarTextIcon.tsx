import { StyleSheet, View } from "react-native";
import { SFSymbols6_0 } from "sf-symbols-typescript";

import { IconSymbol } from '@/components/ui/IconSymbol';
import { ProgressBarText } from "./ProgressBarText";

export function ProgressBarTextIcon({ progress, target = 100, icon, unit }: { progress: number, target?: number, icon: SFSymbols6_0, unit: string }) {
    return (
        <View style={[styles.row, {marginTop: 10}]}>
            <IconSymbol size={28} name={icon} color="black" style={{paddingRight: 10}}/>
            <ProgressBarText progress={progress} target={target} unit={unit}/>
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
