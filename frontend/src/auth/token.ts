import { jwtDecode } from "jwt-decode";

export const getAccessToken = () =>
  localStorage.getItem("access_token");

export const getRefreshToken = () =>
  localStorage.getItem("refresh_token");

export const setAccessToken = (token: string) =>
  localStorage.setItem("access_token", token);

export const isTokenExpired = (token: string) => {
  try {
    const decoded: any = jwtDecode(token);
    return decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};
