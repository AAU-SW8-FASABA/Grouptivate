import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { PropsWithChildren } from "react";

export function CustomModal({
  children,
  title,
  height,
  isVisible,
  setIsVisible,
  createCallback,
}: PropsWithChildren & {
  height: number;
  title: string;
  isVisible: boolean;
  setIsVisible: (value: boolean) => void;
  createCallback: () => void;
}) {
  return (
    <>
      <Modal visible={isVisible} transparent={true}>
        <View
          style={{
            height: "100%",
            top: 0,
            backgroundColor: "white",
            opacity: 0.75,
          }}
        />
      </Modal>
      <Modal
        visible={isVisible}
        onRequestClose={() => setIsVisible(false)}
        transparent={true}
        animationType="slide"
      >
        <View
          style={{
            height: "40%", // TODO: This is hardcoded lol, either live with it or fix it
            top: height,
            backgroundColor: "white",
            borderColor: "black",
            borderWidth: 2,
            borderRadius: 10,
            padding: 10,
            margin: 10,
          }}
        >
          <View style={styles.row}>
            <TouchableOpacity
              style={styles.box}
              onPress={() => setIsVisible(false)}
            >
              <Text style={[styles.text, { marginRight: "auto" }]}>Cancel</Text>
            </TouchableOpacity>
            <View style={styles.box}>
              <Text style={styles.text}>{title}</Text>
            </View>
            <TouchableOpacity
              style={styles.box}
              onPress={() => {
                createCallback();
                setIsVisible(false);
              }}
            >
              <Text
                style={[styles.text, { marginLeft: "auto", fontWeight: 700 }]}
              >
                Create
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{ marginTop: 10 }}>{children}</View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: "Roboto",
    fontWeight: 500,
    fontSize: 20,
    textAlign: "center",
  },
  row: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  box: {
    display: "flex",
    justifyContent: "center",
    flex: 1,
  },
});
