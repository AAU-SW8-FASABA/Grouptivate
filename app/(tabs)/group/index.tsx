import { StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';

import { IconSymbol } from '@/components/ui/IconSymbol';
import { Back } from '@/components/Back';
import { Container } from '@/components/Container';

export default function Group() {
  const { name } = useLocalSearchParams();
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{
        headerTitle: name && typeof name === "string" ? name : "Group Name",
        headerLeft: () => <Back/>,
        headerRight: () => <TouchableOpacity style={{ marginRight: 15 }} onPress={() => router.push("/group/settings")}>
          <IconSymbol name="gear" size={24} color="white" />
        </TouchableOpacity>
      }}/>
      <ScrollView style={styles.container}>
          <Text>Group</Text>
      </ScrollView>
    </>
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
});
