import { AlbumObject, ArtistObject, PlaylistObject, TrackObject } from "@/api/object";
import { SearchResponse } from "@/api/search";
import { FlatList, Image, Text, View } from "react-native";
import CardElement from "./CardElement";

interface SearchResultProps {
    data: SearchResponse;
    type: 'track' | 'album' | 'artist' | 'playlist';
    onEndReached: () => void;
}

export default function SearchResult({
    data,
    type,
    onEndReached,
}: SearchResultProps) {
    return (
        <FlatList
            onEndReached={onEndReached}
            onEndReachedThreshold={0.5}
            keyExtractor={(item, index) => index.toString()}
            data={(data[`${type}s`]?.items as (TrackObject | AlbumObject | ArtistObject | PlaylistObject)[] ?? []).filter((item) => item !== null)}
            renderItem={({ item }) => {
                return <CardElement item={{
                    name: item.name,
                    image: (type === 'track'
                        ? (item as TrackObject)?.album?.images[0]?.url
                        : (item as AlbumObject | ArtistObject | PlaylistObject)?.images[0]?.url)
                        ?? 'https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/Spotify_Primary_Logo_RGB_Green.png',
                    artist: type === 'artist' ? undefined : 
                                type !== 'playlist' 
                                ? (item as TrackObject | AlbumObject).artists.map((artist) => artist.name).join(', ')
                                : (item as PlaylistObject).owner.display_name,
                    id: item.id,
                }} type={type} />
            }}
        />
    );
}