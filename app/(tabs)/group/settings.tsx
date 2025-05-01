import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Image,
} from "react-native";
import { useMemo, useState } from "react";
import { Stack, useLocalSearchParams } from "expo-router";
import { Dropdown } from "react-native-element-dropdown";

import {
  CustomModal,
  modalMode,
  GoalCreationType,
} from "@/components/CustomModal";
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
import {
  otherActivityMetadata,
  sportActivityMetadata,
} from "@/lib/ActivityMetadata";
import { Group } from "@/lib/API/schemas/Group";
import { Goal, GoalType } from "@/lib/API/schemas/Goal";
import { Interval } from "@/lib/API/schemas/Interval";
import { getAske } from "@/lib/aske";
import { useGroups } from "@/lib/states/groupsState";

export default function GroupSettings() {
  const { id } = useLocalSearchParams();
  const groupId = id.toString();
  const { contextGroups } = useGroups();
  const [group, setGroup] = useState<Group>(contextGroups.get(groupId)!);
  const [members, setMembers] = useState(Object.entries(group.users));

  const [inviteModalVisibility, setInviteModalVisibility] = useState(false);
  const [newMemberName, setNewMemberName] = useState("");
  const [deleteModalVisibility, setDeleteModalVisibility] = useState(false);
  const [itemToDelete, setItemToDelete] = useState({
    type: "", // "member", "groupGoal", or "individualGoal"
    index: -1,
    name: "",
    memberIndex: -1,
  });
  let localGroupId = 0;
  function inviteMember() {
    if (newMemberName.trim() !== "") {
      setMembers((prev) => [
        ...prev,
        ...Object.entries({ [(++localGroupId).toString()]: newMemberName }),
      ]);
      setNewMemberName("");
      setInviteModalVisibility(false);
    }
  }

  function promptRemoveMember(index: number) {
    setItemToDelete({
      type: settingsDeletion.Member,
      index,
      name: members[index][1],
      memberIndex: -1,
    });
    setDeleteModalVisibility(true);
  }

  function promptRemoveGoal(index: number) {
    setItemToDelete({
      type: settingsDeletion.GroupGoal,
      index,
      name: groupGoals[index].goalId,
      memberIndex: -1,
    });
    setDeleteModalVisibility(true);
  }

  function promptRemoveIndividualGoal(goalIndex: number, memberIndex: number) {
    setItemToDelete({
      type: settingsDeletion.IndividualGoal,
      index: goalIndex,
      name: memberGoals.filter(
        (goal) => goal.progress[members[memberIndex][0]] >= 0,
      )[goalIndex].goalId,
      memberIndex: memberIndex,
    });
    setDeleteModalVisibility(true);
  }

  function confirmDelete() {
    if (itemToDelete.index >= 0) {
      if (itemToDelete.type === settingsDeletion.Member) {
        setMembers((prev) => prev.filter((_, i) => i !== itemToDelete.index));
        setMemberGoals((prev) =>
          prev.filter((_, i) => i !== itemToDelete.index),
        );
      } else if (itemToDelete.type === settingsDeletion.GroupGoal) {
        setGroupGoals((prev) =>
          prev.filter((_, i) => i !== itemToDelete.index),
        );
      } else if (itemToDelete.type === settingsDeletion.IndividualGoal) {
        setMemberGoals((prev) => {
          let newMemberGoals = [...prev];
          newMemberGoals = newMemberGoals.filter(
            (goal) => goal.goalId !== itemToDelete.name,
          );
          return newMemberGoals;
        });
      }
    }
    setDeleteModalVisibility(false);
  }

  const [groupGoals, setGroupGoals] = useState(
    group.goals.filter((goal) => goal.type === GoalType.Group),
  );

  // Store individual goals per member
  const [memberGoals, setMemberGoals] = useState(
    group.goals.filter((goal) => goal.type === GoalType.Individual),
  );

  const [goalModalVisibility, setGoalModalVisibility] = useState(false);
  const [currentGoalType, setCurrentGoalType] = useState(
    GoalCreationType.GroupGoal,
  );
  const [selectedMemberIndex, setSelectedMemberIndex] = useState(-1);

  const activities = [
    ...Object.values(SportActivity),
    ...Object.values(OtherActivity),
  ].map((value) => ({ label: prettyName(value), value }));

  const [activityValue, setActivityValue] = useState<
    SportActivity | OtherActivity | null
  >(null);
  const [isActivityFocus, setIsActivityFocus] = useState(false);

  const metrics = useMemo(() => {
    const supportedMetrics = activityValue
      ? ({ ...sportActivityMetadata, ...otherActivityMetadata }[activityValue]
          ?.metrics ?? Object.values(Metric))
      : Object.values(Metric);

    return supportedMetrics.map((value) => ({
      label: prettyName(value),
      value,
    }));
  }, [activityValue]);
  const [metricValue, setMetricValue] = useState<Metric | null>(null);
  const [isMetricFocus, setIsMetricFocus] = useState(false);
  const [amountValue, setAmountValue] = useState(0);
  const [titleValue, setTitleValue] = useState("");

  function openGroupGoalModal() {
    setCurrentGoalType(GoalCreationType.GroupGoal);
    resetGoalForm();
    setGoalModalVisibility(true);
  }

  function openIndividualGoalModal(memberIndex: number) {
    setCurrentGoalType(GoalCreationType.IndividualGoal);
    setSelectedMemberIndex(memberIndex);
    resetGoalForm();
    setGoalModalVisibility(true);
  }

  function resetGoalForm() {
    setActivityValue(null);
    setAmountValue(0);
    setTitleValue("");
  }

  function createGoal() {
    const newGoal: Goal = {
      activity: activityValue || OtherActivity.Steps,
      target: amountValue || 1,
      metric: Metric.Count,
      goalId: "",
      type: GoalType.Individual,
      title: titleValue || "hello",
      progress: {},
    };

    if (currentGoalType === GoalCreationType.GroupGoal) {
      setGroupGoals((prev) => [...prev, newGoal]);
    } else if (
      currentGoalType === GoalCreationType.IndividualGoal &&
      selectedMemberIndex >= 0
    ) {
      setMemberGoals((prev) => {
        newGoal.progress = { [members[selectedMemberIndex][0]]: 0 };
        return [...prev, newGoal];
      });
    }
    setGoalModalVisibility(false);
  }

  function getDeleteConfirmationText() {
    switch (itemToDelete.type) {
      case settingsDeletion.Member:
        return `Are you sure you want to remove ${itemToDelete.name}?`;
      case settingsDeletion.GroupGoal:
        return `Are you sure you want to delete the group goal "${itemToDelete.name}"?`;
      case settingsDeletion.IndividualGoal:
        return `Are you sure you want to delete the individual goal "${itemToDelete.name}" for ${members[itemToDelete.memberIndex]}?`;
      default:
        return "Are you sure you want to delete this item?";
    }
  }

  function getGoalModalTitle() {
    if (currentGoalType === GoalCreationType.GroupGoal) {
      return "New Group Goal";
    } else {
      return `New Goal for ${members[selectedMemberIndex][1]}`;
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
          height={500}
          title={getGoalModalTitle()}
          isVisible={goalModalVisibility}
          mode={modalMode.Create}
          setIsVisible={setGoalModalVisibility}
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
                  transform: [{ rotate: isMetricFocus ? "180deg" : "0deg" }],
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
              setMetricValue(item.value);
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
            keyboardType="numeric"
            value={amountValue ? String(amountValue) : ""}
            onChangeText={(text) => setAmountValue(Number(text))}
          />
          {currentGoalType === GoalCreationType.GroupGoal ? (
            <>
              <Text style={[styles.text, { fontSize: 20, marginTop: 10 }]}>
                Title
              </Text>
              <TextInput
                style={globalStyles.inputField}
                keyboardType="default"
                value={titleValue ? String(titleValue) : ""}
                onChangeText={(text) => setTitleValue(text)}
              />
            </>
          ) : (
            ""
          )}
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
              user={{ userId: member[0], name: member[1] }}
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
              unit={""}
              key={index}
              {...goal}
              onRemove={() => promptRemoveGoal(index)}
            />
          ))}
          <View
            style={[styles.row, { justifyContent: "center", marginBottom: 8 }]}
          >
            <TouchableOpacity style={styles.row} onPress={openGroupGoalModal}>
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
          {members.map(([memberId, memberName], memberIndex) => (
            <CollapsibleContainer key={memberIndex}>
              <View
                style={[
                  styles.row,
                  { justifyContent: "space-between", marginRight: 50 },
                ]}
              >
                <Image
                  source={getAske({ userId: memberId, name: memberName })}
                  style={{ width: 32, height: 32, borderRadius: 100 }}
                />
                <Text
                  numberOfLines={1}
                  style={[
                    styles.text,
                    { fontSize: 20, flex: 1, marginLeft: 10 },
                  ]}
                >
                  {memberName}
                </Text>
                <TouchableOpacity
                  onPress={() => openIndividualGoalModal(memberIndex)}
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
                {memberGoals
                  .filter((goal) => goal.progress[memberId] >= 0)
                  .map((goal, goalIndex) => (
                    <SettingsGoal
                      unit={""}
                      key={goal.goalId}
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
