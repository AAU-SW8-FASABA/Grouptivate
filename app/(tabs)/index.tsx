import { useEffect, useState, Suspense } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { Dropdown } from "react-native-element-dropdown";
import { useUser } from "@/lib/states/userState";

import { CustomModal, modalMode } from "@/components/CustomModal";
import { Collapsible } from "@/components/Collapsible";
import { IconSource, UniversalIcon } from "@/components/ui/UniversalIcon";
import { GoalContainer } from "@/components/GoalContainer";
import { GroupContainer } from "@/components/GroupContainer";
import globalStyles from "@/constants/styles";
import { CustomScrollView } from "@/components/CusomScrollView";
import { get as getGroup, create as postCreateGroup } from "@/lib/server/group";
import { Interval } from "@/lib/API/schemas/Interval";

import type { Group } from "@/lib/API/schemas/Group";
import type { Goal } from "@/lib/API/schemas/Goal";
import { prettyName } from "@/lib/PrettyName";
import { GroupsContext, useGroups } from "@/lib/states/groupsState";

export default function Main() {
  const { user } = useUser();
  const { contextGroups } = useGroups();
  const router = useRouter();
  const [newGroupModalVisibility, setNewGroupModalVisibility] = useState(false);
  const [newGroupName, setGroupName] = useState("");
  const [intervalValue, setIntervalValue] = useState(Interval.Weekly);
  const [isIntervalFocus, setIsIntervalFocus] = useState(false);
  const [groups, setGroups] = useState<Group[]>([]);
  const [goals] = useState<Goal[]>([]);

  useEffect(() => {
    const fetchGroup = async () => {
      const fetchedGroups: Group[] = [];
      for (const groupId of user.groups) {
        const group = await getGroup(groupId);

        contextGroups.set(groupId, group);
        fetchedGroups.push(group);
      }
      setGroups(fetchedGroups);
    };
    fetchGroup();
  }, [user, contextGroups]);

  const intervals = Object.values(Interval).map((value) => ({
    label: prettyName(value),
    value,
  }));

  async function createGroup() {
    const responseGroup = await postCreateGroup(
      user,
      newGroupName,
      intervalValue,
    );
    contextGroups.set(responseGroup.groupId, responseGroup);
    setGroups((prev) => [...prev, responseGroup]);
  }
  //function calculateIndividualProgress(): number {
  //
  //}

  return (
    <Suspense>
      <CustomScrollView style={globalStyles.viewContainer}>
        <CustomModal
          height={410}
          title="New Group"
          isVisible={newGroupModalVisibility}
          mode={modalMode.Create}
          setIsVisible={setNewGroupModalVisibility}
          callback={createGroup}
        >
          <Text style={[styles.text, { fontSize: 20 }]}>Group Name</Text>
          <TextInput
            style={globalStyles.inputField}
            onChangeText={setGroupName}
            value={newGroupName}
          ></TextInput>
          <Text style={[styles.text, { fontSize: 20, marginTop: 10 }]}>
            Interval
          </Text>
          <Dropdown
            style={[
              styles.dropdown,
              isIntervalFocus && { borderColor: "blue" },
            ]}
            placeholderStyle={[styles.text, { fontSize: 20 }]}
            selectedTextStyle={[styles.text, { fontSize: 20 }]}
            itemTextStyle={[styles.text, { fontSize: 20 }]}
            data={intervals}
            labelField="label"
            valueField="value"
            placeholder="Select"
            onFocus={() => setIsIntervalFocus(true)}
            onBlur={() => setIsIntervalFocus(false)}
            value={intervalValue}
            onChange={(item) => {
              setIntervalValue(item.value);
              setIsIntervalFocus(false);
            }}
            renderRightIcon={() => (
              <UniversalIcon
                source={IconSource.FontAwesome6}
                name="chevron-down"
                size={20}
                color="black"
                style={{
                  transform: [{ rotate: isIntervalFocus ? "180deg" : "0deg" }],
                  marginRight: 5,
                }}
              />
            )}
          />
        </CustomModal>
        <Collapsible title="Goals" style={{ marginTop: 6 }}>
          {goals.map((goal) => (
            <GoalContainer
              key={goal.goalId}
              activity={goal.activity}
              metric={goal.metric}
              progress={goal.progress.amount}
              target={goal.target}
              days={2}
            ></GoalContainer>
          ))}
        </Collapsible>
        <View style={[styles.row]}>
          <Text style={globalStyles.sectionHeader}>Groups</Text>
          <TouchableOpacity onPress={() => setNewGroupModalVisibility(true)}>
            <UniversalIcon
              source={IconSource.FontAwesome6}
              name="plus"
              size={23}
              color="black"
              style={{ marginRight: 5 }}
            />
          </TouchableOpacity>
        </View>
        {groups.map((group) => (
          <TouchableOpacity
            key={group.groupId}
            onPress={() =>
              router.push({
                pathname: "/group",
                params: { id: group.groupId },
              })
            }
          >
            <GroupContainer
              group={group}
              days={2}
              groupProgress={10}
              groupTarget={4}
              individualProgress={5}
              individualTarget={4}
              style={{ marginBottom: 8 }}
            />
          </TouchableOpacity>
        ))}
      </CustomScrollView>
    </Suspense>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: "Roboto",
    fontWeight: 500,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dropdown: {
    backgroundColor: "#EFEFF3",
    borderColor: "black",
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
});
