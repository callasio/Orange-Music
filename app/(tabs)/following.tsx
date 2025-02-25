import ArtistFrame from '@/components/following/artist';
import { Colors } from '@/constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import DragList from 'react-native-draglist';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function FollowingPage() {
    const navigation = useNavigation();

    useEffect(() => {
        navigation.addListener('focus', () => {
            AsyncStorage.getItem('likedArtists').then((value) => {
                const likedArtists = value ? JSON.parse(value) as string[] : [];
                setLikedArtists(likedArtists);
            });
        })
    }, [navigation]);

    const [likedArtists, setLikedArtists] = useState<string[]>([]);

    function onReordered(fromIndex: number, toIndex: number) {
        const copy = [...likedArtists];
        const removed = copy.splice(fromIndex, 1);

        copy.splice(toIndex, 0, removed[0]);
        setLikedArtists(copy);

        AsyncStorage.setItem('likedArtists', JSON.stringify(copy));
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ backgroundColor: Colors.theme.background, height: '100%' }}>
                {likedArtists.length === 0 ? 
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: "#BBB", textAlign: 'center', marginTop: 20 }}>You haven't followed any artists yet!</Text>
                </View>
                :
                <DragList
                data={likedArtists}
                
                renderItem={({ item, onDragStart, onDragEnd }) => <
                    ArtistFrame id={item} onDragStart={onDragStart} onDragEnd={onDragEnd}/>}
                keyExtractor={(item) => `following${item}`}
                onReordered={onReordered}
            />}
            </SafeAreaView>
        </SafeAreaProvider>);
}