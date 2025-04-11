import { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

import { Collapsible } from '@/components/Collapsible';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { GoalContainer } from '@/components/GoalContainer';
import { GroupContainer } from '@/components/GroupContainer';

export default function Main() {
  const router = useRouter();

  const [groups, setGroups] = useState([
    {
      key: Math.random().toString(),
      name: 'The Bongers',
      image: 'https://placehold.co/32x32',
      days: 2,
      groupProgress: 28,
      groupTarget: 100,
      individualProgress: 95,
      individualTarget: 100,
    },
    {
      key: Math.random().toString(),
      name: 'The Gulops',
      image: 'https://placehold.co/32x32',
      days: 28,
      groupProgress: 4,
      groupTarget: 100,
      individualProgress: 7,
      individualTarget: 100,
    },
  ]);

  function addGroup() {
    setGroups(prev => [...prev, {
      key: Math.random().toString(),
      name: 'New Group',
      image: 'https://placehold.co/32x32',
      days: 2,
      groupProgress: Math.random() * 100,
      groupTarget: 100,
      individualProgress: Math.random() * 100,
      individualTarget: 100,
    }]);
  }

  return (
    <ScrollView style={styles.container}>
      <Collapsible title="Goals">
        <GoalContainer activity="Swim" unit="kcal" progress={960} target={800} days={2} icon="ant.fill"/>
        <GoalContainer activity="Bike" unit="km" progress={3.8} target={10} days={2} icon="ant"/>
      </Collapsible>
      <View style={[styles.row, {marginTop: 25}]}>
        <Text style={[styles.text, {fontSize: 28}]}>Groups</Text>
        <TouchableOpacity onPress={addGroup} activeOpacity={0.8}>
          <IconSymbol name="plus" size={32} color="black" style={{ marginTop: 5 }} />
        </TouchableOpacity>
      </View>
      {groups.map((group) => (
        <TouchableOpacity key={group.key} onPress={() => router.push({
          pathname: "/group",
          params: { name: group.name },
        })}>
          <GroupContainer
            name={group.name}
            image={group.image}
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
