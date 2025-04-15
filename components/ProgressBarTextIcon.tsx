import { StyleSheet, View } from "react-native";

import { IconSource, UniversalIcon } from "@/components/ui/UniversalIcon";
import { ProgressBarText } from "./ProgressBarText";

export function ProgressBarTextIcon({
    progress,
    target = 100,
    unit,
    iconSource,
    icon,
    iconSize = 20
}: {
    progress: number,
    target?: number,
    unit: string,
    iconSource: IconSource,
    icon: string,
    iconSize?: number
}) {
    return (
        <View style={[styles.row, {marginTop: 10}]}>
            <UniversalIcon source={iconSource} name={icon} size={iconSize} color="black" style={{ paddingRight: 10 }} />
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
