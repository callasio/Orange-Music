import { StyleSheet, Text, View, Image, TouchableOpacity, Pressable } from "react-native";

interface Item {
  name: string;
  artist?: string;
  image: string;
}

interface ElementProps {
    item: Item;
    type: "track" | "album" | "artist" | "playlist";
}

export default function Element({
    item,
    type,
}: ElementProps) {
  return (
    <Pressable 
      style={({ pressed }) => [styles.playlistItem, { backgroundColor: pressed ? "#f0f0f0" : "#ffffff" }]}>
        <Image source={{ uri: item.image }} style={styles.playlistImage} />
        <View>
            <Text style={styles.songName}>{item.name}</Text>
            {item.artist && <Text style={styles.artistName}>{item.artist}</Text>}
        </View>
    </Pressable>
  );
}


const styles = StyleSheet.create({
 
  playlistItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  playlistImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 10,
  },
  songName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  artistName: {
    fontSize: 14,
    color: "#666",
  }
});