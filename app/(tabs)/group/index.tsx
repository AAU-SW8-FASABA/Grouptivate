import { useContext, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
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
import { Uuid, UuidSchema } from "@/lib/API/schemas/Uuid";
import { Interval } from "@/lib/API/schemas/Interval";
import { Goal, GoalType } from "@/lib/API/schemas/Goal";
import { OtherActivity, SportActivity } from "@/lib/API/schemas/Activity";
import { Metric } from "@/lib/API/schemas/Metric";
import { UserContext } from "@/states/userState";

export default function Group() {
  const { name } = useLocalSearchParams();
  const router = useRouter();
  const user = useContext(UserContext)

  const members : Record<string,string> =
    {
      "anders uuid": "Anders",

      "hald uuid": "Albert Hald",

      "hal uuid": "Albert Hal",
      // name: "Albert Hal",
  }
  const testGroup : Group = {
    groupId: "",
    groupName: name.toString(),
    users: members,
    interval: Interval.Weekly,
    goals: [{
      goalId: "", //group goal
      title: "This is a title",
      type: GoalType.Group,
      activity: SportActivity.Badminton,
      metric: Metric.Distance,
      target: 200,
      progress: {
        "anders uuid": 20,
        "hald uuid": 100 ,
        "hal uuid": 100
      }
      
    },
    {
      goalId: "",
      title: "Anders goal",
      type: GoalType.Individual,
      activity: SportActivity.Badminton,
      metric: Metric.Distance,
      target: 200,
      progress: {
        "anders uuid": 200
      }
    },
    {
      goalId: "",
      title: "Albert hald goal",
      type: GoalType.Individual,
      activity: SportActivity.Badminton,
      metric: Metric.Distance,
      target: 200,
      progress: {
        "hald uuid": 20,
      }
    },
    {
      goalId: "",
      title: "Albert hal",
      type: GoalType.Individual,
      activity: SportActivity.Baseball,
      metric: Metric.Distance,
      target: 200,
      progress: {
        "hal uuid": 20,
      }
    },
    ],
    streak: 2,
  }
  console.log(user)
  const [group, setGroup] = useState(testGroup)
 
  // user.groups.find((group) => group.groupName = name) //TODO: implement when user user groups :) 
  const groupGoal = group.goals.filter(goal => {
    return goal.type == "group"
  })[0] //TODO: fix that there might be more than one!
  let userGoals: Map<string, Goal[]> = new Map()
  Object.keys(group.users).forEach( (user) => {
    userGoals.set(user, group.goals.filter((goal) => {return goal.type == "individual" && goal.progress[user]}))
  })

  const groupGoalContributed = Object.entries(groupGoal.progress).reduce((sum, [key, val]) => sum + val, 0)
  const groupGoalProgress = (groupGoalContributed / groupGoal.target ) * 100

  function daysUntilNextMonday(): number {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysUntilMonday = (8 - dayOfWeek) % 7 || 7;
    return daysUntilMonday;
  }
  function daysUntilNextMonth(): number {
    const today = new Date();
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    const diffDays = Math.ceil((nextMonth.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    return diffDays;
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: group.groupName && typeof group.groupName === "string" ? group.groupName : "Group Name",
          headerLeft: () => <Back />,
          headerRight: () => (
            <TouchableOpacity
              style={{ marginRight: 15 }}
              onPress={() => router.push({
                pathname: "/group/settings",
                params: { name: group.groupName },
              })}
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
          <ContainerWithBlueBox text1="Days Left" text2= {
            group.interval == Interval.Daily ? "1" : group.interval == Interval.Weekly ? daysUntilNextMonday().toString() : daysUntilNextMonth().toString()
          } /> 
          <ContainerWithBlueBox text1="Streak" text2= {group.streak + "🔥"} />
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
              {
              Object.entries(group.users).reduce(
                (finished, [userId, userName]) => finished + (userGoals.get(userId)?.reduce(
                  (allFinished, goal) => allFinished && (goal.progress[userId] >= goal.target), 
                true) ? 1 : 0), 
                0)
              }/ {Object.keys(group.users).length} members finished 
            </Text>
          </View>
          <View style={{ marginTop: 10 }}>
            <ProgressBarPercentage progress={
              group.goals.reduce(
                (acc, goal) => acc + ((Object.values(goal.progress)).reduce((sum, current) => sum + current, 0)) / goal.target,
                0,
              ) /
                group.goals!.length *
              100
            } />
          </View>
        </Container>

        <View style={globalStyles.section}>
          <Text style={[globalStyles.sectionHeader, { marginTop: 6 }]}>
            Group Goals
          </Text>
          <CollapsibleContainer>
            <View>
              <View style={styles.row}>
                <View style={styles.box}>
                  <Text
                    style={[styles.text, { fontSize: 24, marginRight: "auto" }]}
                  >
                    {groupGoal.title}
                  </Text>
                </View>
                <View style={styles.box}>
                  <Text
                    style={[styles.text, { fontSize: 16, textAlign: "center" }]}
                  >
                    {groupGoalContributed} / {groupGoal.target} {groupGoal.metric}
                  </Text>
                </View>
                <View style={styles.box} />
              </View>
              <ProgressBarIcon
                progress={groupGoalProgress}
                iconSource={IconSource.FontAwesome6}
                icon= {groupGoal.activity} 
              />
            </View>
            <View style={[styles.row, { gap: 10, flexWrap: "wrap" }]}>
              {Object.entries(groupGoal.progress).map(([userId, progress]) => (
                <NameProgress name={group.users[userId]} progress={progress} />
              ))}
            </View>
          </CollapsibleContainer>
        </View>

        <View style={globalStyles.section}>
          <Text style={globalStyles.sectionHeader}>Members</Text>
          {Object.entries(group.users).map(([userId, name]) => (
            <View key={name}>
              <CollapsibleContainer>
                <View style={styles.row}>
                  <Text
                    numberOfLines={1}
                    style={[styles.text, { fontSize: 22 }]}
                  >
                    {name}
                  </Text>
                  <View style={{ width: "40%", marginRight: 30 }}>
                    <ProgressBarPercentage
                      progress={
                        (userGoals.get(userId) ?? []).reduce(
                          (acc, a) => acc + a.progress[userId] / a.target,
                          0,
                        ) /
                        (userGoals.get(userId) ?? []).length *
                        100
                      }
                      target={100}
                    />
                  </View>
                </View>
                <View>
                  {userGoals.get(userId)?.map((
                  activity, index) => (
                    <ProgressBarTextIcon
                      key={index}
                      progress={activity.progress[userId]}
                      target={activity.target}
                      unit={activity.metric}
                      iconSource={IconSource.FontAwesome6}
                      icon={activity.activity}
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
