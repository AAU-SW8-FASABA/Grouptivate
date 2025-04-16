import { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Dropdown } from "react-native-element-dropdown";

import { CustomModal } from "@/components/CustomModal";
import { Collapsible } from "@/components/Collapsible";
import { IconSource, UniversalIcon } from "@/components/ui/UniversalIcon";
import { GoalContainer } from "@/components/GoalContainer";
import { GroupContainer } from "@/components/GroupContainer";

export default function Main() {
  const router = useRouter();
  const [newGroupModalVisibility, setNewGroupModalVisibility] = useState(false);

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

  function addGroup() {
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
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 20 }}
    >
      <CustomModal
        height={410}
        title="New Group"
        isVisible={newGroupModalVisibility}
        setIsVisible={setNewGroupModalVisibility}
        createCallback={addGroup}
      >
        <Text style={[styles.text, { fontSize: 20 }]}>Group Name</Text>
        <TextInput style={[styles.input, { fontSize: 20 }]}></TextInput>
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
      <Collapsible title="Goals">
        <GoalContainer
          activity="Swim"
          unit="kcal"
          progress={960}
          target={800}
          days={2}
          iconSource={IconSource.FontAwesome6}
          icon="person-swimming"
          iconSize={20}
        />
        <GoalContainer
          activity="Bike"
          unit="km"
          progress={3.8}
          target={10}
          days={2}
          iconSource={IconSource.FontAwesome6}
          icon="person-biking"
          iconSize={20}
        />
      </Collapsible>
      <View style={[styles.row, { marginTop: 25 }]}>
        <Text style={[styles.text, { fontSize: 28 }]}>Groups</Text>
        <TouchableOpacity onPress={() => setNewGroupModalVisibility(true)}>
          <UniversalIcon
            source={IconSource.FontAwesome6}
            name="plus"
            size={23}
            color="black"
            style={{ marginTop: 11, marginRight: 5, marginBottom: 6 }}
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
          />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 20,
    paddingTop: 10,
  },
  text: {
    fontFamily: "Roboto",
    fontWeight: 500,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  input: {
    backgroundColor: "#EFEFF3",
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
