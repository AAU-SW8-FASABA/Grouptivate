import {
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";
import { Stack } from "expo-router";
import { Dropdown } from "react-native-element-dropdown";

import { CustomModal } from "@/components/CustomModal";
import { Back } from "@/components/Back";
import { Collapsible } from "@/components/Collapsible";
import { SettingsMember } from "@/components/SettingsMember";
import { SettingsGoal } from "@/components/SettingsGoal";
import { IconSource, UniversalIcon } from "@/components/ui/UniversalIcon";
import { CollapsibleContainer } from "@/components/CollapsibleContainer";

export default function GroupSettings() {
  const [members, setMembers] = useState([
    "Anders",
    "Albert Hald",
    "Alfred",
    "Aske",
    "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
  ]);
  const [groupGoals, setGroupGoals] = useState([
    { activity: "Walk", target: 100000, unit: "steps" },
    { activity: "Run", target: 100, unit: "km" },
  ]);
  const [individualGoals, setIndividualGoals] = useState([
    { activity: "Walk", target: 200000, unit: "steps" },
    { activity: "Run", target: 200, unit: "km" },
  ]);
  const [newGoalModalVisibility, setNewGoalModalVisibility] = useState(false);
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
        unit: unitLookup[targetValue ?? "distance"],
      },
    ]);
  }
  const activities = [
    { label: "Badminton", value: "badminton" },
    { label: "Gaming", value: "gaming" },
    { label: "Yoga", value: "yoga" },
    { label: "Badminton", value: "badminton" },
    { label: "Gaming", value: "gaming" },
    { label: "Yoga", value: "yoga" },
    { label: "Badminton", value: "badminton" },
    { label: "Gaming", value: "gaming" },
    { label: "Yoga", value: "yoga" },
    { label: "Badminton", value: "badminton" },
    { label: "Gaming", value: "gaming" },
    { label: "Yoga", value: "yoga" },
  ];
  const [activityValue, setActivityValue] = useState(null);
  const [isActivityFocus, setIsActivityFocus] = useState(false);
  const targets = [
    { label: "Calories", value: "calories" },
    { label: "Count", value: "count" },
    { label: "Distance", value: "distance" },
    { label: "Duration", value: "duration" },
  ];
  const [targetValue, setTargetValue] = useState(null);
  const [isTargetFocus, setIsTargetFocus] = useState(false);
  const [amountValue, setAmountValue] = useState(0);

  return (
    <>
      <Stack.Screen
        options={{
          title: "Settings",
          headerLeft: () => <Back />,
        }}
      />
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <CustomModal
          height={500}
          title="New Goal"
          isVisible={newGoalModalVisibility}
          setIsVisible={setNewGoalModalVisibility}
          createCallback={createGoal}
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
            valueField="label"
            placeholder="Select"
            onFocus={() => setIsActivityFocus(true)}
            onBlur={() => setIsActivityFocus(false)}
            value={activityValue}
            onChange={(item) => {
              setActivityValue(item.label);
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
            Target
          </Text>
          <Dropdown
            style={[styles.dropdown, isTargetFocus && { borderColor: "blue" }]}
            placeholderStyle={[styles.text, { fontSize: 20 }]}
            selectedTextStyle={[styles.text, { fontSize: 20 }]}
            itemTextStyle={[styles.text, { fontSize: 20 }]}
            data={targets}
            labelField="label"
            valueField="value"
            placeholder="Select"
            onFocus={() => setIsTargetFocus(true)}
            onBlur={() => setIsTargetFocus(false)}
            value={targetValue}
            onChange={(item) => {
              setTargetValue(item.value);
              setIsTargetFocus(false);
            }}
            renderRightIcon={() => (
              <UniversalIcon
                source={IconSource.FontAwesome6}
                name="chevron-down"
                size={20}
                color="black"
                style={{
                  transform: [{ rotate: isTargetFocus ? "180deg" : "0deg" }],
                  marginRight: 5,
                }}
              />
            )}
          />
          <Text style={[styles.text, { fontSize: 20, marginTop: 10 }]}>
            Amount
          </Text>
          <TextInput
            style={[styles.input, { fontSize: 20 }]}
            onChangeText={(text) => setAmountValue(Number(text))}
          ></TextInput>
        </CustomModal>
        <Collapsible title="Members">
          {members.map((member, index) => (
            <SettingsMember key={index} name={member} />
          ))}
          <View
            style={[styles.row, { marginTop: 10, justifyContent: "center" }]}
          >
            <UniversalIcon
              source={IconSource.FontAwesome6}
              name="circle-plus"
              size={24}
            />
            <TouchableOpacity
              onPress={() => setMembers([...members, "New Member"])}
            >
              <Text style={[styles.text, styles.buttonText]}>
                Invite Member
              </Text>
            </TouchableOpacity>
          </View>
        </Collapsible>

        <Collapsible title="Group Goals" style={{ marginTop: 25 }}>
          {groupGoals.map((goal, index) => (
            <SettingsGoal key={index} {...goal} />
          ))}
          <View
            style={[styles.row, { marginTop: 10, justifyContent: "center" }]}
          >
            <UniversalIcon
              source={IconSource.FontAwesome6}
              name="circle-plus"
              size={24}
            />
            <TouchableOpacity onPress={() => setNewGoalModalVisibility(true)}>
              <Text style={[styles.text, styles.buttonText]}>Create goal</Text>
            </TouchableOpacity>
          </View>
        </Collapsible>

        <Collapsible title="Individual Goals" style={{ marginTop: 25 }}>
          {members.map((member, index) => (
            <CollapsibleContainer key={index}>
              <View
                style={[
                  styles.row,
                  { justifyContent: "space-between", marginRight: 50 },
                ]}
              >
                <Text
                  numberOfLines={1}
                  style={[styles.text, { fontSize: 24, flex: 1 }]}
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
                {individualGoals.map((goal, index) => (
                  <SettingsGoal key={index} {...goal} padding={0} />
                ))}
              </>
            </CollapsibleContainer>
          ))}
        </Collapsible>
      </ScrollView>
    </>
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
});
