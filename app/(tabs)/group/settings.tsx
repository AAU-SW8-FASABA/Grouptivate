import { StyleSheet, Text, ScrollView } from 'react-native';
import { Stack } from 'expo-router';

import { Back } from '@/components/Back';

export default function GroupSettings() {
  return (
    <>
      <Stack.Screen options={{
        title: "Settings",
        headerLeft: () => <Back/>
      }}/>
      <ScrollView style={styles.container}>
        <Text>Hello from Group Settings</Text>
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
});
