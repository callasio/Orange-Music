import { ItemInfo } from '@/components/CardElement';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { Route, useLocalSearchParams } from 'expo-router';
import { Image, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';

export default function TrackPage() {
  const { name, artist, image, id } = useLocalSearchParams<Route & ItemInfo>();

  return (
    <ParallaxScrollView headerImage={
      <Image
        source={{ uri: image as string }}
        style={{ width: '100%', height: '100%' }} />
    } headerBackgroundColor={{
      dark: '',
      light: ''
    }}>
      <View style={{ padding: 0 }}>
        <Text>{name}</Text>
        <Text>{artist}</Text>
      </View>
    </ParallaxScrollView>
  );
}