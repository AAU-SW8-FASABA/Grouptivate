import { StyleSheet, View, Text } from "react-native";
import { Container } from "./Container";
import { ProgressBar } from "./ProgressBar";

export function GroupContainer({
    name, image, days, groupProgress, groupTarget, individualProgress, individualTarget
}: {
    name: string, image: string, days: number, groupProgress: number, groupTarget: number, individualProgress: number, individualTarget: number
}) {
  return (
    <Container>
        <View style={styles.row}>
            <View style={{flexDirection: "row"}}>
                <img src={image} style={{width: 32, height: 32, borderRadius: 100}} />
                <Text style={[styles.text, {fontSize: 24, marginLeft: 10}]}>{name}</Text>
            </View>
            <Text style={[styles.text, {fontSize: 16}]}>{days} days left</Text>
        </View>
        <hr style={{width: "100%", border: "1px solid black", opacity: "50%"}}/>
        <ProgressBar progress={groupProgress} target={groupTarget} icon="person.3.fill" />
        <ProgressBar progress={individualProgress} target={individualTarget} icon="person.fill" />
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
      progress: {
        flex: 1,
      },
      progressText: {
        fontFamily: "Roboto",
        fontWeight: 500,
        fontSize: 16,
        position: "absolute",
        top: "50%",
        transform: "translate(-50%, -50%)"
      }
});
