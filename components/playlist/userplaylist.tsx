import React from "react";
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";

interface Playlist {
  name: string;
  image: string;
  id: string;
}

interface UserPlaylistProps {
  title: string; // Title for the playlist section
  playlists: Playlist[]; // Array of playlist data
  onPlaylistPress: (playlistId: string) => void; // Function to handle playlist press
  loading: boolean; // Loading state
}

export default function UserPlaylist({ title, playlists, onPlaylistPress, loading }: UserPlaylistProps) {
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
        <ActivityIndicator size="large" color="#1DB954" />
      </View>
    );
  }

  if (playlists.length === 0) {
    return (
      <View style={commonstyles.box}>
        <Text style={commonstyles.boxTitle}>{title}</Text>
        <Text style={{ textAlign: "center", color: "#666" }}>No playlists available</Text>
      </View>
    );
  }

  return (
    <View style={commonstyles.box}>
      <Text style={commonstyles.boxTitle}>{title}</Text>
      <FlatList
        data={playlists}
        renderItem={renderPlaylistButton}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={commonstyles.scrollContainer}
        ItemSeparatorComponent={() => <View style={commonstyles.separator} />}
      />
    </View>
  );
}

export const commonstyles = StyleSheet.create({
  container: {
    flex: 1, // Makes the container take up the full available space
    paddingTop: 20, // Adds spacing at the top of the container
  },
  box: {
    padding: 15, // Adds spacing inside the box
    backgroundColor: "#f9f9f9", // Sets the background color of the box to light gray
    minHeight: 50, // Ensures the box has at least a height of 50 units
    marginBottom: 10, // Adds spacing below each box
  },
  boxTitle: {
    fontSize: 20, // Sets the font size of the title text
    fontWeight: "bold", // Makes the title text bold
    marginBottom: 15, // Adds spacing below the title
    textAlign: "left", // Aligns the text to the left
  },
  scrollContainer: {
    paddingHorizontal: 10, // Adds horizontal padding within the scrollable container
  },
  button: {
    width: 140, // Sets the width of each button
    height: 180, // Sets the height of each button
    marginHorizontal: 15, // Adds spacing on the left and right of each button
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
    fontSize: 16, // Sets the font size of the button text
    fontWeight: "bold", // Makes the button text bold
    textAlign: "center", // Aligns the text to the center horizontally
  },
  separator: {
    width: 1, // Width of the separator line
    backgroundColor: "#ccc", // Color of the separator
    height: "900%", // Adjust height of the line
    alignSelf: "center", // Centers the separator vertically
  },
});