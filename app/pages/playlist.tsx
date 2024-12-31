import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, View, Image, StyleSheet, Button } from "react-native";
import { Route, useLocalSearchParams } from "expo-router";
import { playlist } from "../../api/playlist"; // Spotify API 호출 함수
import CardElement, { ItemInfo } from "@/components/CardElement";
import { Colors } from "@/constants/Colors";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { openURL } from "expo-linking";

export default function PlaylistPage() {
  const {id, image} = useLocalSearchParams<Route & ItemInfo>();
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
        <ActivityIndicator size="large" color={Colors.theme.primary}  />
      </View>
    );
  }

  return (
    <ParallaxScrollView headerImage={
        <Image 
            source={{uri: image as string}}
            style={{width: '100%', height: '100%'}}
        />
    }>
      <Button
        title="Show in Spotify"
        color={Colors.theme.primary}
        onPress={() => {
          const url = `https://open.spotify.com/playlist/${id}`;
          openURL(url);
        }}/>
      <View style={styles.screen}>
        <FlatList
          data={playlistData}
          scrollEnabled={false}
          keyExtractor={(item, index) => `${item.id}+${index}`}
          renderItem={({ item }) => (
            <CardElement item={item} type="track" />
          )}
        />
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: 20,
    padding:10,
    backgroundColor:Colors.theme.background,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color:Colors.theme.text,
    marginBottom: 10,
  },
  // trackContainer: {
  //   flexDirection: "row",
  //   padding: 10,
  //   borderBottomWidth: 1,
  //   borderBottomColor: "#ddd",
    
  // },
  // trackImage: {
  //   width: 50,
  //   height: 50,
  //   borderRadius: 5,
  //   marginRight: 10,
  // },
  // trackInfo: {
  //   justifyContent: "center",
  // },
  // trackName: {
  //   fontSize: 16,
  //   fontWeight: "bold",
  // },
  // trackArtist: {
  //   fontSize: 14,
  //   color: "#666",
  // },
});
