import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, View, Image, StyleSheet } from "react-native";
import { Route, useLocalSearchParams } from "expo-router";
import { album } from "../../api/album"; // Spotify API 호출 함수
import CardElement, { ItemInfo } from "@/components/CardElement";

export default function AlbumlistPage() {
  const {name, artist, image, id} = useLocalSearchParams<Route & ItemInfo>();
  const [albumlistName, setAlbumlistName] = useState("");
  const [albumlistData, setAlbumlistData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      console.error("No Album ID provided");
      setLoading(false);
      return;
    }

    const fetchAlbum = async () => {
      try {
        const data = await album({ id: id as string }); // Spotify API 호출
        setAlbumlistName(data.name); // 앨범 이름 설정
        const tracks = data.tracks.items.map((item: any) => ({
          id: item.id,
          name: item.name,
          artist: item.artists.map((artist: any) => artist.name).join(", "),
          image: image || "https://image-cdn-ak.spotifycdn.com/image/ab67706c0000da848191d59af119167ed25e1736",
        }));
        setAlbumlistData(tracks); // 트랙 데이터 설정
      } catch (error) {
        console.error("Error fetching albumlist:", error);
      } finally {
        setLoading(false); // 로딩 상태 종료
      }
    };

    fetchAlbum();
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
      <Text style={styles.title}>{albumlistName}</Text>
     <FlatList
             data={albumlistData}
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
