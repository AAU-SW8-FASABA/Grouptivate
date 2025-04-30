import { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { Dropdown } from "react-native-element-dropdown";

import { CustomModal, modalMode } from "@/components/CustomModal";
import { Collapsible } from "@/components/Collapsible";
import { IconSource, UniversalIcon } from "@/components/ui/UniversalIcon";
import { GoalContainer } from "@/components/GoalContainer";
import { GroupContainer } from "@/components/GroupContainer";
import globalStyles from "@/constants/styles";
import { CustomScrollView } from "@/components/CusomScrollView";
import { OtherActivity, SportActivity } from "@/lib/API/schemas/Activity";
import { Metric } from "@/lib/API/schemas/Metric";
import { get as getGroups } from "@/lib/server/group";
import { GoalType } from "@/lib/API/schemas/Goal";
import { Interval } from "@/lib/API/schemas/Interval";

import type { Group } from "@/lib/API/schemas/Group"
import type { Goal } from "@/lib/API/schemas/Goal"
import { string } from "valibot";

export default function Main() {
  const router = useRouter();
  const [newGroupModalVisibility, setNewGroupModalVisibility] = useState(false);

  function fetchGoals(): Goal[] {
    // Example function undtil api is done
    const goalArray: Goal[] = []
    const goalExample: Goal = { goalId:"4", type: GoalType.Individual, title: "Gamer Goal", activity: SportActivity.Badminton, metric: Metric.Duration, target: 90, progress: {"1":15} }
    const goalExample1: Goal = { goalId:"5", type: GoalType.Group, title: "Gamer Goals", activity: SportActivity.Boxing, metric: Metric.Calories, target: 10000, progress: {"1":4000, "2":1000} }
    

    return goalArray; 
  }

  function fetchGroup(): Group[] {
    const groupArray: Group[] = []
    const goalArray: Goal[] = fetchGoals()
    const groupExample: Group = {groupId: "", groupName: "Bing", users: {"1":"bonk","2":"bank"}, interval: Interval.Weekly, goals: goalArray, streak: 5 }
    groupArray.push(groupExample)
    return groupArray;
  }
  useEffect(() => {
    // Missing userId from earlier api calls.
    //const fetchedGroups = getGroups(userId)
    const fetchedGroups: Group[] = fetchGroup()

  })

  const [groups, setGroups] = useState([
    {
      key: Math.random().toString(),
      name: "The Bongers",
      days: 2,
      groupProgress: 28,
      groupTarget: 100,
      individualProgress: 95,
      individualTarget: 100,
    },
    {
      key: Math.random().toString(),
      name: "The Gulops",
      days: 28,
      groupProgress: 4,
      groupTarget: 100,
      individualProgress: 7,
      individualTarget: 100,
    },
  ]);

  const [goals, setGoals] = useState([
    {
      goalId: "g",
      type: GoalType.Individual,
      title: "gaming",
      activity: SportActivity.Gymnastics,
      metric: Metric.Calories,
      target: 5000,
      progress: {user: "guddi", amount: 3000},
    },
    {
      goalId: "g",
      type: GoalType.Individual,
      title: "gaming",
      activity: SportActivity.Stretching,
      metric: Metric.Duration,
      target: 90,
      progress: {user: "guddi", amount: 60},
    },
  ]);

  const intervals = [
    { label: "Daily", value: "daily" },
    { label: "Weekly", value: "weekly" },
    { label: "Monthly", value: "monthly" },
  ];
  const [intervalValue, setIntervalValue] = useState(null);
  const [isIntervalFocus, setIsIntervalFocus] = useState(false);

  function createGroup() {
    setGroups((prev) => [
      ...prev,
      {
        key: Math.random().toString(),
        name: "New Group",
        days: 2,
        groupProgress: Math.random() * 100,
        groupTarget: 100,
        individualProgress: Math.random() * 100,
        individualTarget: 100,
      },
    ]);
  }

  return (
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
        <TextInput style={globalStyles.inputField}></TextInput>
        <Text style={[styles.text, { fontSize: 20, marginTop: 10 }]}>
          Interval
        </Text>
        <Dropdown
          style={[styles.dropdown, isIntervalFocus && { borderColor: "blue" }]}
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
        {goals.map((goal) => (
          <GoalContainer
            activity={goal.activity}
            metric={goal.metric}
            progress={goal.progress.amount}
            target={goal.target}
            days={2}
          >
          </GoalContainer>
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
      {groups.map((group) => (
        <TouchableOpacity
          key={group.key}
          onPress={() =>
            router.push({
              pathname: "/group",
              params: { name: group.name },
            })
          }
        >
          <GroupContainer
            name={group.name}
            days={group.days}
            groupProgress={group.groupProgress}
            groupTarget={group.groupTarget}
            individualProgress={group.individualProgress}
            individualTarget={group.individualTarget}
            style={{ marginBottom: 8 }}
          />
        </TouchableOpacity>
      ))}
    </CustomScrollView>
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
