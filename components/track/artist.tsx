import { getArtist } from "@/api/artist";
import { Colors } from "@/constants/Colors";
import { openURL } from "expo-linking";
import React from "react";
import { useEffect, useState } from "react";

import { Image, View, Text, ActivityIndicator, Pressable } from 'react-native';

export default function ArtistFrame({
    name,
    id
}: { name: string, id: string }) {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchArtist = async () => {
        const newData = await getArtist({ artist_id: id });
        setData(newData);
        setLoading(false);
    }

    useEffect(() => {
        fetchArtist();
    }, []);

    return (
        <View style={{ borderWidth: 1, borderColor: 'black', aspectRatio: 1, flexDirection: 'column', borderRadius: 10, backgroundColor: 'white', overflow: 'hidden' }}>
            <View style={{ aspectRatio: 1.3 }}>
                {loading ?
                    <ActivityIndicator /> :
                    <Image
                        source={{ uri: data!.images[0]?.url || "https://via.placeholder.com/150" }}
                        style={{ width: '100%', height: '100%' }}
                    />
                }
            </View>
            <View style={{ height: '100%', padding: 10, flexDirection: 'column' }}>
                {loading ?
                    <ActivityIndicator /> :
                    (<>
                        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{name}</Text>
                        <Text style={{ color: 'gray' }}>{`${data!.followers.total} followers`}</Text>
                        <Pressable onPress={() => {
                            const url = `https://open.spotify.com/artist/${id}`;
                            openURL(url);
                        }}>
                            <Text style={{ color: Colors.spotify.green }}>Show in Spotify</Text>
                        </Pressable>
                    </>)
                }
            </View>
        </View>
    )
}