import { useCallback, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";

import { IconSource, UniversalIcon } from "@/components/ui/UniversalIcon";
import { Back } from "@/components/Back";
import { Container } from "@/components/Container";
import { ContainerWithBlueBox } from "@/components/ContainerWithBlueBox";
import { ProgressBarPercentage } from "@/components/ProgressBar/ProgressBarPercentage";
import { ProgressBarIcon } from "@/components/ProgressBar/ProgressBarIcon";
import { CollapsibleContainer } from "@/components/CollapsibleContainer";
import { NameProgress } from "@/components/NameProgress";
import globalStyles from "@/constants/styles";
import { CustomScrollView } from "@/components/CustomScrollView";
import type { Group as GroupType } from "@/lib/API/schemas/Group";
import { Interval } from "@/lib/API/schemas/Interval";
import { Goal } from "@/lib/API/schemas/Goal";
import { metricMetadata } from "@/lib/MetricMetadata";
import {
  sportActivityMetadata,
  otherActivityMetadata,
} from "@/lib/ActivityMetadata";
import { getDaysLeftInInterval } from "@/lib/IntervalDates";
import { useGroups } from "@/lib/states/groupsState";
import MembersSection from "@/components/group/members";

export default function Group() {
  const { id } = useLocalSearchParams();
  const groupId = id.toString();
  const router = useRouter();
  const { contextGroups } = useGroups();
  const [group, setGroup] = useState<GroupType | null>(null);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const getGroupData = async () => {
        const contextGroup = contextGroups.get(groupId);
        if (contextGroup != null) {
          setGroup(contextGroup);
        }
      };

      getGroupData();

      return () => {
        isActive = false;
      };
    }, [contextGroups, groupId]),
  );

  let groupGoalsProgress: Map<string, number> = new Map();
  let groupGoalsDone: boolean = false;
  let groupGoals: Goal[] = [];
  let userGoals: Map<string, Goal[]> = new Map();

  function loadGroup() {
    if (group) {
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
      Object.keys(group.users).forEach((userId) => {
        userGoals.set(
          userId,
          group.goals.filter((goal) => {
            return goal.type === "individual" && goal.progress[userId] >= 0;
          }),
        );
      });
    }
  }
  loadGroup();

  return (
    group && (
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
                testID="settings-button"
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
                group.interval !== Interval.Daily
                  ? Math.ceil(getDaysLeftInInterval(group.interval)).toString()
                  : "Today"
              }
            />
            <ContainerWithBlueBox text1="Streak" text2={group.streak + "🔥"} />
          </View>
          <View>
            {group.goals.length > 0 ? (
              <Container style={{ marginTop: 8 }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text style={globalStyles.title}>Progress</Text>
                  <Text style={globalStyles.bodyText}>
                    {Object.entries(group.users).reduce((count, [userId]) => {
                      if (!groupGoalsDone) return count;

                      const goals = userGoals.get(userId);
                      const allGoalsDone = goals?.every(
                        (goal) => goal.progress[userId] >= goal.target,
                      );

                      return count + (allGoalsDone ? 1 : 0);
                    }, 0)}
                    {" /"} {Object.keys(group.users).length}
                    {" members finished"}
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
                        group.goals.length) *
                      100
                    }
                  />
                </View>
              </Container>
            ) : null}
          </View>

          <View style={globalStyles.section}>
            <Text style={[globalStyles.sectionHeader, { marginTop: 6 }]}>
              Group Goals
            </Text>
            {groupGoals.map((goal) => (
              <CollapsibleContainer key={goal.goalId}>
                <View>
                  <View style={globalStyles.row}>
                    <View style={styles.box}>
                      <Text
                        style={[globalStyles.title, { marginRight: "auto" }]}
                      >
                        {goal.title}
                      </Text>
                    </View>
                    <View style={styles.box}>
                      <Text
                        style={[globalStyles.bodyText, { textAlign: "center" }]}
                      >
                        {Object.entries(goal.progress).reduce(
                          (sum, [key, val]) => sum + val,
                          0,
                        )}{" "}
                        / {goal.target} {metricMetadata[goal.metric].unit}
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
                      {
                        ...sportActivityMetadata,
                        ...otherActivityMetadata,
                      }[goal.activity].iconSource
                    }
                    icon={
                      {
                        ...sportActivityMetadata,
                        ...otherActivityMetadata,
                      }[goal.activity].icon
                    }
                  />
                </View>
                <View style={[globalStyles.row, { gap: 10, flexWrap: "wrap" }]}>
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
          <MembersSection
            group={group}
            userGoalsMap={userGoals}
          ></MembersSection>
        </CustomScrollView>
      </>
    )
  );
}

const styles = StyleSheet.create({
  box: {
    display: "flex",
    justifyContent: "center",
    flex: 1,
  },
});
