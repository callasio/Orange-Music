import { getArtist } from "@/api/artist";
import { getSpotifyToken } from "@/api/token";
import axios from "axios";
import { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, Pressable, ActivityIndicator, StyleSheet } from "react-native";
import CardElement from "../CardElement";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";

export default function ArtistFrame({
    id,
    onDragStart,
    onDragEnd,
}: {id: string, onDragStart: () => void, onDragEnd: () => void}) {
    const [loading, setLoading] = useState(true);
    const [topTracksData, setTopTracksData] = useState<any>(null);
    const [artistData, setArtistData] = useState<any>(null);

    const fetchArtist = async () => {
        const token = await getSpotifyToken();
        const response = await axios.get(`https://api.spotify.com/v1/artists/${id}/top-tracks`, {
            headers: {
                Authorization: `Bearer ${token.access_token}`,
            },
        });

        const artistResponse = await getArtist({ artist_id: id });
        setTopTracksData(response.data);
        setArtistData(artistResponse);
        setLoading(false);
    }

    useEffect(() => {
        try {
            fetchArtist();
        } catch (error) {
            console.error("Error fetching artist data:", error);
        }
    }, []);

    const router = useRouter();

    const gotoArtist = () => {
        router.push({
            pathname: '/pages/artist',
            params: {
                name: artistData.name,
                image: artistData.images[0].url,
                id,
            }
        });
    }

    return (
        <TouchableOpacity
            onLongPress={onDragStart}
            onPressOut={onDragEnd}
            onPress={gotoArtist}
            style={{ backgroundColor: Colors.theme.background }}>
            {loading ? (
                <ActivityIndicator size="large" color={Colors.theme.primary} />
            ) : (
                <View style={styles.column}>
                    <View style={styles.header}>
                        <Image
                            source={{ uri: artistData.images[0].url }}
                            style={{ width: 40, height: 40, borderRadius: 20 }}
                        />
                        <Text style={styles.headerText}>{artistData.name}</Text>
                    </View>
                    <View style={styles.topTracks}>
                        {topTracksData.tracks.slice(0, 5).map((track: any) => (
                            <CardElement key={track.id} item={{
                                name: track.name,
                                image: track.album.images[0].url,
                                artist: track.artists[0].name,
                                id: track.id,
                            }} type={"track"} margin={false}/>
                        ))}
                        <TouchableOpacity style={{ 
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: 10,
                            backgroundColor:  Colors.theme.primary,
                          }}
                          onPress={gotoArtist}>
                            <Text style={{
                                color: Colors.theme.text,
                                fontSize: 16,
                                fontWeight: "bold",
                            }}>See more</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    column: {
        flexDirection: "column",
        margin: 20,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    headerText: {
        fontSize: 20,
        fontWeight: "bold",
        color: Colors.theme.text,
    },
    topTracks: {
        flexDirection: "column",
        marginTop: 10,
        borderRadius: 10,
        overflow: "hidden",
    }
});