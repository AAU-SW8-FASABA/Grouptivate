import { useEffect, useState, Suspense } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { Dropdown } from "react-native-element-dropdown";
import { useUser } from "@/lib/states/userState";

import { CustomModal, modalMode } from "@/components/CustomModal";
import { Collapsible } from "@/components/Collapsible";
import { IconSource, UniversalIcon } from "@/components/ui/UniversalIcon";
import { GoalContainer } from "@/components/GoalContainer";
import { GroupContainer } from "@/components/GroupContainer";
import globalStyles from "@/constants/styles";
import { CustomScrollView } from "@/components/CusomScrollView";
import { create as postCreateGroup } from "@/lib/server/group";
import { get as getGroups } from "@/lib/server/groups";
import { Interval } from "@/lib/API/schemas/Interval";
import type { Group } from "@/lib/API/schemas/Group";
import type { Goal } from "@/lib/API/schemas/Goal";
import { GoalType } from "@/lib/API/schemas/Goal";
import { prettyName } from "@/lib/PrettyName";

export default function Main() {
  const { user } = useUser();
  console.log("WHAT USER IS HERE?????", user);
  const router = useRouter();
  const [newGroupModalVisibility, setNewGroupModalVisibility] = useState(false);
  const [newGroupName, setGroupName] = useState("");
  const [intervalValue, setIntervalValue] = useState(Interval.Weekly);
  const [isIntervalFocus, setIsIntervalFocus] = useState(false);
  const [groups, setGroups] = useState<Group[]>([]);
  const [individualGoals, setIndividualGoals] = useState<Goal[]>([]);

  useEffect(() => {
    const fetchGroup = async () => {
      const fetchedGroups = await getGroups();
      setGroups(fetchedGroups);
    };
    fetchGroup();
    setIndividualGoals(splitGoalTypes(GoalType.Individual));
  }, [user]);

  function splitGoalTypes(goalTypeFilter:string): Goal[]{
    const filteredGoals: Goal[] = user.goals.filter((goal) => {
        return goal.type == goalTypeFilter
      });
    return filteredGoals
  }

  const intervals = Object.values(Interval).map((value) => ({
    label: prettyName(value),
    value,
  }));

  function createGroup() {
    postCreateGroup(user, newGroupName, intervalValue);

    const newGroup = {
      groupId: "",
      groupName: newGroupName,
      users: { [user.userId]: user.name },
      interval: intervalValue,
      goals: [],
      streak: 0,
    };
    setGroups((prev) => [...prev, newGroup]);
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
          <Text style={[styles.text, { fontSize: 20 }]}>Group Name</Text>
          <TextInput
            style={globalStyles.inputField}
            onChangeText={setGroupName}
            value={newGroupName}
          ></TextInput>
          <Text style={[styles.text, { fontSize: 20, marginTop: 10 }]}>
            Interval
          </Text>
          <Dropdown
            style={[
              styles.dropdown,
              isIntervalFocus && { borderColor: "blue" },
            ]}
            placeholderStyle={[styles.text, { fontSize: 20 }]}
            selectedTextStyle={[styles.text, { fontSize: 20 }]}
            itemTextStyle={[styles.text, { fontSize: 20 }]}
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
              activity={goal.activity}
              metric={goal.metric}
              progress={goal.progress[user.userId]}
              target={goal.target}
              days={2}
            ></GoalContainer>
          ))}
        </Collapsible>
        <View style={[styles.row]}>
          <Text style={globalStyles.sectionHeader}>Groups</Text>
          <TouchableOpacity onPress={() => setNewGroupModalVisibility(true)}>
            <UniversalIcon
              source={IconSource.FontAwesome6}
              name="plus"
              size={23}
              color="black"
              style={{ marginRight: 5 }}
            />
          </TouchableOpacity>
        </View>
        {groups.map((group, index) => (
          <TouchableOpacity
            key={index}
            onPress={() =>
              router.push({
                pathname: "/group",
                params: { name: group.groupName },
              })
            }
          >
            <GroupContainer
              group={group}
              days={2}
              groupProgress={
                (group.goals.reduce(
                  (acc, goal) =>
                    acc +
                    (Object.values(goal.progress).reduce((sum, add) => sum + add, 0)) / goal.target,
                  0,
                ) /
                  group.goals!.length) *
                100
              }
              individualProgress={
                (user.goals.reduce(
                  (acc, goal) =>
                    acc +
                    (goal.progress[user.userId]) / (goal.target / goal.progress.length),
                  0,
                ) /
                  individualGoals.length) *
                100
              }
              style={{ marginBottom: 8 }}
            />
          </TouchableOpacity>
        ))}
      </CustomScrollView>
    </Suspense>
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
