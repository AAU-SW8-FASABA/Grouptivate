import { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";

import { Collapsible } from "@/components/Collapsible";
import { IconSource, UniversalIcon } from "@/components/ui/UniversalIcon";
import { GoalContainer } from "@/components/GoalContainer";
import { GroupContainer } from "@/components/GroupContainer";
import { SportActivity } from "@/lib/API/schemas/Activity";
import { Metric } from "@/lib/API/schemas/Metric";

export default function Main() {
  const router = useRouter();

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
      <Collapsible title="Goals">
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
});
