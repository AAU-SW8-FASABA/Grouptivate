import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { PropsWithChildren } from "react";

export function DeleteConfirmationModal({
  children,
  title,
  height,
  isVisible,
  setIsVisible,
  deleteCallback,
}: PropsWithChildren & {
  title: string;
  height: number;
  isVisible: boolean;
  setIsVisible: (value: boolean) => void;
  deleteCallback: () => void;
}) {
  return (
    <>
      <Modal
        visible={isVisible}
        onRequestClose={() => setIsVisible(false)}
        transparent={true}
        animationType="none"
      >
        <View
          style={{
            height: "100%",
            backgroundColor: "white",
            opacity: 0.75,
          }}
        />
        <View
          style={{
            position: "absolute",
            height,
            bottom: 0,
            right: 0,
            left: 0,
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
                deleteCallback();
                setIsVisible(false);
              }}
            >
              <Text
                style={[
                  styles.text,
                  { marginLeft: "auto", fontWeight: 700, color: "#FF3B30" },
                ]}
              >
                Delete
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
