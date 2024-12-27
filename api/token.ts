import { CLIENT_ID, CLIENT_SECRET } from '@/constants/Token';
import axios from 'axios';

interface SpotifyToken {
    access_token: string;
    token_type: string;
    expires_in: number;
}

export async function getSpotifyToken(): Promise<SpotifyToken> {
    console.log("getSpotifyToken called");
    const response = await axios.post('https://accounts.spotify.com/api/token', null, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')
        },
        params: {
            grant_type: 'client_credentials'
        }
    });


    console.log("getSpotifyToken finished");
    return response.data;
}
