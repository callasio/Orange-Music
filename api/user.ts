import axios from "axios";
import { getSpotifyToken } from "./token"; // Spotify 토큰 가져오기 함수

export async function getUser({ id }: { id: string }): Promise<any> {
  try {
    const token = await getSpotifyToken(); // Spotify API 토큰 가져오기
    const response = await axios.get(`https://api.spotify.com/v1/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token.access_token}`, // 인증 토큰
      },
    });
    return response.data; // 플레이리스트 데이터 반환
  } catch (error) {
    console.error("Error fetching playlist data:", error);
    throw error;
  }
}
