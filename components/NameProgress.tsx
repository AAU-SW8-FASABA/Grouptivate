import { StyleSheet, View, Text } from "react-native";

export function NameProgress({
  name,
  progress,
  target = 100,
}: {
  name: string;
  progress: number;
  target?: number;
}) {
  const progressPercentage = Math.min((progress / target) * 100, 100);

  return (
    <View style={styles.container}>
      <Text numberOfLines={1} style={[styles.text, { flex: 1 }]}>
        {name}
      </Text>
      <Text style={styles.text}>| {progressPercentage.toFixed(0)}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "white",
    justifyContent: "space-between",
    flex: 1,
    flexBasis: "48%",
    borderRadius: 5,
    padding: 10,
  },
  text: {
    fontFamily: "Roboto",
    fontWeight: 500,
    fontSize: 20,
  },
});
