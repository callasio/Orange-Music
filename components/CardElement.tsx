import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";

interface ElementProps {
    item: any;
    type: "track" | "album" | "artist" | "playlist";
}

export default function Element({
    item,
    type,
}: ElementProps) {
  return (
    <View style={styles.playlistItem}>
        <Image source={{ uri: item.image }} style={styles.playlistImage} />
        <View>
            <Text style={styles.songName}>{item.name}</Text>
            <Text style={styles.artistName}>{item.artist}</Text>
        </View>
    </View>
  );
}


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
    marginBottom: 20,
    textAlign: "center",
    paddingHorizontal: 20,
  },
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
  },
  backButton: {
    marginTop: 20,
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