import { StyleSheet, View, Text } from "react-native";
import { Container } from "./Container";
import { ProgressBar } from "./ProgressBar";
import { SFSymbols6_0 } from "sf-symbols-typescript";

export function GoalContainer({
    activity, progress, target, days, icon
}: {
    activity: string, progress: number, target: number, days: number, icon: SFSymbols6_0
}) {
  return (
    <Container>
        <View style={styles.row}>
            <Text style={[styles.text, {fontSize: 24}]}>{activity}</Text>
            <Text style={[styles.text, {fontSize: 16}]}>{progress} / {target} kcal</Text>
            <Text style={[styles.text, {fontSize: 16}]}>{days} days left</Text>
        </View>
        <ProgressBar {...{ progress, target, icon }} />
    </Container>
  );
}

const styles = StyleSheet.create({
      text: {
        fontFamily: "Roboto",
        fontWeight: 500,
      },
      row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      },
});
