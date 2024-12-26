export interface AlbumObject {
    album_type: "album" | "single" | "compilation";
    artists: {
        external_urls: {
            spotify: string;
        };
        href: string;
        id: string;
        name: string;
        type: string;
        uri: string;
    }[];
    available_markets: string[];
    external_urls: {
        spotify: string;
    };
    href: string;
    id: string;
    images: {
        height: number;
        url: string;
        width: number;
    }[];
    name: string;
    release_date: string;
    release_date_precision: "year" | "month" | "day";
    restrictions: {
        reason: "market" | "product" | "explicit";
    };
    total_tracks: number;
    type: "album";
    uri: string;
}

interface ExternalIdObject {
    isrc: string;
    ean: string;
    upc: string;
}

interface ExternalUrlObject {
    spotify: string;
}

export interface TrackObject {
    album: AlbumObject;
    artists: {
        external_urls: ExternalUrlObject;
        href: string;
        id: string;
        name: string;
        type: string;
        uri: string;
    }[];
    available_markets: string[];
    disc_number: number;
    duration_ms: number;
    explicit: boolean;
    external_ids: ExternalIdObject;
    external_urls: ExternalUrlObject;
    href: string;
    id: string;
    name: string;
    popularity: number;
    track_number: number;
    type: string;
    uri: string;
}

export interface ArtistObject {
    external_urls: ExternalUrlObject;
    followers: {
        href: string | null;
        total: number;
    };
    genres: string[];
    href: string;
    id: string;
    images: {
        height: number;
        url: string;
        width: number;
    }[];
    name: string;
    popularity: number;
    type: "artist";
    uri: string;
}

export interface PlaylistObject {
    collaborative: boolean;
    description: string;
    external_urls: ExternalUrlObject;
    href: string;
    id: string;
    images: {
        height: number;
        url: string;
        width: number;
    }[];
    name: string;
    owner: {
        display_name: string;
        external_urls: ExternalUrlObject;
        href: string;
        id: string;
        type: string;
        uri: string;
    };
    primary_color: string | null;
    public: boolean;
    snapshot_id: string;
    tracks: {
        href: string;
        total: number;
    };
    type: "playlist";
    uri: string;
}