import { CLIENT_ID, CLIENT_SECRET } from '@/constants/Token';
import axios from 'axios';

interface SpotifyToken {
    access_token: string;
    token_type: string;
    expires_in: number;
}

let lastSession: { token: SpotifyToken, timestamp: number } | null = null;

async function fetchSpotifyToken(): Promise<SpotifyToken> {
    const response = await axios.post('https://accounts.spotify.com/api/token', null, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')
        },
        params: {
            grant_type: 'client_credentials'
        }
    });

    return response.data;
}


export async function getSpotifyToken(): Promise<SpotifyToken> {
    if (lastSession === null || Date.now() - lastSession.timestamp > lastSession.token.expires_in * 1000) {
        lastSession = {
            token: await fetchSpotifyToken(),
            timestamp: Date.now()
        };
    }

    return lastSession.token;
}