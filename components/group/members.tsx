import { Text, View } from "react-native";
import { ProgressBarTextIcon } from "@/components/ProgressBar/ProgressBarTextIcon";
import { CollapsibleContainer } from "@/components/CollapsibleContainer";
import globalStyles from "@/constants/styles";
import type { Group } from "@/lib/API/schemas/Group";
import { Goal } from "@/lib/API/schemas/Goal";
import { metricMetadata } from "@/lib/MetricMetadata";
import {
  sportActivityMetadata,
  otherActivityMetadata,
} from "@/lib/ActivityMetadata";
import MemberComponentTop from "./members/memberTop";

interface Props {
  group: Group;
  userGoalsMap: Map<string, Goal[]>;
}

export default function MembersSection({ group, userGoalsMap }: Props) {
  function createGoalsObject(group: Group) {
    return Object.entries(group.users).map((user) => {
      const [id, name] = user;

      const goals = userGoalsMap.get(id);
      const progress =
        goals?.length && goals.length > 0
          ? (goals.reduce((acc, a) => acc + a.progress[id] / a.target, 0) /
              goals.length) *
            100
          : 0;

      return { id, name, progress, goals };
    });
  }

  return (
    <View style={globalStyles.section}>
      <Text style={globalStyles.sectionHeader}>Members</Text>
      {group &&
        createGoalsObject(group).map((user) => (
          <View key={user.id}>
            <CollapsibleContainer>
              <MemberComponentTop user={user} />
              <View>
                {user.goals && user.goals.length > 0 ? (
                  user.goals.map((goal) => (
                    <ProgressBarTextIcon
                      key={goal.goalId}
                      progress={goal.progress[user.id]}
                      target={goal.target}
                      unit={metricMetadata[goal.metric].unit}
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
                  ))
                ) : (
                  <Text style={{ fontSize: 14, textAlign: "center" }}>
                    This user does not have any goals
                  </Text>
                )}
              </View>
            </CollapsibleContainer>
          </View>
        ))}
    </View>
  );
}
