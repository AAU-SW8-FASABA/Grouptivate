import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { Container } from "./Container";
import { primaryColor } from "@/constants/styles";

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
    backgroundColor: primaryColor,
    borderRadius: 5,
    marginTop: 10,
    padding: 5,
    height: 45,
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
