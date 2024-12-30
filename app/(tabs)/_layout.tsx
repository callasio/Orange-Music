import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { MaterialIcons } from '@expo/vector-icons';

const text=Colors.theme.primary;
const back = Colors.theme.secondary;
const homebackground=Colors.theme.background;

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: text,
        headerShown: false,
        tabBarButton: HapticTab,
        //tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
            backgroundcolor:homebackground,
          },
          default: {
            backgroundColor:homebackground,
          },
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Playlist',
          tabBarIcon: ({ color }) => <MaterialIcons size={28} name="queue-music" color={color} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ focused, color }) => <MaterialIcons size={28} name="search" color={color} />,
        }}
      />
      <Tabs.Screen
        name="following"
        options={{
          title: 'Following',
          tabBarIcon: ({ focused, color }) => <MaterialIcons size={28} name=
            {focused ? "favorite" : "favorite-outline"} color={color} />,
        }}
      />
    </Tabs>
  );
}
