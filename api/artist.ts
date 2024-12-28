import axios from "axios";
import { getSpotifyToken } from "./token";

export async function getArtist({ artist_id }: { artist_id: string }): Promise<any> {
  try {
    const token = await getSpotifyToken();
    const response = await axios.get(`https://api.spotify.com/v1/artists/${artist_id}`, {
      headers: {
        Authorization: `Bearer ${token.access_token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching artist data:", error);
    throw error;
  }
}