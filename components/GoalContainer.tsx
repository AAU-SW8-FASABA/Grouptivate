import { StyleSheet, View, Text } from "react-native";
import { Container } from "./Container";
import { ProgressBar } from "./ProgressBar";
import { SFSymbols6_0 } from "sf-symbols-typescript";

export function GoalContainer({
    activity, unit, progress, target, days, icon
}: {
    activity: string, unit: string, progress: number, target: number, days: number, icon: SFSymbols6_0
}) {
  return (
    <Container>
        <View style={styles.row}>
            <View style={styles.box}><Text style={[styles.text, {fontSize: 24, marginRight: "auto"}]}>{activity}</Text></View>
            <View style={styles.box}><Text style={[styles.text, {fontSize: 16}]}>{progress} / {target} {unit}</Text></View>
            <View style={styles.box}><Text style={[styles.text, {fontSize: 16, marginLeft: "auto"}]}>{days} days left</Text></View>
        </View>
        <ProgressBar {...{ progress, target, icon }} />
    </Container>
  );
}

const styles = StyleSheet.create({
      text: {
        fontFamily: "Roboto",
        fontWeight: 500,
        textAlign: "center"
      },
      box: {
          display: "flex",
          justifyContent: "center",
          flex: 1,
      },
      row: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
      },
});
