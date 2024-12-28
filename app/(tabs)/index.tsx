import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useRouter } from "expo-router"; // `expo-router`에서 제공하는 `useRouter` 훅을 가져옴

const App = () => {
  const router = useRouter(); // 페이지 전환을 위한 `useRouter` 훅 사용

  // 버튼 데이터: 각 버튼에 표시할 이미지, 이름, 그리고 관련 플레이리스트 ID
  const buttons = [
    {
      name: "ROSIE - ROSÉ", // 버튼 이름
      image: "https://image-cdn-ak.spotifycdn.com/image/ab67706c0000d72cac50b6f9aec13ee1d370465f", // 이미지 URL
      playlistId: "779iLhzoPQSF3Vb9AuiFTZ", // Spotify 플레이리스트 ID
    },
    {
      name: "BTS Playlist 2013-2024",
      image: "https://image-cdn-ak.spotifycdn.com/image/ab67706c0000d72ccccae3724b784630e6223071",
      playlistId: "0e1CZktKWxzUtZXpKO8Gza",
    },
    {
      name: "The Beatles All Songs",
      image: "https://mosaic.scdn.co/640/ab67616d00001e0255612ece447bec5d62c68375ab67616d00001e02608a63ad5b18e99da94a3f73ab67616d00001e02dbeec63ad914c973e75c24dfab67616d00001e02e230f303815e82a86713eedd",
      playlistId: "6ZmqDRJKJf3v3LzYZAaGGU",
    },
    {
      name: "taylor swift autumn",
      image: "https://image-cdn-ak.spotifycdn.com/image/ab67706c0000da84d832b4cb718ffa65d03eb336",
      playlistId: "2pUNSCOOr9lVzyMIIXO1eG",
    },
    {
      name: "Christmas Vibes 2024 🎄",
      image: "https://image-cdn-ak.spotifycdn.com/image/ab67706c0000da84c6e78728dfd60fa95a883b86",
      playlistId: "583cSUdsldtNLlMl4Me1Ux",
    },
    {
      name: "jazzy & groovy vibes",
      image: "https://image-cdn-ak.spotifycdn.com/image/ab67706c0000da848191d59af119167ed25e1736",
      playlistId: "7DPSUXq6oVgBFdwiHYeL4y",
    },
  ];


  // 버튼 클릭 시 호출되는 함수
  const handlePress = (playlistId: string) => {
    // `playlistId`를 기준으로 해당 버튼의 데이터를 찾음
    const buttonData = buttons.find((data) => data.playlistId === playlistId);
    // 페이지 전환: `/pages/playlist`로 이동하면서 데이터 전달
    router.push({
      pathname: "/pages/playlist", // 이동할 경로
      params: { 
        name: buttonData?.name, // 플레이리스트 이름
        id: playlistId, // 플레이리스트 ID
        artist: "", // (현재는 빈 문자열, 필요 시 추가 가능)
        image: buttonData?.image, // 플레이리스트 이미지
      }, 
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Playlist</Text> 
      <View style={styles.buttonContainer}>
        {buttons.map((button, index) => (
          <TouchableOpacity
            key={index} // 고유 키 값 (필수)
            style={styles.button} // 버튼 스타일
            onPress={() => handlePress(button.playlistId)} // 버튼 클릭 시 handlePress 호출
          >
            <Image source={{ uri: button.image }} style={styles.buttonImage} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // 화면을 꽉 채움
    alignItems: "center", // 가로 방향 중앙 정렬
    paddingTop: 50, // 화면 상단 여백
  },
  title: {
    fontSize: 30, // 글씨 크기
    fontWeight: "bold", // 글씨 굵게
    textAlign: "center", // 텍스트 중앙 정렬
    marginBottom: 60, // 하단 여백
  },
  buttonContainer: {
    flexDirection: "row", // 버튼들을 가로로 정렬
    flexWrap: "wrap", // 버튼이 줄을 넘어가면 자동으로 다음 줄로 이동
    justifyContent: "center", // 버튼들을 중앙 정렬
  },
  button: {
    width: 150, // 버튼의 너비
    height: 150, // 버튼의 높이
    borderRadius: 10, // 둥근 모서리
    overflow: "hidden", // 버튼 경계 밖의 내용을 숨김
    margin: 15, // 버튼 간격
  },
  buttonImage: {
    width: "100%", // 버튼 내부 이미지를 버튼 크기에 맞게 설정
    height: "100%",
    resizeMode: "cover", // 이미지 비율 유지하며 버튼 크기에 맞춤
  },
});

export default App;
