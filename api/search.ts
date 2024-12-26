import axios from "axios";
import { getSpotifyToken } from "./token";
import { AlbumObject, ArtistObject, PlaylistObject, TrackObject } from "./object";

interface SearchParameters {
    query: string;
    type: ["album", "artist", "playlist", "track"];
    market?: string;
    limit?: number;
    offset?: number;
    include_external?: "audio";
}

interface SearchResponseHeader {
    href: string;
    limit: number;
    next: string | null;
    offset: number;
    previous: string | null;
    total: number;
}

interface SearchResponse {
    tracks: SearchResponseHeader & { items: TrackObject[] };
    albums: SearchResponseHeader & { items: AlbumObject[] };
    artists: SearchResponseHeader & { items: ArtistObject[] };
    playlists: SearchResponseHeader & { items: PlaylistObject[] };
}

export async function search({ 
    query,
    type,
    market,
    limit,
    offset,
    include_external,
}: SearchParameters): Promise<SearchResponse> {
    const token = await getSpotifyToken();

    const response = await axios.get('https://api.spotify.com/v1/search', {
        headers: {
            'Authorization': 'Bearer ' + token.access_token
        },
        params: {
            q: query,
            type: type.join(','),
            market: market ?? 'US',
            limit: limit ?? 20,
            offset: offset ?? 0,
            include_external: include_external ?? null,
        }
    });

    return response.data;
}
