import { getArtist } from '@/api/artist';
import { getSpotifyToken } from '@/api/token';
import CardElement, { ItemInfo } from '@/components/CardElement';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { Colors } from '@/constants/Colors';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { openURL } from 'expo-linking';
import { Route, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { useEffect, useState } from 'react';
import { Button, Image, Pressable, FlatList, View, StyleSheet, Text, ActivityIndicator } from 'react-native';


export default function ArtistPage() {
    const {name, image, id} = useLocalSearchParams<Route & ItemInfo>();

    const [liked, setLiked] = useState(false);
    const [loading, setLoading] = useState(true);
    const [artistData, setArtistData] = useState<any>([]);

    const fetchArtist = async () => {
        try {
            const token = await getSpotifyToken();
            const response = await axios.get(`https://api.spotify.com/v1/artists/${id}/albums`, {
                headers: {
                    Authorization: `Bearer ${token.access_token}`,
                },
                params: {
                    limit: 50,
                }
            })
            setArtistData(response.data);
        } catch (error) {
            console.error("Error fetching artist:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchArtist();
        AsyncStorage.getItem('likedArtists').then((value) => {
            const likedArtists = value ? JSON.parse(value) as string[] : [];
            setLiked(likedArtists.includes(id as string));
        });
    }, [])

    const onLikeChange = (liked: boolean) => {
        setLiked(liked);
        AsyncStorage.getItem('likedArtists').then((value) => {
            const likedArtists = value ? JSON.parse(value) as string[] : [];
            if (likedArtists.includes(id as string) !== liked) {
                const updated = liked ? [id, ...likedArtists] : likedArtists.filter((artistId) => artistId !== id);
                const filtered = updated.filter((value, index, self) => self.indexOf(value) === index);
                AsyncStorage.setItem('likedArtists', JSON.stringify(filtered));
            }
        });
    }

    return (
        <>
        <ParallaxScrollView
            headerImage={
                <View>
                    <Image
                        source={{uri: image as string}}
                        style={{width: '100%', height: '100%'}}
                    />
                </View>
            }>
            <Button title="Show in Spotify" 
            color={Colors.spotify.green}
            onPress={() => {
                const url= `https://open.spotify.com/artist/${id}`;
                openURL(url);
            }} />
            {loading ?
            <View style={{height: "100%", justifyContent: 'center'}}>
                <ActivityIndicator/>
            </View>:
            <>
            {artistData.items.length > 0 && <Text style={{
                fontSize: 20,
                fontWeight: 'bold',
                margin: 20,
                marginBottom: 0,
            }}>{`Albums`}</Text>}
            <FlatList
            style={{padding: 10}}
            data={artistData.items}
            scrollEnabled={false}
            keyExtractor={(item) => item.id}
            renderItem={({item}) => (
                <CardElement item={{
                    name: item.name,
                    image: item.images[0].url,
                    id: item.id,
                    artist: item.artists[0].name,
                }} type='album' />
            )}          
            /></>}
        </ParallaxScrollView>

        <Pressable 
                style={styles.floatingButton}
                onPress={() => {
                    onLikeChange(!liked)}}>
                <Ionicons name={liked ? 'heart' : 'heart-outline'} size={30} color={Colors.spotify.white} />
            </Pressable>
        </>
    )
}

const styles = StyleSheet.create({
    floatingButton: {
      position: 'absolute',
      bottom: 20, // Distance from the bottom
      right: 20, // Distance from the right
      zIndex: 10,
      backgroundColor: Colors.spotify.green,
      width: 60,
      height: 60,
      borderRadius: 30, // Circular button
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 3,
      elevation: 5, // For Android shadow
    },
  });