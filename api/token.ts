import { CLIENT_ID, CLIENT_SECRET } from '@/constants/Token';
import axios from 'axios';

interface SpotifyToken {
    access_token: string;
    token_type: string;
    expires_in: number;
}

let lastToken: { token: SpotifyToken | null, time: number } = {
    token: null,
    time: 0
};

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

export async function getSpotifyToken(expired: boolean = false): Promise<SpotifyToken> {
    if (!expired && lastToken.token && Date.now() - lastToken.time < lastToken.token.expires_in * 1000) {
        return lastToken.token;
    }
    const token = await fetchSpotifyToken();
    lastToken = { token, time: Date.now() };
    return token;
}
