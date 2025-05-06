import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { PropsWithChildren } from "react";
import { GoalType } from "@/lib/API/schemas/Goal";

export enum modalMode {
  Create = "create",
  Delete = "delete",
}
// export enum GoalCreationType {
//   GroupGoal = "groupGoal",
//   IndividualGoal = "individualGoal",
// }

export function CustomModal({
  children,
  title,
  height,
  isVisible,
  mode,
  setIsVisible,
  callback,
}: PropsWithChildren & {
  title: string;
  height: number;
  isVisible: boolean;
  mode: modalMode;
  setIsVisible: (value: boolean) => void;
  callback: (goal: GoalType) => void;
}) {
  const handleConfirm = () => {
    callback(GoalType.Group);
    setIsVisible(false);
  };

  const confirmButtonText = mode === modalMode.Create ? "Create" : "Delete";

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
            <TouchableOpacity style={styles.box} onPress={handleConfirm}>
              <Text
                style={[styles.text, { marginLeft: "auto", fontWeight: 700 }]}
              >
                {confirmButtonText}
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
