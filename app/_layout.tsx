import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { ItemInfo } from '@/components/CardElement';

global.Buffer = require('buffer').Buffer;

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="pages/track"
          options={({ route }) => {
            const { name, artist, image, id } = route.params as ItemInfo;

            return ({
              headerTitle: name,
              headerTitleStyle:{
                fontSize:22,
                fontWeight:'bold',
              },
          })}}
        />
        <Stack.Screen
          name="pages/artist"
          options={({ route }) => {
            const { name, artist, image, id } = route.params as ItemInfo;

            
            return ({
              headerTitle: name,
              headerTitleStyle:{
                fontSize:22,
                fontWeight:'bold',
              },
          })}}
        />
        <Stack.Screen
          name="pages/playlist"
          options={({ route }) => {
            const { name, artist, image, id } = route.params as ItemInfo;

            
            return ({
              headerTitle: name,
              headerTitleStyle:{
                fontSize:22,
                fontWeight:'bold',
              },
          })}}
        />
        <Stack.Screen
          name="pages/album"
          options={({ route }) => {
            const { name, artist, image, id } = route.params as ItemInfo;

            

            return ({
              headerTitle: name,
              headerTitleStyle:{
                fontSize:22,
                fontWeight:'bold',
              },
          })}}
        />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="light" />
    </ThemeProvider>
  );
}
