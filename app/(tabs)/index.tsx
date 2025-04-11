import { Platform, StyleSheet, Text, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';

import HealthKit, {
  HealthValue,
  HealthKitPermissions,
  HealthInputOptions,
} from 'react-native-health'

export default function HomeScreen() {
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);
  const [heartRateDataInserted, setHeartRateDataInserted] = useState<boolean>(false);
  const [stepsDataInserted, setStepsDataInserted] = useState<boolean>(false);

  const permissions: HealthKitPermissions = {
    permissions: {
      read: [HealthKit.Constants.Permissions.HeartRate, HealthKit.Constants.Permissions.Steps],
      write: [HealthKit.Constants.Permissions.HeartRate, HealthKit.Constants.Permissions.Steps],
    },
  }

  useEffect(() => {
    HealthKit.initHealthKit(permissions, (error: string) => {
      /* Called after we receive a response from the system */
    
      if (error) {
        console.log('[ERROR] Cannot grant permissions!')
        setPermissionGranted(false);
        return;
      }
      
      setPermissionGranted(true);
    })
  }, [])

  useEffect(() => {
    if (!permissionGranted) return;
    const options = {
      startDate: new Date(2020, 2, 2, 6, 0, 0).toISOString(),
      endDate: new Date(2020, 2, 2, 6, 30, 0).toISOString(),
    }
  
    HealthKit.saveHeartRateSample(
      {
        value: 2,
        startDate: options.startDate
      },
      (callbackError: string, results: HealthValue) => {
        console.log("Heart rates: ", results);
        setHeartRateDataInserted(true);
      },
    )

    HealthKit.saveSteps(
      {
        value: 9.000,
        startDate: options.startDate,
        endDate: options.endDate,
      },
      (callbackError: string, results: HealthValue) => {
        console.log("Steps: ", results);
        setStepsDataInserted(true);
      },
    )
  }, [permissionGranted])

  useEffect(() => {
    if (!heartRateDataInserted || !stepsDataInserted) return;
    const options: HealthInputOptions = {
      startDate: new Date(2020, 1, 1).toISOString(),
      endDate: new Date(Date.now()).toISOString(),
    }
  
    HealthKit.getHeartRateSamples(
      options,
      (callbackError: string, results: HealthValue[]) => {
        console.log("Heart rates: ", results);
      },
    )

    HealthKit.getStepCount(
      { date: new Date(2020, 2, 2).toISOString() },
      (callbackError: string, results: HealthValue) => {
        console.log("Steps: ", results);
      },
    )
  }, [heartRateDataInserted, stepsDataInserted])

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text>OS</Text>
      <Text style={styles.value}>{Platform.OS}</Text>
      <Text>OS Version</Text>
      <Text style={styles.value}>{Platform.Version}</Text>
      <Text>isTV</Text>
      <Text style={styles.value}>{Platform.isTV.toString()}</Text>
      {Platform.OS === 'ios' && (
        <>
          <Text>isPad</Text>
          <Text style={styles.value}>{Platform.isPad.toString()}</Text>
        </>
      )}
      <Text>Constants</Text>
      <Text style={styles.value}>
        {JSON.stringify(Platform.constants, null, 2)}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  value: {
    fontWeight: '600',
    padding: 4,
    marginBottom: 8,
  },
});