import { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import { Collapsible } from "@/components/Collapsible";
import { IconSource, UniversalIcon } from "@/components/ui/UniversalIcon";
import { GoalContainer } from "@/components/GoalContainer";
import { GroupContainer } from "@/components/GroupContainer";

export default function HomeScreen() {
  const [groups, setGroups] = useState([
    {
      name: "The Bongers",
      image: "https://placehold.co/32x32",
      days: 2,
      groupProgress: 28,
      groupTarget: 100,
      individualProgress: 95,
      individualTarget: 100,
    },
    {
      name: "The Gulops",
      image: "https://placehold.co/32x32",
      days: 28,
      groupProgress: 4,
      groupTarget: 100,
      individualProgress: 7,
      individualTarget: 100,
    },
  ]);

  function addGroup() {
    setGroups((prev) => [
      ...prev,
      {
        name: "New Group",
        image: "https://placehold.co/32x32",
        days: 2,
        groupProgress: Math.random() * 100,
        groupTarget: 100,
        individualProgress: Math.random() * 100,
        individualTarget: 100,
      },
    ]);
  }

  return (
    <ScrollView style={styles.container}>
      <Collapsible title="Goals">
        <GoalContainer
          activity="Swim"
          unit="kcal"
          progress={960}
          target={800}
          days={2}
          iconSource={IconSource.MaterialCommunityIcons}
          icon="swim"
          iconSize={26}
        />
        <GoalContainer
          activity="Bike"
          unit="km"
          progress={3.8}
          target={10}
          days={2}
          iconSource={IconSource.MaterialCommunityIcons}
          icon="bike"
          iconSize={26}
        />
      </Collapsible>
      <View style={[styles.row, { marginTop: 25 }]}>
        <Text style={[styles.text, { fontSize: 28 }]}>Groups</Text>
        <TouchableOpacity onPress={addGroup} activeOpacity={0.8}>
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
        <GroupContainer
          name={group.name}
          image={group.image}
          days={group.days}
          groupProgress={group.groupProgress}
          groupTarget={group.groupTarget}
          individualProgress={group.individualProgress}
          individualTarget={group.individualTarget}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    height: "100%",
    padding: 20,
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
});
