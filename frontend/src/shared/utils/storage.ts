import type { User } from "@/features/auth/types";

// Token management
export const getStoredToken = (): string | null => {
  try {
    return localStorage.getItem("accessToken");
  } catch {
    return null;
  }
};

export const getStoredRefreshToken = (): string | null => {
  try {
    return localStorage.getItem("refreshToken");
  } catch {
    return null;
  }
};

export const setStoredTokens = (
  accessToken: string,
  refreshToken: string
): void => {
  try {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  } catch (error) {
    console.error("Failed to store tokens:", error);
  }
};

export const clearStoredTokens = (): void => {
  try {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  } catch (error) {
    console.error("Failed to clear tokens:", error);
  }
};

// User management
export const getStoredUser = (): User | null => {
  try {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
};

export const setStoredUser = (user: User): void => {
  try {
    localStorage.setItem("user", JSON.stringify(user));
  } catch (error) {
    console.error("Failed to store user:", error);
  }
};

export const clearStoredUser = (): void => {
  try {
    localStorage.removeItem("user");
  } catch (error) {
    console.error("Failed to clear user:", error);
  }
};
