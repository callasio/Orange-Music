import { HISTORY_KEY } from "@/constants/Keys";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { StyleSheet, Text, View, Image, TouchableOpacity, Pressable } from "react-native";
import Animated from "react-native-reanimated";

export interface ItemInfo {
  name: string;
  artist?: string;
  image: string;
  id: string;
}

export interface ElementProps {
    item: ItemInfo;
    type: "track" | "album" | "artist" | "playlist";
}

export default function Element({
    item,
    type,
    onHistoryUpdate = () => {},
    isHistory = false,
}: ElementProps & { onHistoryUpdate?: () => void, isHistory?: boolean }) {
  const router = useRouter();

  return (
    <Pressable 
      onPress={() => {
          AsyncStorage.getItem(HISTORY_KEY).then((history) => {
            const notNullHistory = history ? JSON.parse(history) as ElementProps[] : [];
            const updatedHistory = [{item, type}, ...notNullHistory];
            const validHistory = updatedHistory.filter((item, index) => updatedHistory.findIndex((value) => value.item.id === item.item.id) === index).slice(0, 49);
            AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(validHistory)).then(onHistoryUpdate);
          });
          router.push({
            pathname: `/pages/${type}`,
            params: { ...item },
          });
        }
      }
      style={({ pressed }) => [styles.playlistItem, { backgroundColor: pressed ? "#f0f0f0" : "#ffffff" }]}>
        <Image source={{ uri: item.image }} style={styles.playlistImage} />
        <View style={{ flex: 1}}>
            <Text style={styles.songName}>{item.name}</Text>
            {item.artist && <Text style={styles.artistName}>{(
              isHistory ? `${type.charAt(0).toUpperCase() + type.slice(1)} \u00B7 ` : ""
            ) + item.artist}</Text>}
        </View>
    </Pressable>
  );
}


const styles = StyleSheet.create({
 
  playlistItem: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  
  playlistImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 10,
    alignSelf:"center",
  },
  songName: {
    fontSize: 16,
    fontWeight: "bold",
    flexWrap: "wrap",
    marginBottom: 2,
  },
  artistName: {
    fontSize: 14,
    color: "#666",
    flexWrap: "wrap",
  }
});