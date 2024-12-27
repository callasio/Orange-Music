import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { playlist } from "../../api/playlist"; // Spotify API 호출 함수
import CardElement from "@/components/CardElement";

const App = () => {
  const [currentScreen, setCurrentScreen] = useState("Home"); // 현재 화면 상태
  const [playlistData, setPlaylistData] = useState<any[]>([]); // 플레이리스트 데이터
  const [playlistName, setPlaylistName] = useState<string>(""); // 현재 플레이리스트 이름
  const [loading, setLoading] = useState(false); // 로딩 상태

  const handlePress = async (screen: string, playlistId: string) => {
    setCurrentScreen(screen); // 화면 변경

    if (playlistId) {
      setLoading(true);
      try {
        const data = await playlist({ playlist_id: playlistId }); // Spotify API 호출
        setPlaylistName(data.name); // 플레이리스트 이름 설정
        const tracks = data.tracks.items.map((item: any) => ({
          name: item.track.name,
          artist: item.track.artists.map((artist: any) => artist.name).join(", "),
          image: item.track.album.images[0]?.url || "https://via.placeholder.com/150",
          id: item.track.id,
        }));
        setPlaylistData(tracks); // 가져온 트랙 데이터를 설정
      } catch (error) {
        console.error("Error fetching playlist:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  // 버튼별 데이터
  const buttons = [
    {
      image: "https://image-cdn-ak.spotifycdn.com/image/ab67706c0000d72cac50b6f9aec13ee1d370465f",
      playlistId: "779iLhzoPQSF3Vb9AuiFTZ",
    },
    {
      image: "https://image-cdn-ak.spotifycdn.com/image/ab67706c0000d72ccccae3724b784630e6223071",
      playlistId: "0e1CZktKWxzUtZXpKO8Gza",
    },
    {
      image: "https://mosaic.scdn.co/640/ab67616d00001e0255612ece447bec5d62c68375ab67616d00001e02608a63ad5b18e99da94a3f73ab67616d00001e02dbeec63ad914c973e75c24dfab67616d00001e02e230f303815e82a86713eedd",
      playlistId: "6ZmqDRJKJf3v3LzYZAaGGU",
    },
    {
      image: "https://image-cdn-ak.spotifycdn.com/image/ab67706c0000da84d832b4cb718ffa65d03eb336",
      playlistId: "2pUNSCOOr9lVzyMIIXO1eG",
    },
    {
      image: "https://image-cdn-ak.spotifycdn.com/image/ab67706c0000da84c6e78728dfd60fa95a883b86",
      playlistId: "583cSUdsldtNLlMl4Me1Ux",
    },
    {
      image: "https://image-cdn-ak.spotifycdn.com/image/ab67706c0000da848191d59af119167ed25e1736",
      playlistId: "7DPSUXq6oVgBFdwiHYeL4y",
    },
  ];

  // 홈 화면
  if (currentScreen === "Home") {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Playlist</Text>
        <View style={styles.buttonContainer}>
          {buttons.map((button, index) => (
            <TouchableOpacity
              key={index}
              style={styles.button}
              onPress={() => handlePress(`Screen${index + 1}`, button.playlistId)}
            >
              <Image source={{ uri: button.image }} style={styles.buttonImage} />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  }

  // 각 버튼별 화면
  return (
    <View style={styles.screen}>
      {loading ? (
        <ActivityIndicator size="large" color="#1DB954" />
      ) :  (
        <>
          <Text style={styles.text}>{playlistName}</Text> 
          <FlatList
            data={playlistData}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              // <View style={styles.playlistItem}>
              //   <Image source={{ uri: item.image }} style={styles.playlistImage} />
              //   <View>
              //     <Text style={styles.songName}>{item.name}</Text>
              //     <Text style={styles.artistName}>{item.artist}</Text>
              //   </View>
              // </View>
              <CardElement item={item} type="track" />
            )}
          />
        </>
      ) }
      <TouchableOpacity style={styles.backButton} onPress={() => handlePress("Home",  "")}>
        <Text style={styles.backButtonText}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 50,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 60,
  },
  buttonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  button: {
    width: 150,
    height: 150,
    borderRadius: 10,
    overflow: "hidden",
    margin: 15,
  },
  buttonImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20, 
    marginBottom: 20,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  
  backButton: {
    marginTop: 10, // 위에서 여백 추가
    marginBottom: 10,
    alignSelf: "center", // 중앙 정렬
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#007BFF",
    borderRadius: 5,
  },
  
  backButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default App;
