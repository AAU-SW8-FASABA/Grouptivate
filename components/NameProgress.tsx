import globalStyles from "@/constants/styles";
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
      <Text
        numberOfLines={1}
        ellipsizeMode="tail"
        style={[globalStyles.smallTitle]}
      >
        {name}
      </Text>
      <Text style={globalStyles.textStyle}>
        | {progressPercentage.toFixed(0)}%
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    flexDirection: "row",
    backgroundColor: "white",
    justifyContent: "space-between",
    flex: 1,
    borderRadius: 5,
    padding: 10,
  },
});
