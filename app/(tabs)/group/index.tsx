import { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';

import { IconSource, UniversalIcon } from '@/components/ui/UniversalIcon';
import { Back } from '@/components/Back';
import { Container } from '@/components/Container';
import { ContainerWithBlueBox } from '@/components/ContainerWithBlueBox';
import { ProgressBarPercentage } from '@/components/ProgressBarPercentage';
import { ProgressBarIcon } from '@/components/ProgressBarIcon';
import { ProgressBarTextIcon } from '@/components/ProgressBarTextIcon';
import { CollapsibleContainer } from '@/components/CollapsibleContainer';
import { NameProgress } from '@/components/NameProgress';

export default function Group() {
  const { name } = useLocalSearchParams();
  const router = useRouter();
  
  const [members, _] = useState([
    {
      name: 'Anders',
      activities: [{
        progress: 382,
        target: 800,
        icon: "person-swimming",
        unit: "kcal",
      }, {
        progress: 200,
        target: 700,
        icon: "person-biking",
        unit: "km",
      }]
    },
    {
      name: 'Albert Hald',
      activities: [{
        progress: 70,
        target: 700,
        icon: "person-biking",
        unit: "km",
      }]
    },
    {
      name: 'Albert Hel',
      activities: [{
        progress: 630,
        target: 700,
        icon: "person-biking",
        unit: "km",
      }]
    },
  ]);

  return (
    <>
      <Stack.Screen options={{
        headerTitle: name && typeof name === "string" ? name : "Group Name",
        headerLeft: () => <Back/>,
        headerRight: () => <TouchableOpacity style={{ marginRight: 15 }} onPress={() => router.push("/group/settings")}>
          <UniversalIcon source={IconSource.FontAwesome6} name={"gear"} size={21} color="white" />
        </TouchableOpacity>
      }}/>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 20 }}>
        <View style={{flexDirection: "row", gap: 10}}>
          <ContainerWithBlueBox text="23"/>
          <ContainerWithBlueBox text="13🔥"/>
        </View>

        <Container>
          <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
            <Text style={[styles.text, { fontSize: 24 }]}>Progress</Text>
            <Text style={[styles.text, { fontSize: 16 }]}>0 / 2 members finished</Text>
          </View>
          <View style={{marginTop: 10}}>
            <ProgressBarPercentage progress={38} />
          </View>
        </Container>

        <View style={{marginTop: 25}}>
          <Text style={[styles.text, {fontSize: 28}]}>Group Goals</Text>
          <CollapsibleContainer>
            <View>
              <View style={styles.row}>
                  <View style={styles.box}><Text style={[styles.text, { fontSize: 24, marginRight: "auto" }]}>Bike</Text></View>
                  <View style={styles.box}><Text style={[styles.text, { fontSize: 16, textAlign: "center" }]}>3.8 / 10 km</Text></View>
                  <View style={styles.box}/>
              </View>
              <ProgressBarIcon progress={38} iconSource={IconSource.FontAwesome6} icon="person-biking" />
            </View>
            <View style={[styles.row, {gap: 10, flexWrap: "wrap"}]}>
              <NameProgress name="Anders" progress={88}/>
              <NameProgress name="Albert Hald" progress={10}/>
              <NameProgress name="A Very Long Name Here" progress={100}/>
              <NameProgress name="A Very Long Name Here" progress={0}/>
              <NameProgress name="A Very Long Name Here" progress={10}/>
            </View>
          </CollapsibleContainer>
        </View>

        <View style={{marginTop: 25}}>
          <Text style={[styles.text, { fontSize: 28 }]}>Members</Text>
          {members.map((member) => (
            <View key={member.name}>
              <CollapsibleContainer>
                <View style={styles.row}>
                  <Text numberOfLines={1} style={[styles.text, { fontSize: 24 }]}>{member.name}</Text>
                  <View style={{ width: "40%", marginRight: 30 }}>
                    <ProgressBarPercentage
                      progress={member.activities!.reduce((acc, a) => acc + (a.progress / a.target), 0) / member.activities!.length * 100}
                      target={100}
                    />
                  </View>
                </View>
                <View>
                  {member.activities!.map((activity, index) => (
                    <ProgressBarTextIcon
                      key={index}
                      progress={activity.progress}
                      target={activity.target}
                      unit={activity.unit}
                      iconSource={IconSource.FontAwesome6}
                      icon={activity.icon}
                    />
                  ))}
                </View>
              </CollapsibleContainer>
            </View>
          ))}
        </View>
      </ScrollView>
    </>
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
    textOverflow: "ellipsis",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  box: {
    display: "flex",
    justifyContent: "center",
    flex: 1,
  },
});
