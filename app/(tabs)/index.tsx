import { HealthKitAdapter } from '@/lib/HealthAdapter/HealthKit';

import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { GoalContainer } from '@/components/GoalContainer';
import { GroupContainer } from '@/components/GroupContainer';
import { SportActivity } from '@/lib/API/schemas/Activity';
import { Metric } from '@/lib/API/schemas/Metric';

export default function HomeScreen() {
  const [groups, setGroups] = useState([
    {
      name: 'The Bongers',
      image: 'https://placehold.co/32x32',
      days: 2,
      groupProgress: 28,
      groupTarget: 100,
      individualProgress: 95,
      individualTarget: 100,
    },
    {
      name: 'The Gulops',
      image: 'https://placehold.co/32x32',
      days: 28,
      groupProgress: 4,
      groupTarget: 100,
      individualProgress: 7,
      individualTarget: 100,
    },
  ])
  
  const [healthAdapter, _] = useState(new HealthKitAdapter())
  const [isAvailable, setIsAvailable] = useState(false)
  const [permissionGranted, setPermissionGranted] = useState(false)
  
  useEffect(() => {
    const asyncFunc = async () => {
      setIsAvailable(await healthAdapter.isAvailable());
    }
    asyncFunc()
  }, [])

  useEffect(() => {
    if (!isAvailable) return;
    const asyncFunc = async () => {
      await healthAdapter.init()
      setPermissionGranted(healthAdapter.permissionGranted);
    }
    asyncFunc()
  }, [isAvailable])

  useEffect(() => {
    if (!permissionGranted) {
      return;
    };
    const asyncFunc = async () => {
      console.log("Getting data - permissionGranted = ", healthAdapter.permissionGranted);
      const data = await healthAdapter.getData({type: "sport", activity: SportActivity.Biking, metric: Metric.Distance, startDate: new Date(2024, 1, 1), endDate: new Date(2025, 4, 17)});
      console.log("Got data: ", data);
    }
    asyncFunc()
  }, [permissionGranted])

  function addGroup() {
    setGroups(prev => [...prev, {
      name: 'New Group',
      image: 'https://placehold.co/32x32',
      days: 2,
      groupProgress: Math.random() * 100,
      groupTarget: 100,
      individualProgress: Math.random() * 100,
      individualTarget: 100,
    }])
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
