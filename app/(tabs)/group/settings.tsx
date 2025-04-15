import { StyleSheet, Text, View, ScrollView } from "react-native";
import { Stack } from "expo-router";

import { Back } from "@/components/Back";
import { Collapsible } from "@/components/Collapsible";
import { SettingsMember } from "@/components/SettingsMember";
import { SettingsGroupGoal } from "@/components/SettingsGroupGoal";
import { IconSource, UniversalIcon } from "@/components/ui/UniversalIcon";
import { CollapsibleContainer } from "@/components/CollapsibleContainer";

export default function GroupSettings() {
  const members = [
    "Anders",
    "Albert Hald",
    "Alfred",
    "Aske",
    "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
  ];
  const groupGoals = [{ name: "Walk", target: 100000, unit: "steps" }];

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
            <Text style={[styles.text, styles.buttonText]}>Invite Member</Text>
          </View>
        </Collapsible>

        <Collapsible title="Group Goals" style={{ marginTop: 25 }}>
          {groupGoals.map((goal, index) => (
            <SettingsGroupGoal key={index} {...goal} />
          ))}
          <View
            style={[styles.row, { marginTop: 10, justifyContent: "center" }]}
          >
            <UniversalIcon
              source={IconSource.FontAwesome6}
              name="circle-plus"
              size={24}
            />
            <Text style={[styles.text, styles.buttonText]}>Create goal</Text>
          </View>
        </Collapsible>

        <View style={{ marginTop: 25 }}>
          <Text style={[styles.text, { fontSize: 28 }]}>Group Goals</Text>
          <CollapsibleContainer>
            <View
              style={[
                styles.row,
                { justifyContent: "space-between", marginRight: 50 },
              ]}
            >
              <Text style={[styles.text, { fontSize: 24 }]}>Anders</Text>
              <UniversalIcon
                source={IconSource.FontAwesome6}
                name="plus"
                size={24}
              />
            </View>
            <Text>Hello 2</Text>
          </CollapsibleContainer>
        </View>
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
    textOverflow: "ellipsis",
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
