import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";
import { Stack } from "expo-router";
import { Dropdown } from "react-native-element-dropdown";

import { CustomModal, modalMode } from "@/components/CustomModal";
import { Back } from "@/components/Back";
import { Collapsible } from "@/components/Collapsible";
import { SettingsMember } from "@/components/SettingsMember";
import { SettingsGoal } from "@/components/SettingsGoal";
import { IconSource, UniversalIcon } from "@/components/ui/UniversalIcon";
import { CollapsibleContainer } from "@/components/CollapsibleContainer";
import globalStyles from "@/constants/styles";
import { CustomScrollView } from "@/components/CusomScrollView";
import { OtherActivity, SportActivity } from "@/lib/API/schemas/Activity";
import { prettyName } from "@/lib/PrettyName";
import { Metric } from "@/lib/API/schemas/Metric";

export default function GroupSettings() {
  const [members, setMembers] = useState([
    "Anders",
    "Albert Hald",
    "Alfred",
    "Aske",
    "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
  ]);

  const [inviteModalVisibility, setInviteModalVisibility] = useState(false);
  const [newMemberName, setNewMemberName] = useState("");
  const [deleteModalVisibility, setDeleteModalVisibility] = useState(false);
  const [itemToDelete, setItemToDelete] = useState({
    type: "", // "member", "groupGoal", or "individualGoal"
    index: -1,
    name: "",
    memberIndex: -1,
  });

  function inviteMember() {
    if (newMemberName.trim() !== "") {
      setMembers((prev) => [...prev, newMemberName]);
      setNewMemberName("");
      setInviteModalVisibility(false);
    }
  }

  function promptRemoveMember(index: number) {
    setItemToDelete({
      type: settingsDeletion.Member,
      index,
      name: members[index],
      memberIndex: -1,
    });
    setDeleteModalVisibility(true);
  }

  function promptRemoveGoal(index: number) {
    setItemToDelete({
      type: settingsDeletion.GroupGoal,
      index,
      name: groupGoals[index].activity,
      memberIndex: -1,
    });
    setDeleteModalVisibility(true);
  }

  function promptRemoveIndividualGoal(goalIndex: number, memberIndex: number) {
    setItemToDelete({
      type: settingsDeletion.IndividualGoal,
      index: goalIndex,
      name: individualGoals[goalIndex].activity,
      memberIndex: memberIndex,
    });
    setDeleteModalVisibility(true);
  }

  function confirmDelete() {
    if (itemToDelete.index >= 0) {
      if (itemToDelete.type === settingsDeletion.Member) {
        setMembers((prev) => prev.filter((_, i) => i !== itemToDelete.index));
      } else if (itemToDelete.type === settingsDeletion.GroupGoal) {
        setGroupGoals((prev) =>
          prev.filter((_, i) => i !== itemToDelete.index),
        );
      } else if (itemToDelete.type === settingsDeletion.IndividualGoal) {
        setIndividualGoals((prev) =>
          prev.filter((_, i) => i !== itemToDelete.index),
        );
      }
    }
  }

  const [groupGoals, setGroupGoals] = useState([
    { activity: "Walk", target: 100000, unit: "steps" },
    { activity: "Run", target: 100, unit: "km" },
  ]);
  const [individualGoals, setIndividualGoals] = useState([
    { activity: "Walk", target: 200000, unit: "steps" },
    { activity: "Run", target: 200, unit: "km" },
  ]);
  const [newGroupGoalModalVisibility, setNewGroupGoalModalVisibility] =
    useState(false);
  const unitLookup = {
    calories: "kcal",
    count: "times",
    distance: "km",
    duration: "min",
  };
  function createGoal() {
    setGroupGoals((prev) => [
      ...prev,
      {
        activity: activityValue || "New Goal",
        target: amountValue || 100,
        unit: unitLookup[metricValue ?? "distance"],
      },
    ]);
  }
  const activities = [
    ...Object.values(SportActivity),
    ...Object.values(OtherActivity),
  ].map((value) => ({ label: prettyName(value), value }));
  const [activityValue, setActivityValue] = useState(null);
  const [isActivityFocus, setIsActivityFocus] = useState(false);
  const metrics = Object.values(Metric).map((value) => ({
    label: prettyName(value),
    value,
  }));
  const [metricValue, setMericValue] = useState(null);
  const [isMetricFocus, setIsMetricFocus] = useState(false);
  const [amountValue, setAmountValue] = useState(0);

  function getDeleteConfirmationText() {
    switch (itemToDelete.type) {
      case settingsDeletion.Member:
        return `Are you sure you want to remove ${itemToDelete.name}?`;
      case settingsDeletion.GroupGoal:
        return `Are you sure you want to delete the group goal "${itemToDelete.name}"?`;
      case settingsDeletion.IndividualGoal:
        return `Are you sure you want to delete the individual goal "${itemToDelete.name}"?`;
      default:
        return "Are you sure you want to delete this item?";
    }
  }

  enum settingsDeletion {
    Member = "member",
    GroupGoal = "groupGoal",
    IndividualGoal = "individualGoal",
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "Settings",
          headerLeft: () => <Back />,
        }}
      />
      <CustomScrollView style={globalStyles.viewContainer}>
        <CustomModal
          height={350}
          title="New Goal"
          isVisible={newGroupGoalModalVisibility}
          mode={modalMode.Create}
          setIsVisible={setNewGroupGoalModalVisibility}
          callback={createGoal}
        >
          <Text style={[styles.text, { fontSize: 20, marginTop: 10 }]}>
            Activity
          </Text>
          <Dropdown
            style={[
              styles.dropdown,
              isActivityFocus && { borderColor: "blue" },
            ]}
            placeholderStyle={[styles.text, { fontSize: 20 }]}
            selectedTextStyle={[styles.text, { fontSize: 20 }]}
            itemTextStyle={[styles.text, { fontSize: 20 }]}
            data={activities}
            labelField="label"
            valueField="value"
            placeholder="Select"
            onFocus={() => setIsActivityFocus(true)}
            onBlur={() => setIsActivityFocus(false)}
            value={activityValue}
            onChange={(item) => {
              setActivityValue(item.value);
              setIsActivityFocus(false);
            }}
            renderRightIcon={() => (
              <UniversalIcon
                source={IconSource.FontAwesome6}
                name="chevron-down"
                size={20}
                color="black"
                style={{
                  transform: [{ rotate: isActivityFocus ? "180deg" : "0deg" }],
                  marginRight: 5,
                }}
              />
            )}
          />
          <Text style={[styles.text, { fontSize: 20, marginTop: 10 }]}>
            Metric
          </Text>
          <Dropdown
            style={[styles.dropdown, isMetricFocus && { borderColor: "blue" }]}
            placeholderStyle={[styles.text, { fontSize: 20 }]}
            selectedTextStyle={[styles.text, { fontSize: 20 }]}
            itemTextStyle={[styles.text, { fontSize: 20 }]}
            data={metrics}
            labelField="label"
            valueField="value"
            placeholder="Select"
            onFocus={() => setIsMetricFocus(true)}
            onBlur={() => setIsMetricFocus(false)}
            value={metricValue}
            onChange={(item) => {
              setMericValue(item.value);
              setIsMetricFocus(false);
            }}
            renderRightIcon={() => (
              <UniversalIcon
                source={IconSource.FontAwesome6}
                name="chevron-down"
                size={20}
                color="black"
                style={{
                  transform: [{ rotate: isMetricFocus ? "180deg" : "0deg" }],
                  marginRight: 5,
                }}
              />
            )}
          />
          <Text style={[styles.text, { fontSize: 20, marginTop: 10 }]}>
            Amount
          </Text>
          <TextInput
            style={globalStyles.inputField}
            onChangeText={(text) => setAmountValue(Number(text))}
          ></TextInput>
        </CustomModal>

        <CustomModal
          height={350}
          title="Invite Member"
          isVisible={inviteModalVisibility}
          mode={modalMode.Create}
          setIsVisible={setInviteModalVisibility}
          callback={inviteMember}
        >
          <Text style={[styles.text, { fontSize: 20, marginTop: 10 }]}>
            Name
          </Text>
          <TextInput
            style={globalStyles.inputField}
            placeholder="Enter user and hash: User#123"
            value={newMemberName}
            onChangeText={(text) => setNewMemberName(text)}
          />
        </CustomModal>

        <Collapsible title="Members" style={{ marginTop: 6 }}>
          {members.map((member, index) => (
            <SettingsMember
              key={index}
              name={member}
              onRemove={() => promptRemoveMember(index)}
            />
          ))}
          <View
            style={[styles.row, { justifyContent: "center", marginBottom: 8 }]}
          >
            <TouchableOpacity
              style={styles.row}
              onPress={() => setInviteModalVisibility(true)}
            >
              <UniversalIcon
                source={IconSource.FontAwesome6}
                name="circle-plus"
                size={24}
              />
              <Text style={[styles.text, styles.buttonText]}>
                Invite Member
              </Text>
            </TouchableOpacity>
          </View>
        </Collapsible>

        <CustomModal
          height={350}
          title="Confirm Delete"
          isVisible={deleteModalVisibility}
          mode={modalMode.Delete}
          setIsVisible={setDeleteModalVisibility}
          callback={confirmDelete}
        >
          <Text
            style={[
              styles.text,
              { fontSize: 18, marginTop: 10, textAlign: "center" },
            ]}
          >
            {getDeleteConfirmationText()}
          </Text>
        </CustomModal>

        <Collapsible title="Group Goals">
          {groupGoals.map((goal, index) => (
            <SettingsGoal
              key={index}
              {...goal}
              onRemove={() => promptRemoveGoal(index)}
            />
          ))}
          <View
            style={[styles.row, { justifyContent: "center", marginBottom: 8 }]}
          >
            <TouchableOpacity
              style={styles.row}
              onPress={() => setNewGroupGoalModalVisibility(true)}
            >
              <UniversalIcon
                source={IconSource.FontAwesome6}
                name="circle-plus"
                size={24}
              />
              <Text style={[styles.text, styles.buttonText]}>Create goal</Text>
            </TouchableOpacity>
          </View>
        </Collapsible>

        <Collapsible title="Individual Goals">
          {members.map((member, memberIndex) => (
            <CollapsibleContainer key={memberIndex}>
              <View
                style={[
                  styles.row,
                  { justifyContent: "space-between", marginRight: 50 },
                ]}
              >
                <Text
                  numberOfLines={1}
                  style={[styles.text, { fontSize: 20, flex: 1 }]}
                >
                  {member}
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    setIndividualGoals([
                      ...individualGoals,
                      { activity: "Run", target: 10, unit: "km" },
                    ])
                  }
                >
                  <UniversalIcon
                    source={IconSource.FontAwesome6}
                    name="plus"
                    size={24}
                    style={{ flex: 1 }}
                  />
                </TouchableOpacity>
              </View>
              <>
                {individualGoals.map((goal, goalIndex) => (
                  <SettingsGoal
                    key={goalIndex}
                    {...goal}
                    padding={0}
                    onRemove={() =>
                      promptRemoveIndividualGoal(goalIndex, memberIndex)
                    }
                  />
                ))}
              </>
            </CollapsibleContainer>
          ))}
        </Collapsible>
      </CustomScrollView>
    </>
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
  },
  buttonText: {
    fontSize: 20,
    marginLeft: 5,
  },
  input: {
    backgroundColor: "#EFEFF3",
    borderRadius: 8,
  },
  dropdown: {
    backgroundColor: "#EFEFF3",
    borderColor: "black",
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 100,
  },
  cancelButton: {
    backgroundColor: "#EFEFF3",
    borderWidth: 1,
    borderColor: "#DDD",
  },
  deleteButton: {
    backgroundColor: "#FF3B30",
  },
});
