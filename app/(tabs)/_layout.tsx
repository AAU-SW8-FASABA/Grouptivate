import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSource, UniversalIcon } from "@/components/ui/UniversalIcon";
import TabBarBackground from "@/components/ui/TabBarBackground";

export default function TabLayout() {
  return (
    <Tabs
      backBehavior="history"
      screenOptions={{
        tabBarActiveTintColor: "#1E4E8C",
        headerTitleAlign: "center",
        tabBarLabelStyle: {
          fontFamily: "Roboto",
        },
        headerTitleStyle: {
          fontFamily: "Roboto",
          color: "white",
          fontSize: 28,
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
            position: "absolute",
            borderTopWidth: 0,
          },
          default: {
            // Use a solid background on Android
            backgroundColor: "#ffffff",
            borderTopWidth: 0,
          },
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarButtonTestID: "home-tab-buttonid",
          title: "Home",
          headerTitle: "Grouptivate",
          tabBarIcon: ({ color }) => (
            <UniversalIcon
              source={IconSource.FontAwesome6}
              name={"house"}
              size={21}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarButtonTestID: "profile-tab-buttonid",
          title: "Profile",
          headerTitle: "Grouptivate",
          tabBarIcon: ({ color }) => (
            <UniversalIcon
              source={IconSource.FontAwesome6}
              name={"user-large"}
              size={21}
              color={color}
            />
          ),
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
