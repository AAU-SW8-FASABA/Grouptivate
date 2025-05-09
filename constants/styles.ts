"use strict";
import { StyleSheet } from "react-native";

export const primaryColor = "#2B70CA";

const textStyle = StyleSheet.create({
  text: {
    fontFamily: "Roboto",
    fontWeight: 500,
  },
});

const globalStyles = StyleSheet.create({
  inputField: {
    backgroundColor: "rgb(229, 229, 233)",
    height: 40,
    fontSize: 18,
    paddingInline: 5,
    borderRadius: 5,
  },

  viewContainer: {
    backgroundColor: "white",
    paddingInline: 8,
  },

  section: {
    paddingTop: 0,
  },

  sectionHeader: {
    fontFamily: "Roboto",
    fontWeight: 500,
    fontSize: 28,
    marginLeft: 8,
    marginBottom: 2,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  textStyle: textStyle.text,

  title: {
    fontSize: 24,
    ...textStyle.text,
  },

  mediumTitle: {
    fontSize: 22,
    ...textStyle.text,
  },

  smallTitle: {
    fontSize: 20,
    ...textStyle.text,
  },

  bodyText: {
    fontSize: 16,
    ...textStyle.text,
  },
});

export default globalStyles;
