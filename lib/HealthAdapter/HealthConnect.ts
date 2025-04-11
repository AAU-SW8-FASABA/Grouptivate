import { OtherActivity, SportActivity } from '../API/schemas/Activity';
import { 
  CaloriesOnlyOptions, 
  CountOnlyOptions, 
  HealthAdapter, 
  SportOptions } from './HealthAdapter';

import {
    initialize,
    requestPermission,
    readRecords,
  } from 'react-native-health-connect';


const activityMapping: Record<OtherActivity | SportActivity, number> = {
  
}

class HealthConnectAdapter extends HealthAdapter {
  init(): Promise<void> {

  }
  
  getData(options: CaloriesOnlyOptions | CountOnlyOptions | SportOptions): Promise<number> {
      
  }
}

  const readSampleData = async () => {
    const isInitialized = await initialize();
  
    const grantedPermissions = await requestPermission([
      { accessType: 'read', recordType: 'ActiveCaloriesBurned' },
      { accessType: 'read', recordType: 'ExerciseSession' },
    ]);
  
    const { records } = await readRecords('ActiveCaloriesBurned', {
      timeRangeFilter: {
        operator: 'between',
        startTime: '2023-01-09T12:00:00.405Z',
        endTime: '2023-01-09T23:53:15.405Z',
      },
    });
  }