import axios from "axios";
import {
  getAccessToken,
  isTokenExpired,
} from "../auth/token";
import { refreshAccessToken } from "../auth/refreshToken";

export const apiGet = async (url: string) => {
  let token = getAccessToken();

  // 🔄 If token expired → refresh first
  if (!token || isTokenExpired(token)) {
    token = await refreshAccessToken();
  }

  try {
    return await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error: any) {
    // 🔁 If backend still says 401 → try refresh once
    if (error.response?.status === 401) {
      token = await refreshAccessToken();
      return axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
    throw error;
  }
};
