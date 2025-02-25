import { Colors } from "@/constants/Colors";
import { HISTORY_KEY } from "@/constants/Keys";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, usePathname, useRouter } from "expo-router";
import { useEffect } from "react";
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
    onHistoryUpdate,
    isHistory = false,
    margin = true,
}: ElementProps & { onHistoryUpdate?: () => void, isHistory?: boolean, margin?: boolean }) {
  const router = useRouter();
  const currentPath = usePathname();

  return (
    <TouchableOpacity 
      onPress={() => {
          AsyncStorage.getItem(HISTORY_KEY).then((history) => {
            const notNullHistory = history ? JSON.parse(history) as ElementProps[] : [];
            const updatedHistory = [{item, type}, ...notNullHistory];
            const validHistory = updatedHistory.filter((item, index) => updatedHistory.findIndex((value) => value.item.id === item.item.id) === index).slice(0, 49);
            AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(validHistory)).then(onHistoryUpdate);
          });

          const newPath: "/pages/artist" | "/pages/playlist" | "/pages/track" | "/pages/album"  = `/pages/${type}`;

          if (currentPath !== newPath) {
            router.push({
              pathname: newPath,
              params: { ...item },
            })
          } else {
            router.replace({
              pathname: newPath,
              params: { ...item },
            })
          }
      }}
      style={{...styles.playlistItem,
        marginBottom: margin ? 8 : 0,
        borderRadius: margin ? 10 : 0,
        borderBottomWidth: margin ? 0 : 2,
        borderBottomColor: Colors.theme.background
      }}>
        <Image source={{ uri: item.image }} style={styles.playlistImage} />
        <View style={{ flex: 1}}>
            <Text style={styles.songName}>{item.name}</Text>
            {item.artist && <Text style={styles.artistName}>{(
              isHistory ? `${type.charAt(0).toUpperCase() + type.slice(1)} \u00B7 ` : ""
            ) + item.artist}</Text>}
        </View>
    </TouchableOpacity>
  );
}


const styles = StyleSheet.create({
 
  playlistItem: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: Colors.theme.secondary,
    //borderBottomWidth: 2,
    //borderBottomColor: Colors.theme.background,
    marginBottom:8,
    borderRadius: 10,
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
    color: Colors.theme.text,
    marginBottom: 2,
  },
  artistName: {
    fontSize: 14,
    color: "#BBB",
    flexWrap: "wrap",
  }
});