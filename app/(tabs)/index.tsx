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
import { SportActivity } from "@/lib/API/schemas/Activity";
import { Metric } from "@/lib/API/schemas/Metric";
import { get as getGroups } from "@/lib/server/group";
import type { Group as GroupType} from "@/lib/API/schemas/Group"

export default function Main() {
  const router = useRouter();
  const [newGroupModalVisibility, setNewGroupModalVisibility] = useState(false);

  useEffect(() => {
    // Missing userId from earlier api calls.
    //const fetchedGroups = getGroups(userId)
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
        <GoalContainer
          activity={SportActivity.Swimming}
          metric={Metric.Calories}
          progress={960}
          target={800}
          days={2}
        />
        <GoalContainer
          activity={SportActivity.Biking}
          metric={Metric.Distance}
          progress={3.8}
          target={10}
          days={2}
        />
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
