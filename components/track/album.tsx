import { album } from "@/api/album";
import { useEffect, useState } from "react";
import { ActivityIndicator, View, Text, FlatList, Pressable } from "react-native";
import CardElement from "../CardElement";
import { useRouter } from "expo-router";

export default function AlbumPreview({
    id,
}: {
    id: string;
}) {
  const router = useRouter();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchAlbum = async () => {
    const newData = await album({ id });
    setData(newData);
    setLoading(false);
  };

    useEffect(() => {
        fetchAlbum();
    }, []);

  return (
    <View style={{ borderRadius: 10, backgroundColor: 'white', overflow: 'hidden', borderWidth: 1, borderColor: 'black' }}>
        {loading ? (
            <View>
                <ActivityIndicator />
            </View>
        ) : (
            <View>
                <FlatList data={data.tracks.items.slice(0, 3)} 
                    scrollEnabled={false}
                    keyExtractor={(item, index) => `${item.id}+${index}`}
                    renderItem={({ item, index }) => (
                        <CardElement item={{
                            id: item.id,
                            name: item.name,
                            artist: item.artists.map((artist: any) => artist.name).join(", "),
                            image: data!.images[0].url || "https://via.placeholder.com/150",
                        }} type="track"/>
                    )} 
                />
                <Pressable
                    style={({ pressed }) => [{
                        padding: 10,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }, { backgroundColor: pressed ? "#f0f0f0" : "#ffffff" }]}
                    
                    onPress={() => {
                        router.push({
                            pathname: '/pages/album',
                            params: { id: data.id, name: data.name, image: data.images[0].url },
                        });
                    }}
                >
                    <Text style={{
                        color: "#007AFF",
                        fontSize: 16,
                        fontWeight: "bold",
                    }}>See More</Text>
                </Pressable>
            </View>
        )}
    </View>
  );
}