import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DragList from "react-native-draglist";
import UserPlaylist from "../../components/playlist/userplaylist";
import { userSavedTrackMultipleUsers } from "../../api/userSavedTrack";
import { commonstyles } from "../../components/playlist/userplaylist";

const App = () => {
  const router = useRouter();
  const [playlistsByUser, setPlaylistsByUser] = useState<Record<string, any[]>>({});
  const [userOrder, setUserOrder] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // User IDs and their custom titles
  const user_ids = [
    "31dg76iibcgdmeo2pbdmg2wha5cu",
    "31sjl6f6zhs2cyrebstrjo7m5xgu",
    "ty5kkq44cnlzzvtwwob36mx4g",
    "kerrryk",
    "4n0ohrxqy5e1qymzr391vokkm",
  ];

  const userTitles: Record<string, string> = {
    "31dg76iibcgdmeo2pbdmg2wha5cu": "바게트빵's Playlists",
    "31sjl6f6zhs2cyrebstrjo7m5xgu": "SI_NU's Playlists",
    "ty5kkq44cnlzzvtwwob36mx4g": "Topsify Radio's Playlists",
    "kerrryk": "Keri's Playlists",
    "4n0ohrxqy5e1qymzr391vokkm": "설빈's Playlists",
  };

  // Fetch playlists and user order
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch playlists grouped by user ID
        const playlists = await userSavedTrackMultipleUsers(user_ids);
        const groupedPlaylists = user_ids.reduce((acc, userId) => {
          acc[userId] = playlists.filter((playlist) => playlist.user === userId) || [];
          return acc;
        }, {} as Record<string, any[]>);

        setPlaylistsByUser(groupedPlaylists);
        console.log("Grouped Playlists by User:", groupedPlaylists);

        // Retrieve or initialize user order
        const savedOrder = await AsyncStorage.getItem("userOrder");
        if (savedOrder) {
          const parsedOrder = JSON.parse(savedOrder);
          if (Array.isArray(parsedOrder)) {
            setUserOrder(parsedOrder);
          } else {
            throw new Error("Invalid saved order format");
          }
        } else {
          setUserOrder(user_ids);
        }
      } catch (error) {
        console.error("Error fetching playlists or initializing order:", error);
        setUserOrder(user_ids); // Fallback to default order
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle playlist press
  const handleUserPlaylistPress = (playlistId: string, userId: string) => {
    const playlistData = playlistsByUser[userId]?.find((data) => data.id === playlistId);
    if (!playlistData) {
      console.error("Playlist not found for ID:", playlistId);
      return;
    }
    router.push({
      pathname: "/pages/playlist",
      params: {
        name: playlistData.name,
        id: playlistData.id,
        artist: "",
        image: playlistData.image,
      },
    });
  };

  // Handle reordering and save to AsyncStorage
  const onReorder = async (data: string[]) => {
    setUserOrder(data);
    try {
      await AsyncStorage.setItem("userOrder", JSON.stringify(data));
    } catch (error) {
      console.error("Error saving order to AsyncStorage:", error);
    }
  };

  if (loading) {
    return (
      <View style={[commonstyles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#1DB954" />
      </View>
    );
  }

  if (!userOrder.length || Object.values(playlistsByUser).every((list) => list.length === 0)) {
    console.warn("No playlists or userOrder available.");
    return (
      <View style={[commonstyles.container, { justifyContent: "center", alignItems: "center" }]}>
        <Text style={{ fontSize: 18, color: "#666" }}>No playlists available</Text>
      </View>
    );
  }

  return (
    <View style={[commonstyles.container]}>
      <DragList
        data={userOrder}
        renderItem={({ item: userId, onDragStart, onDragEnd }) => (
          <Pressable
            key={userId}
            onLongPress={onDragStart}
            onPressOut={onDragEnd}
            style={{ marginBottom: 10 }}
          >
            <UserPlaylist
              title={userTitles[userId] || `Playlists for User ${userId}`}
              playlists={playlistsByUser[userId]}
              onPlaylistPress={(playlistId) => handleUserPlaylistPress(playlistId, userId)}
              loading={false}
            />
          </Pressable>
        )}
        keyExtractor={(item) => item}
        onReordered={(fromIndex: number, toIndex: number) => {
          const updatedOrder = [...userOrder];
          const [movedItem] = updatedOrder.splice(fromIndex, 1);
          updatedOrder.splice(toIndex, 0, movedItem);
          onReorder(updatedOrder);
        }}
      />
      <View style={{ height: 15 }} />
    </View>
  );
};

export default App;
