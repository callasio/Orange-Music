import axios from "axios";
import { getSpotifyToken } from "./token"; // Spotify 토큰 가져오기 함수

export async function userSavedTrackMultipleUsers(user_ids: string[]): Promise<any[]> {
  try {
    const token = await getSpotifyToken(); // Spotify API 토큰 가져오기
    const allPlaylists: any[] = []; // To store combined results

    for (const user_id of user_ids) {
      //console.log(`Fetching playlists for user: ${user_id}`);

      const response = await axios.get(`https://api.spotify.com/v1/users/${user_id}/playlists`, {
        headers: {
          Authorization: `Bearer ${token.access_token}`, // 인증 토큰
        },
      });

      const mappedData = response.data.items.map((item: any) => ({
        name: item.name,
        image: item.images[0]?.url || "https://via.placeholder.com/150",
        id: item.id,
        user: user_id, // Include user ID for reference
      }));

      allPlaylists.push(...mappedData); // Combine playlists
    }

    //console.log("All Fetched Playlists:", allPlaylists);
    return allPlaylists;
  } catch (error: any) {
    console.error("Error fetching playlists for users:", error.message);

    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
      console.error("Response headers:", error.response.headers);
    }

    throw new Error("Failed to fetch playlists for users");
  }
}

export default userSavedTrackMultipleUsers; // Ensure proper default export if needed
