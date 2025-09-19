import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  exp: number;
  iat: number;
  userId: string;
  role: string;
}

//Check if token is expired or will expire within buffer time

export const isTokenExpired = (
  token: string,
  bufferTimeInSeconds: number = 300
): boolean => {
  if (!token) return true;

  try {
    const decoded = jwtDecode<DecodedToken>(token);
    const currentTime = Date.now() / 1000;
    const expiryTime = decoded.exp;

    return currentTime >= expiryTime - bufferTimeInSeconds;
  } catch (error) {
    console.error("Error decoding token:", error);
    return true;
  }
};

//Get token expiry time in milliseconds

export const getTokenExpiryTime = (token: string): number | null => {
  if (!token) return null;

  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return decoded.exp * 1000;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

// Calculate time until token expires in milliseconds

export const getTimeUntilTokenExpiry = (token: string): number | null => {
  const expiryTime = getTokenExpiryTime(token);
  if (!expiryTime) return null;

  return Math.max(0, expiryTime - Date.now());
};
