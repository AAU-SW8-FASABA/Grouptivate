import { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";

import { IconSource, UniversalIcon } from "@/components/ui/UniversalIcon";
import { Back } from "@/components/Back";
import { Container } from "@/components/Container";
import { ContainerWithBlueBox } from "@/components/ContainerWithBlueBox";
import { ProgressBarPercentage } from "@/components/ProgressBar/ProgressBarPercentage";
import { ProgressBarIcon } from "@/components/ProgressBar/ProgressBarIcon";
import { ProgressBarTextIcon } from "@/components/ProgressBar/ProgressBarTextIcon";
import { CollapsibleContainer } from "@/components/CollapsibleContainer";
import { NameProgress } from "@/components/NameProgress";
import globalStyles from "@/constants/styles";
import { CustomScrollView } from "@/components/CusomScrollView";
import type { Group } from "@/lib/API/schemas/Group";
import { Interval } from "@/lib/API/schemas/Interval";
import { Goal } from "@/lib/API/schemas/Goal";
import { metricMetadata } from "@/lib/MetricMetadata";
import {
  sportActivityMetadata,
  otherActivityMetadata,
} from "@/lib/ActivityMetadata";
import { getAske } from "@/lib/aske";
import { useGroups } from "@/lib/states/groupsState";

export default function Group() {
  const { id } = useLocalSearchParams();
  const groupId = id.toString();
  const router = useRouter();
  const { contextGroups } = useGroups();

  const [group, setGroup] = useState<Group>(contextGroups.get(groupId)!);

  let groupGoalsProgress: Map<string, number> = new Map();
  let groupGoalsDone: boolean = false;
  let groupGoals: Goal[] = [];

  function loadgroup() {
    groupGoals = group.goals.filter((goal) => {
      return goal.type === "group";
    });
    groupGoals.forEach((goal) => {
      groupGoalsProgress.set(
        goal.goalId,
        Object.values(goal.progress).reduce((sum, add) => sum + add, 0),
      );
    });
    groupGoalsDone = groupGoals.every(
      (goal) => (groupGoalsProgress.get(goal.goalId) ?? 0) >= goal.target,
    );
  }

  loadgroup();
  console.log(group.goals)
  console.log(group.users)
  let userGoals: Map<string, Goal[]> = new Map();
  Object.keys(group.users).forEach((userId) => {
    console.log(userId)
    userGoals.set(
      userId,
      group.goals.filter((goal) => {
        return goal.type === "individual" && (goal.progress[userId] >= 0);
      }),
    );
  });
  console.log(userGoals)

  function daysUntilNextMonday(): number {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysUntilMonday = (8 - dayOfWeek) % 7 || 7;
    return daysUntilMonday;
  }
  function daysUntilNextMonth(): number {
    const today = new Date();
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    const diffDays = Math.ceil(
      (nextMonth.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );

    return diffDays;
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle:
            group.groupName && typeof group.groupName === "string"
              ? group.groupName
              : "Group Name",
          headerLeft: () => <Back />,
          headerRight: () => (
            <TouchableOpacity
              style={{ marginRight: 15 }}
              onPress={() =>
                router.push({
                  pathname: "/group/settings",
                  params: { id: groupId },
                })
              }
            >
              <UniversalIcon
                source={IconSource.FontAwesome6}
                name={"gear"}
                size={21}
                color="white"
              />
            </TouchableOpacity>
          ),
        }}
      />
      <CustomScrollView style={globalStyles.viewContainer}>
        <View style={{ flexDirection: "row", gap: 10, marginTop: 8 }}>
          <ContainerWithBlueBox
            text1="Days Left"
            text2={
              group.interval === Interval.Daily
                ? "1"
                : group.interval === Interval.Weekly
                  ? daysUntilNextMonday().toString()
                  : daysUntilNextMonth().toString()
            }
          />
          <ContainerWithBlueBox text1="Streak" text2={group.streak + "🔥"} />
        </View>

        <Container style={{ marginTop: 8 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={[styles.text, { fontSize: 24 }]}>Progress</Text>
            <Text style={[styles.text, { fontSize: 16 }]}>
              {Object.entries(group.users).reduce((count, [userId]) => {
                if (!groupGoalsDone) return count;

                const goals = userGoals.get(userId);
                const allGoalsDone = goals?.every(
                  (goal) => goal.progress[userId] >= goal.target,
                );

                return count + (allGoalsDone ? 1 : 0);
              }, 0)}
              / {Object.keys(group.users).length} members finished
            </Text>
          </View>
          <View style={{ marginTop: 10 }}>
            <ProgressBarPercentage
              progress={
                (group.goals.reduce(
                  (acc, goal) =>
                    acc +
                    Object.values(goal.progress).reduce(
                      (sum, add) => sum + add,
                      0,
                    ) /
                      goal.target,
                  0,
                ) /
                  group.goals!.length) *
                100
              }
            />
          </View>
        </Container>

        <View style={globalStyles.section}>
          <Text style={[globalStyles.sectionHeader, { marginTop: 6 }]}>
            Group Goals
          </Text>
          {groupGoals.map((goal) => (
            <CollapsibleContainer key={goal.goalId}>
              <View>
                <View style={styles.row}>
                  <View style={styles.box}>
                    <Text
                      style={[
                        styles.text,
                        { fontSize: 24, marginRight: "auto" },
                      ]}
                    >
                      {goal.title}
                    </Text>
                  </View>
                  <View style={styles.box}>
                    <Text
                      style={[
                        styles.text,
                        { fontSize: 16, textAlign: "center" },
                      ]}
                    >
                      {Object.entries(goal.progress).reduce(
                        (sum, [key, val]) => sum + val,
                        0,
                      )}{" "}
                      / {goal.target} {goal.metric}
                    </Text>
                  </View>
                  <View style={styles.box} />
                </View>
                <ProgressBarIcon
                  progress={
                    (Object.entries(goal.progress).reduce(
                      (sum, [key, val]) => sum + val,
                      0,
                    ) /
                      goal.target) *
                    100
                  }
                  iconSource={
                    { ...sportActivityMetadata, ...otherActivityMetadata }[
                      goal.activity
                    ].iconSource
                  }
                  icon={
                    { ...sportActivityMetadata, ...otherActivityMetadata }[
                      goal.activity
                    ].icon
                  }
                />
              </View>
              <View style={[styles.row, { gap: 10, flexWrap: "wrap" }]}>
                {Object.entries(goal.progress).map(([userId, progress]) => (
                  <NameProgress
                    key={userId}
                    name={group.users[userId]}
                    progress={progress}
                    target={goal.target}
                  />
                ))}
              </View>
            </CollapsibleContainer>
          ))}
        </View>

        <View style={globalStyles.section}>
          <Text style={globalStyles.sectionHeader}>Members</Text>
          {Object.entries(group.users).map(([userId, name]) => (
            <View key={userId}>
              <CollapsibleContainer>
                <View style={styles.row}>
                  <View style={styles.row}>
                    <Image
                      source={getAske({ userId, name })}
                      style={{ width: 32, height: 32, borderRadius: 100 }}
                    />
                    <Text
                      numberOfLines={1}
                      style={[styles.text, { fontSize: 22, marginLeft: 10 }]}
                    >
                      {name}
                    </Text>
                  </View>
                  <View style={{ width: "40%", marginRight: 30 }}>
                    <ProgressBarPercentage
                      progress={
                        ((userGoals.get(userId)!).reduce(
                          (acc, a) => acc + a.progress[userId] / a.target,
                          0,
                        ) /
                          (userGoals.get(userId)!).length) *
                        100
                      }
                      target={100}
                    />
                  </View>
                </View>
                <View>
                  {userGoals.get(userId)?.map((activity) => (
                    <ProgressBarTextIcon
                      key={activity.goalId}
                      progress={activity.progress[userId]}
                      target={activity.target}
                      unit={metricMetadata[activity.metric].unit}
                      iconSource={
                        {
                          ...sportActivityMetadata,
                          ...otherActivityMetadata,
                        }[activity.activity].iconSource
                      }
                      icon={
                        {
                          ...sportActivityMetadata,
                          ...otherActivityMetadata,
                        }[activity.activity].icon
                      }
                    />
                  ))}
                </View>
              </CollapsibleContainer>
            </View>
          ))}
        </View>
      </CustomScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  text: {
    fontFamily: "Roboto",
    fontWeight: 500,
  },
  box: {
    display: "flex",
    justifyContent: "center",
    flex: 1,
  },
});
