import axios from "axios";

// Centralized token refresh state
interface QueuedRequest {
  resolve: (token: string) => void;
  reject: (error: any) => void;
}

let isRefreshing = false;
let failedQueue: QueuedRequest[] = [];
let refreshPromise: Promise<string> | null = null;

// Add request to queue while refresh is in progress
const addToQueue = (
  resolve: (token: string) => void,
  reject: (error: any) => void
): void => {
  failedQueue.push({ resolve, reject });
};

// Process all queued requests with new token

const processQueue = (error: any = null, token: string | null = null): void => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else if (token) {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

// Clear auth state and redirect to login

const clearAuthAndRedirect = (): void => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");

  // Redirect to login if not already there
  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
};

// Centralized token refresh function

export const refreshAccessToken = async (): Promise<string> => {
  // If already refreshing, wait for that to complete
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  // Start new refresh
  isRefreshing = true;
  refreshPromise = new Promise<string>(async (resolve, reject) => {
    try {
      const response = await axios.post(
        `${
          import.meta.env.VITE_API_URL || "http://localhost:4000/api"
        }/auth/refresh-token`,
        {}, // Empty body - backend should read refresh token from httpOnly cookie
        {
          withCredentials: true, // Critical: send cookies
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const { accessToken, refreshToken } = response.data.data;

      // Update localStorage
      localStorage.setItem("accessToken", accessToken);
      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }

      // Process queued requests
      processQueue(null, accessToken);

      isRefreshing = false;
      refreshPromise = null;
      resolve(accessToken);
    } catch (error) {
      // Clear queue with error
      processQueue(error, null);

      // Clear auth state
      clearAuthAndRedirect();

      isRefreshing = false;
      refreshPromise = null;
      reject(error);
    }
  });

  return refreshPromise;
};

// Wait for ongoing refresh to complete

export const waitForTokenRefresh = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    addToQueue(resolve, reject);
  });
};

// Check if currently refreshing

export const isTokenRefreshing = (): boolean => {
  return isRefreshing;
};
