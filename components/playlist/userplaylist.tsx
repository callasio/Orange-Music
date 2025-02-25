import React from "react";
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { Colors } from "@/constants/Colors";
import { MaterialIcons } from "@expo/vector-icons";
import * as Clipboard from 'expo-clipboard';

const back = Colors.theme.background;
const text = Colors.theme.text;
const box=Colors.theme.secondary;


interface Playlist {
  name: string;
  image: string;
  id: string;
}

interface UserPlaylistProps {
  id: string;
  userName: string; // Title for the playlist section
  playlists: Playlist[]; // Array of playlist data
  onPlaylistPress: (playlistId: string) => void; // Function to handle playlist press
  loading: boolean; // Loading state
  onRemove: () => void;
}

export default function UserPlaylist({ id, userName, playlists, onPlaylistPress, loading, onRemove }: UserPlaylistProps) {
  const renderPlaylistButton = ({ item }: { item: Playlist }) => (
    <TouchableOpacity
      style={commonstyles.button}
      onPress={() => onPlaylistPress(item.id)}
    >
      <Image source={{ uri: item.image }} style={commonstyles.buttonImage} />
      <Text style={commonstyles.buttonText}>{item.name}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[commonstyles.box, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={Colors.theme.primary}  />
      </View>
    );
  }

  if (!playlists) {
    return (
      <View style={commonstyles.box}>
        <Text style={commonstyles.boxTitle}>{userName}'s Playlists</Text>
        <ActivityIndicator size="large" color={Colors.theme.primary}  />
      </View>
    );
  }

  return (
    <View style={commonstyles.box}>
      <View style={{ marginBottom: 15, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
      <TouchableOpacity style={{ flexDirection: "row", justifyContent: 'center', alignItems: 'center', gap: 5 }}
        onPress={() => {
          const url = `https://open.spotify.com/user/${id}`;
          Clipboard.setStringAsync(url);
        }}
      >
      <Text style={commonstyles.boxTitle}>{userName}'s Playlists</Text>
      <MaterialIcons name="link" size={24} color="rgba(255, 255, 255, 0.5)" />
      </TouchableOpacity>
      <TouchableOpacity onPress={onRemove} style={{ backgroundColor: Colors.theme.primary, borderRadius: 20, paddingHorizontal: 8, paddingVertical: 4, elevation: 3 }}>
        <Text style={{ color: Colors.theme.text, fontSize: 12 }}>Remove</Text>
      </TouchableOpacity>
      </View>
      <FlatList
        data={playlists}
        renderItem={renderPlaylistButton}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={commonstyles.scrollContainer}
        //ItemSeparatorComponent={() => <View style={commonstyles.separator} />}
      />
    </View>
  );
}

export const commonstyles = StyleSheet.create({
  container: {
    flex: 1, // Makes the container take up the full available space
    padding: 10,
    backgroundColor:back,
    
  },
  box: {
    //padding: 10, // Adds spacing inside the box
    backgroundColor: back, // Sets the background color of the box to light gray
    minHeight: 50, // Ensures the box has at least a height of 50 units
    //marginBottom: 10, // Adds spacing below each box
    marginTop: 10, // Adds spacing above each box
    borderRadius: 10,
    paddingTop:10,
  },
  boxTitle: {
    fontSize: 20, // Sets the font size of the title text
    fontWeight: "bold", // Makes the title text bold
    textAlign: "left", // Aligns the text to the left
    color: text,
    marginLeft:5,
  },
  scrollContainer: {
    paddingHorizontal: 0, // Adds horizontal padding within the scrollable container
  },
  button: {
    width: 150, // Sets the width of each button
    height: 180, // Sets the height of each button
    marginHorizontal: 5, // Adds spacing on the left and right of each button
    alignItems: "center", // Aligns the button's content to the center horizontally
  },
  buttonImage: {
    width: "100%", // Makes the image take up the full width of the button
    height: 120, // Sets the height of the image
    borderRadius: 10, // Rounds the corners of the image
    resizeMode: "cover", // Ensures the image covers the space proportionally
  },
  buttonText: {
    marginTop: 10, // Adds spacing above the text
    fontSize: 12, // Sets the font size of the button text
    fontWeight: "bold", // Makes the button text bold
    textAlign: "left", // Aligns the text to the center horizontally
    color:text,
  },
  separator: {
    width: 0.5, // Width of the separator line
    backgroundColor: text, // Color of the separator
    height: "900%", // Adjust height of the line
    alignSelf: "center", // Centers the separator vertically
  },
});
