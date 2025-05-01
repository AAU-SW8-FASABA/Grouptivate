import { createContext, useContext, useState, ReactNode } from "react";
import { Group } from "../API/schemas/Group";
import { Interval } from "../API/schemas/Interval";
import { SportActivity } from "../API/schemas/Activity";
import { GoalType } from "../API/schemas/Goal";
import { Metric } from "../API/schemas/Metric";

// Define the initial user state
export const initialGroup: Map<string, Group> = new Map()


const members: Record<string, string> = {
    "anders uuid": "Anders",

    "hald uuid": "Albert Hald",

    "hal uuid": "Albert Hal",
    // name: "Albert Hal",
  };
  const testGroup: Group = {
    groupId: "",
    groupName: "BOIIIIIIIIIIIIIIIIIIIIIIIII",
    users: members,
    interval: Interval.Weekly,
    goals: [
      {
        goalId: "", //group goal
        title: "This is a title",
        type: GoalType.Group,
        activity: SportActivity.Badminton,
        metric: Metric.Distance,
        target: 200,
        progress: {
          "anders uuid": 20,
          "hald uuid": 100,
          "hal uuid": 100,
        },
      },
      {
        goalId: "2", //group goal
        title: "This is a title2.0",
        type: GoalType.Group,
        activity: SportActivity.Badminton,
        metric: Metric.Distance,
        target: 200,
        progress: {
          "anders uuid": 30,
          "hald uuid": 50,
          "hal uuid": 700,
        },
      },
      {
        goalId: "",
        title: "Anders goal",
        type: GoalType.Individual,
        activity: SportActivity.Badminton,
        metric: Metric.Distance,
        target: 200,
        progress: {
          "anders uuid": 200,
        },
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
        },
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
        },
      },
    ],
    streak: 2,
  };

  
initialGroup.set(testGroup.groupId, testGroup)

type groupsContextType = {
    contextGroups: Map<string, Group>;
  setGroups: (groups: Map<string,Group>) => void;
};

export const GroupsContext = createContext<groupsContextType>({
    contextGroups: initialGroup,
  setGroups: () => {},
});

export const GroupsProvide = ({children}: { children: ReactNode}) => {
    const [contextGroups, setGroups] = useState<Map<string, Group>>(initialGroup)
    return (
        <GroupsContext.Provider value={{ contextGroups, setGroups }}>
        {children}
        </GroupsContext.Provider>
    )
}   


export const useGroups = () => useContext(GroupsContext);