import { AUTH_STORAGE_KEYS } from "@/constants";

interface TokenPayload {
  readonly userId: string;
  readonly role: string;
  readonly exp: number;
  readonly iat: number;
}

export const isTokenExpired = (token: string): boolean => {
  if (!token) return true;

  try {
    const payload = getTokenPayload(token);
    if (!payload) return true;

    return payload.exp < Math.floor(Date.now() / 1000);
  } catch {
    return true;
  }
};

export const getTokenPayload = (token: string): TokenPayload | null => {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payload = JSON.parse(atob(parts[1])) as TokenPayload;
    return payload;
  } catch {
    return null;
  }
};

export const getStoredToken = (): string | null => {
  try {
    return localStorage.getItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
  } catch {
    return null;
  }
};

export const getStoredRefreshToken = (): string | null => {
  try {
    return localStorage.getItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN);
  } catch {
    return null;
  }
};

export const setStoredTokens = (token: string, refreshToken: string): void => {
  try {
    localStorage.setItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN, token);
    localStorage.setItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
  } catch (error) {
    console.error("Failed to store tokens:", error);
  }
};

export const clearStoredTokens = (): void => {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(AUTH_STORAGE_KEYS.USER);
  } catch (error) {
    console.error("Failed to clear tokens:", error);
  }
};
