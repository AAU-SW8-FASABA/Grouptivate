import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Image,
} from "react-native";
import { useEffect, useMemo, useState } from "react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
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
import {
  otherActivityMetadata,
  sportActivityMetadata,
} from "@/lib/ActivityMetadata";
import { Group } from "@/lib/API/schemas/Group";
import { useUser } from "@/lib/states/userState";
import { Goal, GoalType } from "@/lib/API/schemas/Goal";
import { getAske } from "@/lib/aske";
import { useGroups } from "@/lib/states/groupsState";
import { create as createInvite } from "@/lib/server/group/invite";
import { remove } from "@/lib/server/group/remove";
import { _delete, create } from "@/lib/server/group/goal";
import { metricMetadata } from "@/lib/MetricMetadata";

export default function GroupSettings() {
  const { id } = useLocalSearchParams();
  const { user } = useUser();
  const groupId = id?.toString() || "";
  const { contextGroups } = useGroups();
  const theGroup = contextGroups.get(groupId);
  const router = useRouter();

  const [group, setGroup] = useState<Group | null>(null);
  const [members, setMembers] = useState<[string, string][]>([]);
  const [groupGoals, setGroupGoals] = useState<Goal[]>([]);
  const [memberGoals, setMemberGoals] = useState<Goal[]>([]);

  useEffect(() => {
    if (groupId && theGroup != null) {
      const currentGroup = theGroup;
      console.log("Loading group from contextGroups:", groupId, currentGroup);
      setGroup(currentGroup);
      setMembers(Object.entries(currentGroup.users));
      setGroupGoals(
        currentGroup.goals.filter((goal) => goal.type === GoalType.Group),
      );
      setMemberGoals(
        currentGroup.goals.filter((goal) => goal.type === GoalType.Individual),
      );
    } else {
      console.log("Group not found in contextGroups:", groupId);
    }
  }, [groupId, theGroup]);

  // Debug output
  useEffect(() => {
    if (group) {
      console.log("Current group state:", group.goals.length, "goals");
    }
  }, [group]);

  const [inviteModalVisibility, setInviteModalVisibility] = useState(false);
  const [newMemberName, setNewMemberName] = useState("");
  const [deleteModalVisibility, setDeleteModalVisibility] = useState(false);
  const [itemToDelete, setItemToDelete] = useState({
    type: "", // "member", "groupGoal", or "individualGoal"
    index: -1,
    name: "", //name
    id: "",
    memberIndex: -1,
  });

  // function updateGroup() {
  //   if (!group) return;

  //   const updatedGroup: Group = {
  //     ...group,
  //     goals: [...memberGoals, ...groupGoals],
  //   };
  //   contextGroups.set(groupId, updatedGroup);
  //   setGroup(updatedGroup);
  // }

  async function inviteMember() {
    if (newMemberName.trim() !== "") {
      try {
        await createInvite(groupId, newMemberName);
        // After inviting, we don't need to update local state as the group
        // should be refreshed from the server later
      } catch (e) {
        console.log(e);
      }
      setNewMemberName("");
      setInviteModalVisibility(false);
    }
  }

  function promptRemoveMember(index: number) {
    const [id, name] = members[index];
    setItemToDelete({
      type: settingsDeletion.Member,
      index,
      id: id,
      name: name,
      memberIndex: -1,
    });
    setDeleteModalVisibility(true);
  }

  function promptRemoveGoal(index: number) {
    const groupGoal = groupGoals[index];
    setItemToDelete({
      type: settingsDeletion.GroupGoal,
      index,
      id: groupGoal.goalId,
      name: groupGoal.title,
      memberIndex: -1,
    });
    setDeleteModalVisibility(true);
  }

  function promptRemoveIndividualGoal(goalId: string, memberIndex: number) {
    const goal = memberGoals.find((g) => g.goalId === goalId);
    setItemToDelete({
      type: settingsDeletion.IndividualGoal,
      index: 0,
      id: goalId,
      name: goal?.title || "",
      memberIndex: memberIndex,
    });
    setDeleteModalVisibility(true);
  }

  async function confirmDelete() {
    if (!group) return;

    if (
      itemToDelete.type === settingsDeletion.Member &&
      itemToDelete.index >= 0
    ) {
      try {
        await remove(itemToDelete.id, groupId);
        // Update the local state immediately
        const newGroup = { ...group };
        delete newGroup.users[itemToDelete.id];

        // Update goals by removing progress for this member
        const updatedGoals = group.goals.map((goal) => {
          const newGoal = { ...goal };
          delete newGoal.progress[itemToDelete.id];
          return newGoal;
        });

        newGroup.goals = updatedGoals;

        // Update context groups
        contextGroups.set(groupId, newGroup);

        // Update local state
        setGroup(newGroup);
        setMembers((prev) => prev.filter((_, i) => i !== itemToDelete.index));
        setMemberGoals((prev) =>
          prev.filter(
            (goal) =>
              !goal.progress[itemToDelete.id] &&
              goal.progress[itemToDelete.id] !== 0,
          ),
        );
        if (itemToDelete.id === user.userId) {
          router.push({
            pathname: "/",
          });
        }
      } catch (e) {
        console.log("Error removing member:", e);
      }
    } else if (
      itemToDelete.type === settingsDeletion.GroupGoal &&
      itemToDelete.index >= 0
    ) {
      try {
        await _delete(itemToDelete.id);

        // Update group goals in local state
        const updatedGroupGoals = groupGoals.filter(
          (_, i) => i !== itemToDelete.index,
        );
        setGroupGoals(updatedGroupGoals);

        // Update group in context
        if (group) {
          const updatedGroup = {
            ...group,
            goals: [
              ...group.goals.filter(
                (goal) =>
                  goal.type !== GoalType.Group ||
                  goal.goalId !== groupGoals[itemToDelete.index].goalId,
              ),
            ],
          };
          contextGroups.set(groupId, updatedGroup);
          setGroup(updatedGroup);
        }
      } catch (e) {
        console.log("Error deleting group goal:", e);
      }
    } else if (itemToDelete.type === settingsDeletion.IndividualGoal) {
      try {
        await _delete(itemToDelete.id);

        // Update member goals in local state
        const updatedMemberGoals = memberGoals.filter(
          (goal) => goal.goalId !== itemToDelete.id,
        );
        setMemberGoals(updatedMemberGoals);

        // Update group in context
        if (group) {
          const updatedGroup = {
            ...group,
            goals: [
              ...group.goals.filter((goal) => goal.goalId !== itemToDelete.id),
            ],
          };
          contextGroups.set(groupId, updatedGroup);
          setGroup(updatedGroup);
        }
      } catch (e) {
        console.log("Error deleting individual goal:", e);
      }
    }

    setDeleteModalVisibility(false);
  }

  const [goalModalVisibility, setGoalModalVisibility] = useState(false);
  const [currentGoalType, setCurrentGoalType] = useState<GoalType>(
    GoalType.Group,
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

  const [metricValue, setMetricValue] = useState<Metric>(Metric["Count"]);
  const [isMetricFocus, setIsMetricFocus] = useState(false);
  const [amountValue, setAmountValue] = useState(0);
  const [titleValue, setTitleValue] = useState("");

  function openGroupGoalModal() {
    setCurrentGoalType(GoalType.Group);
    resetGoalForm();
    setGoalModalVisibility(true);
  }

  function openIndividualGoalModal(memberIndex: number) {
    setCurrentGoalType(GoalType.Individual);
    setSelectedMemberIndex(memberIndex);
    resetGoalForm();
    setGoalModalVisibility(true);
  }

  function resetGoalForm() {
    setActivityValue(null);
    setAmountValue(0);
    setTitleValue("");
  }

  async function createGoal() {
    if (!group || members.length === 0) return;

    const newGoal: Omit<Goal, "goalId"> = {
      activity: activityValue || OtherActivity.Steps,
      target: amountValue || 1,
      metric: metricValue,
      type: currentGoalType,
      title: titleValue || "Goal",
      progress: {},
    };

    try {
      if (currentGoalType === GoalType.Group) {
        const response = await create(members[0][0], groupId, newGoal);
        setGroupGoals((prev) => [...prev, response]);

        // Update group with the new goal
        if (group) {
          const updatedGroup = {
            ...group,
            goals: [
              ...group.goals.filter((g) => g.type !== GoalType.Group),
              ...groupGoals,
              response,
            ],
          };
          contextGroups.set(groupId, updatedGroup);
          setGroup(updatedGroup);
        }
      } else if (
        currentGoalType === GoalType.Individual &&
        selectedMemberIndex >= 0
      ) {
        const response = await create(
          members[selectedMemberIndex][0],
          groupId,
          newGoal,
        );
        setMemberGoals((prev) => [...prev, response]);

        if (group) {
          const updatedGroup = {
            ...group,
            goals: [
              ...group.goals.filter((g) => g.type !== GoalType.Individual),
              ...memberGoals,
              response,
            ],
          };
          contextGroups.set(groupId, updatedGroup);
          setGroup(updatedGroup);
        }
      }
    } catch (e) {
      console.log("Error creating goal:", e);
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
        return `Are you sure you want to delete the individual goal "${itemToDelete.name}" for ${
          itemToDelete.memberIndex >= 0 && members[itemToDelete.memberIndex]
            ? members[itemToDelete.memberIndex][1]
            : "this member"
        }?`;
      default:
        return "Are you sure you want to delete this item?";
    }
  }

  function getGoalModalTitle() {
    if (currentGoalType === GoalType.Group) {
      return "New Group Goal";
    } else {
      return selectedMemberIndex >= 0 && members[selectedMemberIndex]
        ? `New Goal for ${members[selectedMemberIndex][1]}`
        : "New Individual Goal";
    }
  }

  enum settingsDeletion {
    Member = "member",
    GroupGoal = "groupGoal",
    IndividualGoal = "individualGoal",
  }

  if (!group) {
    return (
      <>
        <Stack.Screen
          options={{
            title: "Settings",
            headerLeft: () => <Back />,
          }}
        />
        <View
          style={[
            globalStyles.viewContainer,
            { justifyContent: "center", alignItems: "center" },
          ]}
        >
          <Text style={styles.text}>Loading group settings...</Text>
        </View>
      </>
    );
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
            autoCapitalize="none"
            autoComplete="off"
            autoCorrect={false}
            keyboardType="numeric"
            value={amountValue ? String(amountValue) : ""}
            onChangeText={(text) => setAmountValue(Number(text) || 0)}
          />
          {currentGoalType === GoalType.Group ? (
            <>
              <Text style={[styles.text, { fontSize: 20, marginTop: 10 }]}>
                Title
              </Text>
              <TextInput
                style={globalStyles.inputField}
                autoCapitalize="none"
                autoComplete="off"
                secureTextEntry={true}
                autoCorrect={false}
                keyboardType="default"
                value={titleValue}
                onChangeText={(text) => setTitleValue(text)}
              />
            </>
          ) : null}
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
            autoCapitalize="none"
            autoComplete="off"
            autoCorrect={false}
            placeholder="Enter user and hash: User#123"
            value={newMemberName}
            onChangeText={(text) => setNewMemberName(text)}
          />
        </CustomModal>

        <Collapsible title="Members" style={{ marginTop: 6 }}>
          {members.map((member, index) => (
            <SettingsMember
              key={member[0]}
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
              unit={metricMetadata[goal.metric].unit}
              key={goal.goalId}
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
            <CollapsibleContainer key={memberId}>
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
                  .map((goal) => (
                    <SettingsGoal
                      unit={metricMetadata[goal.metric].unit}
                      key={goal.goalId}
                      {...goal}
                      padding={0}
                      onRemove={() =>
                        promptRemoveIndividualGoal(goal.goalId, memberIndex)
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
