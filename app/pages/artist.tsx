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
import { Button, Image, Pressable, FlatList, View, StyleSheet, Text, ActivityIndicator, Touchable, TouchableOpacity } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Toast, { SuccessToast } from 'react-native-toast-message';


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
        Toast.show({
            type: liked ? 'success' : 'info',
            text1: liked ? `Followed '${name}'` : `Unfollowed '${name}'`,
            text2: 'You can view followed artists in the following tab.',
            text1Style: {fontSize: 16},
            text2Style: {fontSize: 14},
            position: 'top',
            topOffset: 20,
            visibilityTime: 2000,
            autoHide: true,
            props: {
                style: {
                    backgroundColor: Colors.theme.primary,
                }
            }
        });
    }

    return (
        <SafeAreaProvider>
        <SafeAreaView style={{ 
            backgroundColor: Colors.theme.background,
            flex: 1,
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
        }}>
        <ParallaxScrollView
            headerImage={
                <View>
                    <Image
                        source={{uri: image as string}}
                        style={{width: '100%', height: '100%'}}
                    />
                </View>
            }>
            <Button title="Show in Spotify" color={Colors.theme.primary} onPress={() => {
                const url= `https://open.spotify.com/artist/${id}`;
                openURL(url);
            }} />
            <View style={{backgroundColor: Colors.theme.background}}>
            {loading ?
            <View style={{height: "100%", justifyContent: 'center'}}>
                <ActivityIndicator size="large" color={Colors.theme.primary} />
            </View>:
            <>
            {artistData.items.length > 0 && <Text style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: Colors.theme.text,
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
            </View>
        </ParallaxScrollView>
        <TouchableOpacity 
            style={styles.floatingButton}
            onPress={() => {
                onLikeChange(!liked)}}>
            <MaterialIcons name={liked ? 'favorite' : 'favorite-outline'} size={30} color='white' />
        </TouchableOpacity>
        <Toast config={{
            success: (props) => (
                <SuccessToast {...props} style={{ borderLeftColor: Colors.theme.primary }}/>
            ),
            info: (props) => {
                return (
                    <SuccessToast {...props} style={{ borderLeftColor: Colors.theme.secondary }}/>
                )
            }
        }}/>
        </SafeAreaView></SafeAreaProvider>
    )
}

const styles = StyleSheet.create({
    floatingButton: {
      marginTop: -60,
      transform: [{translateY: -20}, {translateX: -20}],
      zIndex: 10,
      backgroundColor: Colors.theme.primary,
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