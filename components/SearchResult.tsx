import { AlbumObject, ArtistObject, PlaylistObject, TrackObject } from "@/api/object";
import { SearchResponse } from "@/api/search";
import { FlatList, Image, Text, View } from "react-native";

interface SearchResultProps {
    data: SearchResponse;
    type: 'track' | 'album' | 'artist' | 'playlist';
}

export default function SearchResult({
    data,
    type,
}: SearchResultProps) {
    return (
        <FlatList
            data={(data[`${type}s`].items as (TrackObject | AlbumObject | ArtistObject | PlaylistObject)[]).filter((item) => item !== null)}
            renderItem={({ item }) => {
                return <View style={{ 
                    flexDirection: 'row',
                    padding: 10,
                    gap: 10,
                }}>
                    <Image
                        style={{
                            width: 50,
                            height: 50,
                            borderRadius: 5,
                        }}
                        source={{
                            uri: (type === 'track'
                                ? (item as TrackObject)?.album?.images[0]?.url
                                : (item as AlbumObject | ArtistObject | PlaylistObject)?.images[0]?.url)
                                ?? 'https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/Spotify_Primary_Logo_RGB_Green.png'
                        }}
                    />
                    <View style={{
                        flexDirection: 'column',
                        gap: 10,
                    }}>
                        <Text
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            style={{ width: '100%' }}
                        >{item.name}</Text>
                        {type !== 'artist' &&
                            <Text
                                numberOfLines={1}
                                ellipsizeMode="tail"
                                style={{ width: '100%' }}>{
                                type !== 'playlist' 
                                ? (item as TrackObject | AlbumObject).artists.map((artist) => artist.name).join(', ')
                                : (item as PlaylistObject).owner.display_name}
                            </Text>
                        }
                    </View>
                </View>
            }}
        />
    );
}