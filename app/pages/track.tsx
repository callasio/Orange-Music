import { TrackObject } from '@/api/object';
import { getTrack } from '@/api/track';
import { ItemInfo } from '@/components/CardElement';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import AlbumPreview from '@/components/track/album';
import ArtistFrame from '@/components/track/artist';
import { Colors } from '@/constants/Colors';
import { canOpenURL, openURL } from 'expo-linking';
import { Route, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Button, Image, Text, TouchableOpacity, View } from 'react-native';

export default function TrackPage() {
  const { name, artist, image, id } = useLocalSearchParams<Route & ItemInfo>();

  const [data, setData] = useState<TrackObject>();
  const [loading, setLoading] = useState(true);
  
  const fetchTrack = async () => {
    setLoading(true);
    const newData = await getTrack({ track_id: id as string });
    setData(newData);
    setLoading(false);
  }

  useEffect(() => {
    fetchTrack();
  }, []);

  return (
    <ParallaxScrollView headerImage={
      <Image
        source={{ uri: image as string }}
        style={{ width: '100%', height: '100%' }} />
    } >
      
      
      <Button title="Show in Spotify" color={Colors.theme.primary} onPress={() => {
          const url= `https://open.spotify.com/track/${id}`;
          openURL(url);
      }} />
      <View style={{ backgroundColor: Colors.theme.background }}>
      {( loading ? 
      <View style={{ height: '100%', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Colors.theme.primary} />
      </View> :
      <View style={{ padding: 20, flexDirection: 'column', gap: 20 }}>
        {
          data?.artists.map((artist, index) => (
            <ArtistFrame name={artist.name} id={artist.id} key={`artists${index}`} />
          ))
        }
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: Colors.theme.text }}>Album "{data?.album?.name}"</Text>
        <AlbumPreview id={data?.album.id!} />
      </View>)}</View>
    </ParallaxScrollView>
  );
}