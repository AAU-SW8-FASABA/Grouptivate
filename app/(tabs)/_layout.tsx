import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSource, UniversalIcon } from '@/components/ui/UniversalIcon';
import TabBarBackground from '@/components/ui/TabBarBackground';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#1E4E8C",
        headerTitle: "Grouptivate",
        headerTitleAlign: "center",
        tabBarLabelStyle: {
          fontFamily: "Roboto",
        },
        headerTitleStyle: {
          fontFamily: "Roboto",
          fontSize: 32,
        },
        headerStyle: {
          height: 50,
          backgroundColor: "#1E4E8C",
        },
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
            height: 50,
            borderTopWidth: 0
          },
          default: {
            // Use a solid background on Android
            backgroundColor: '#ffffff',
            height: 50,
            borderTopWidth: 0
          },
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <UniversalIcon source={IconSource.FontAwesome6} name={"house"} size={21} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <UniversalIcon source={IconSource.FontAwesome6} name={"user-large"} size={21} color={color} />,
        }}
      />
    </Tabs>
  );
}
