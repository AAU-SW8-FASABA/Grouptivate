import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';

export default function TabLayout() {
  return (
    <Tabs
      backBehavior='history'
      screenOptions={{
        tabBarActiveTintColor: "#1E4E8C",
        headerTitleAlign: "center",
        tabBarLabelStyle: {
          fontFamily: "Roboto",
        },
        headerTitleStyle: {
          fontFamily: "Roboto",
          color: "white",
          fontSize: 32,
        },
        headerStyle: {
          height: 100,
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
          headerTitle: "Grouptivate",
          tabBarIcon: ({ color }) => <IconSymbol size={32} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerTitle: "Grouptivate",
          tabBarIcon: ({ color }) => <IconSymbol size={32} name="person.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="group/index"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="group/settings"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
