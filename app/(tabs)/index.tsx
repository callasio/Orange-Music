import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, Text, Pressable, StyleSheet, TouchableOpacity, Modal, TextInput } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DragList from "react-native-draglist";
import UserPlaylist from "../../components/playlist/userplaylist";
import { userSavedTrackMultipleUsers } from "../../api/userSavedTrack";
import { commonstyles } from "../../components/playlist/userplaylist";
import { Colors } from "@/constants/Colors";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { openURL } from "expo-linking";

const back = Colors.theme.background;
const line = Colors.theme.primary;

const App = () => {
  const router = useRouter();
  const [playlistsByUser, setPlaylistsByUser] = useState<Record<string, any[]>>({});
  const [userOrder, setUserOrder] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalUrl, setModalUrl] = useState('');

  // User IDs and their custom titles
  const [user_ids, setUser_ids] = useState([
    "31dg76iibcgdmeo2pbdmg2wha5cu",
    "31sjl6f6zhs2cyrebstrjo7m5xgu",
    "ty5kkq44cnlzzvtwwob36mx4g",
    "kerrryk",
    "4n0ohrxqy5e1qymzr391vokkm",
  ]);

  const addUser = (url: string) => {
    const lastUrl = url.split("/").pop();
    const userId = lastUrl?.split("?")[0] ?? "";
    if (user_ids.includes(userId)) {
      return;
    }
    setUser_ids([userId, ...user_ids]);
  }

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
  }, [user_ids]);

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
        <ActivityIndicator size="large" color={Colors.theme.primary} />
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
    <SafeAreaProvider>
    <SafeAreaView style={{ 
        backgroundColor: Colors.theme.background,
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
    }}>
    <Modal
      transparent={true}
      visible={showModal}
      onRequestClose={() => {
        setShowModal(false);
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={{ color: Colors.theme.text, fontWeight: 'bold', fontSize: 18 }}>Copy and Paste Spotify User Link</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <TextInput
            value={modalUrl}
            onChangeText={setModalUrl}
            style={{ flex: 1, height: 40, borderColor: 'gray', borderBottomWidth: 1, marginBottom: 10, color: Colors.theme.text }}
            placeholder="ex) https://open.spotify.com/user/..."
            placeholderTextColor='rgba(255,255,255,0.5)'
          />
          </View>
          <TouchableOpacity
            style={[styles.button, styles.buttonClose]}
            onPress={() => {
              if (modalUrl === '') {
              const url = "https://open.spotify.com";
              openURL(url);
              } else {
                addUser(modalUrl);
                setShowModal(false);
              }
            }}
          >
            <Text style={styles.textStyle}>{
              modalUrl ? "Add User" : "Open Spotify"
            }</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
    <View style={[commonstyles.container, { paddingBottom: 0 }]}>
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
              userName={userId}
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
    <TouchableOpacity 
        style={styles.floatingButton}
        onPress={() => {
          setShowModal(true);
        }}>
        <MaterialIcons name="add" size={30} color='white' />
    </TouchableOpacity>
    </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
    floatingButton: {
      marginTop: -60,
      transform: [{translateY: -20}, {translateX: -20}],
      zIndex: 10,
      backgroundColor: Colors.theme.primary,
      width: 60,
      height: 60,
      borderRadius: 30, // Circular button
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 3,
      elevation: 5, // For Android shadow
    },

  centeredView: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    gap: 10,
    margin: 20,
    backgroundColor: Colors.theme.secondary,
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    paddingHorizontal: 20,
    padding: 10,
    width: 200,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: Colors.theme.primary,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    color: Colors.theme.text,
    marginBottom: 15,
    textAlign: 'center',
  },
  });

export default App;
