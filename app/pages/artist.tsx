import { ItemInfo } from '@/components/CardElement';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Route, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Button, Text } from 'react-native';

export default function ArtistPage() {
    const {name, image, id} = useLocalSearchParams<Route & ItemInfo>();

    const [liked, setLiked] = useState(false);

    useEffect(() => {
        AsyncStorage.getItem('likedArtists').then((value) => {
            const likedArtists = value ? JSON.parse(value) as string[] : [];
            setLiked(likedArtists.includes(id as string));
        });
    }, [])

    const onLikeChange = (liked: boolean) => {
        AsyncStorage.getItem('likedArtists').then((value) => {
            const likedArtists = value ? JSON.parse(value) as string[] : [];
            if (liked) {
                AsyncStorage.setItem('likedArtists', JSON.stringify([id, ...likedArtists]));
            } else {
                AsyncStorage.setItem('likedArtists', JSON.stringify(likedArtists.filter((artistId) => artistId !== id)));
            }
        });
    }

    useEffect(() => {
        onLikeChange(liked);
    }, [liked])

    return (
        <Button title={liked ? "Unlike" : "Like"} onPress={() => setLiked(!liked)} />
    )
}