import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, View, Image, StyleSheet } from "react-native";
import { Route, useLocalSearchParams } from "expo-router";
import { playlist } from "../../api/playlist"; // Spotify API 호출 함수
import CardElement, { ItemInfo } from "@/components/CardElement";

export default function PlaylistPage() {
  const {name, artist, image, id} = useLocalSearchParams<Route & ItemInfo>();
  const [playlistName, setPlaylistName] = useState("");
  const [playlistData, setPlaylistData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      console.error("No playlist ID provided");
      setLoading(false);
      return;
    }

    const fetchPlaylist = async () => {
      try {
        const data = await playlist({ playlist_id: id as string }); // Spotify API 호출
        setPlaylistName(data.name); // 플레이리스트 이름 설정o
        const tracks = data.tracks.items.map((item: any) => item.track ? ({
          id: item.track.id,
          name: item.track.name,
          artist: item.track.artists.map((artist: any) => artist.name).join(", "),
          image: item.track.album.images[0]?.url || "https://via.placeholder.com/150",
        }) : null).filter((item: any) => item !== null);
        setPlaylistData(tracks); // 트랙 데이터 설정
      } catch (error) {
        console.error("Error fetching playlist:", error);
      } finally {
        setLoading(false); // 로딩 상태 종료
      }
    };

    fetchPlaylist();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.screen}>
        <ActivityIndicator size="large" color="#1DB954" />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>{playlistName}</Text>
      <FlatList
        data={playlistData}
        keyExtractor={(item, index) => `${item.id}+${index}`}
        renderItem={({ item }) => (
          <CardElement item={item} type="track" />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  trackContainer: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  trackImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 10,
  },
  trackInfo: {
    justifyContent: "center",
  },
  trackName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  trackArtist: {
    fontSize: 14,
    color: "#666",
  },
});
