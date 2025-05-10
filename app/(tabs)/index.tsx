import { useState, Suspense, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { Dropdown } from "react-native-element-dropdown";
import { useUser } from "@/lib/states/userState";

import { CustomModal, modalMode } from "@/components/CustomModal";
import { Collapsible } from "@/components/Collapsible";
import { IconSource, UniversalIcon } from "@/components/ui/UniversalIcon";
import { GoalContainer } from "@/components/GoalContainer";
import { GroupContainer } from "@/components/GroupContainer";
import globalStyles from "@/constants/styles";
import { CustomScrollView } from "@/components/CustomScrollView";
import { create as postCreateGroup } from "@/lib/server/group";
import { get as getGroups } from "@/lib/server/groups";
import { get as getUser } from "@/lib/server/user";
import { Interval } from "@/lib/API/schemas/Interval";
import type { Group } from "@/lib/API/schemas/Group";
import type { Goal } from "@/lib/API/schemas/Goal";
import { GoalType } from "@/lib/API/schemas/Goal";
import { prettyName } from "@/lib/PrettyName";
import { getDaysLeftInInterval } from "@/lib/IntervalDates";
import { ContextGroups, useGroups } from "@/lib/states/groupsState";
import { showAlert } from "@/lib/Alert";
import { SyncActivity } from "@/lib/ActivitySync";

export default function Main() {
  const { user, setUser } = useUser();
  const { contextGroups, setContextGroups } = useGroups();
  const router = useRouter();
  const [newGroupModalVisibility, setNewGroupModalVisibility] = useState(false);
  const [newGroupName, setGroupName] = useState("");
  const [intervalValue, setIntervalValue] = useState(Interval.Weekly);
  const [isIntervalFocus, setIsIntervalFocus] = useState(false);
  const [groups, setGroups] = useState<Group[]>([]);
  const [individualGoals, setIndividualGoals] = useState<Goal[]>([]);

  // TODO: Handle empty group name
  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchData = async () => {
        // Fetch User
        const userResponse = await getUser();
        if (userResponse.error) {
          showAlert(userResponse);
          return;
        }

        // Set User
        setUser(userResponse.data);

        // Fetch groups
        const groupResponse = await getGroups();
        if (groupResponse.error) {
          showAlert(groupResponse);
          return;
        }

        // Set groups
        setContextGroups(
          groupResponse.data.reduce<ContextGroups>((acc, curr) => {
            return acc.set(curr.groupId, curr);
          }, new Map()),
        );
        setGroups(groupResponse.data);

        // Sync activity given the user and the groups
        SyncActivity(user.userId, groupResponse.data);

        // Set individual goals
        setIndividualGoals(
          userResponse.data.goals.filter(
            (goal) => goal.type === GoalType.Individual,
          ),
        );
      };
      fetchData();

      return () => {
        isActive = false;
      };
    }, [setContextGroups, setUser, user.userId]),
  );

  const intervals = Object.values(Interval).map((value) => ({
    label: prettyName(value),
    value,
  }));

  async function createGroup() {
    const groupResponse = await postCreateGroup(
      user,
      newGroupName,
      intervalValue,
    );

    if (groupResponse.error) {
      showAlert(groupResponse);
      return;
    }
    contextGroups.set(groupResponse.data.groupId, groupResponse.data);
    setGroups((prev) => [...prev, groupResponse.data]);
  }

  function individualProgress(group: Group) {
    const userGoals = group.goals.filter(
      (goal) =>
        goal.type === GoalType.Individual && goal.progress[user.userId] != null,
    );
    if (userGoals.length) {
      const progress =
        (userGoals.reduce(
          (acc, goal) =>
            acc + Math.min(goal.progress[user.userId] / goal.target, 1),
          0,
        ) /
          userGoals.length) *
        100;
      return progress;
    }
    return 0;
  }

  function groupProgress(group: Group) {
    if (group.goals.length) {
      const progress =
        (group.goals.reduce(
          (acc, goal) =>
            acc +
            Object.values(goal.progress).reduce((sum, add) => sum + add, 0) /
              goal.target,
          0,
        ) /
          group.goals.length) *
        100;
      return progress;
    }
    return 0;
  }

  function findGoalEndDate(goal: Goal): number {
    let daysUntilEndDate: number;
    groups.forEach((group) => {
      if (group.goals.includes(goal)) {
        daysUntilEndDate = Math.ceil(getDaysLeftInInterval(group.interval));
        return daysUntilEndDate;
      }
    });
    return 0;
  }

  return (
    <Suspense>
      <CustomScrollView style={globalStyles.viewContainer}>
        <CustomModal
          height={410}
          title="New Group"
          isVisible={newGroupModalVisibility}
          mode={modalMode.Create}
          setIsVisible={setNewGroupModalVisibility}
          callback={createGroup}
        >
          <Text style={globalStyles.smallTitle}>Group Name</Text>
          <TextInput
            style={globalStyles.inputField}
            autoCapitalize="none"
            autoComplete="off"
            autoCorrect={false}
            onChangeText={setGroupName}
            value={newGroupName}
          ></TextInput>
          <Text style={[globalStyles.smallTitle, { marginTop: 10 }]}>
            Interval
          </Text>
          <Dropdown
            style={[
              styles.dropdown,
              isIntervalFocus && { borderColor: "blue" },
            ]}
            placeholderStyle={globalStyles.smallTitle}
            selectedTextStyle={globalStyles.smallTitle}
            itemTextStyle={globalStyles.smallTitle}
            data={intervals}
            labelField="label"
            valueField="value"
            placeholder="Select"
            onFocus={() => setIsIntervalFocus(true)}
            onBlur={() => setIsIntervalFocus(false)}
            value={intervalValue}
            onChange={(item) => {
              setIntervalValue(item.value);
              setIsIntervalFocus(false);
            }}
            renderRightIcon={() => (
              <UniversalIcon
                source={IconSource.FontAwesome6}
                name="chevron-down"
                size={20}
                color="black"
                style={{
                  transform: [{ rotate: isIntervalFocus ? "180deg" : "0deg" }],
                  marginRight: 5,
                }}
              />
            )}
          />
        </CustomModal>
        <Collapsible title="Goals" style={{ marginTop: 6 }}>
          {individualGoals.map((goal) => (
            <GoalContainer
              key={goal.goalId}
              activity={goal.activity}
              metric={goal.metric}
              progress={goal.progress[user.userId]}
              target={goal.target}
              days={findGoalEndDate(goal)}
            ></GoalContainer>
          ))}
        </Collapsible>
        <View style={[styles.row]}>
          <Text style={globalStyles.sectionHeader}>Groups</Text>
          <TouchableOpacity
            testID="add-group-button"
            onPress={() => setNewGroupModalVisibility(true)}
          >
            <UniversalIcon
              source={IconSource.FontAwesome6}
              name="plus"
              size={23}
              color="black"
              style={{ marginRight: 5 }}
            />
          </TouchableOpacity>
        </View>
        {groups.map((group) => (
          <TouchableOpacity
            testID="open-group"
            key={group.groupId}
            onPress={() =>
              router.push({
                pathname: "/group",
                params: { id: group.groupId },
              })
            }
          >
            <GroupContainer
              group={group}
              days={Math.ceil(getDaysLeftInInterval(group.interval))}
              groupProgress={groupProgress(group)}
              individualProgress={individualProgress(group)}
              style={{ marginBottom: 8 }}
            />
          </TouchableOpacity>
        ))}
      </CustomScrollView>
    </Suspense>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dropdown: {
    backgroundColor: "#EFEFF3",
    borderColor: "black",
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
});
