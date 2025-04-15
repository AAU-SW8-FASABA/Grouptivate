import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";
import { Stack } from "expo-router";

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
            <TouchableOpacity
              onPress={() =>
                setGroupGoals([
                  ...groupGoals,
                  { activity: "Run", target: 10, unit: "km" },
                ])
              }
            >
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
});
