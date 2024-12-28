import axios from "axios";
import { getSpotifyToken } from "./token";
import { TrackObject } from "./object";

export async function getTrack({ track_id }: { track_id: string }): Promise<TrackObject> {
  try {
    const token = await getSpotifyToken();
    const response = await axios.get(`https://api.spotify.com/v1/tracks/${track_id}`, {
      headers: {
        Authorization: `Bearer ${token.access_token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching track data:", error);
    throw error;
  }
}