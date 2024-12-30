import { getArtist } from "@/api/artist";
import { Colors } from "@/constants/Colors";
import { openURL } from "expo-linking";
import { useRouter } from "expo-router";
import React from "react";
import { useEffect, useState } from "react";

import { Image, View, Text, ActivityIndicator, Pressable, TouchableOpacity } from 'react-native';

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

    const router = useRouter();

    return (
        <TouchableOpacity style={{ 
            aspectRatio: 1, 
            flexDirection: 'column', 
            borderRadius: 10,
            overflow: 'hidden',
        }}
        onPress={() => {
            router.push({
                pathname: '/pages/artist',
                params: {
                    name,
                    image: data?.images[0]?.url,
                    id,
                }
            });
        }}>
            <View style={{ aspectRatio: 1.3 }}>
                {loading ?
                    <ActivityIndicator size="large" color={Colors.theme.primary} /> :
                    <Image
                        source={{ uri: data!.images[0]?.url || "https://via.placeholder.com/150" }}
                        style={{ width: '100%', height: '100%' }}
                    />
                }
            </View>
            <View style={{ height: '100%', padding: 10, flexDirection: 'column', backgroundColor: Colors.theme.secondary }}>
                {loading ?
                    <ActivityIndicator size="large" color={Colors.theme.primary} /> :
                    (<>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: Colors.theme.text }}>{name}</Text>
                        <Text style={{ color: '#BBB' }}>{`${data!.followers.total} followers`}</Text>
                        <Pressable onPress={() => {
                            const url = `https://open.spotify.com/artist/${id}`;
                            openURL(url);
                        }}>
                            <Text style={{ color: Colors.theme.primary }}>Show in Spotify</Text>
                        </Pressable>
                    </>)
                }
            </View>
        </TouchableOpacity>
    )
}