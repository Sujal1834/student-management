import axios from "axios";
import { getRefreshToken, setAccessToken } from "./token";

export const refreshAccessToken = async () => {
  const refresh = getRefreshToken();

  if (!refresh) throw new Error("No refresh token");

  const res = await axios.post(
    "http://127.0.0.1:8000/token/refresh/",
    { refresh_token: refresh }
  );

  setAccessToken(res.data.access_token);
  return res.data.access;
};
