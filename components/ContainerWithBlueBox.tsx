import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { Container } from "./Container";

export function ContainerWithBlueBox({
  text1,
  text2,
}: {
  text1: string;
  text2: string;
}) {
  return (
    <Container>
      <Text style={[styles.text, styles.bigText]}>{text1}</Text>
      <View style={styles.blueContainer}>
        <Text style={[styles.text, styles.bigText, { color: "white" }]}>
          {text2}
        </Text>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  blueContainer: {
    backgroundColor: "#2B70CA",
    borderRadius: 5,
    marginTop: 5,
    padding: 5,
  },
  text: {
    fontFamily: "Roboto",
    fontWeight: 500,
  },
  bigText: {
    fontSize: 28,
    textAlign: "center",
  },
});
