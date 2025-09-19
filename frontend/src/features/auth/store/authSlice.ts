/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { authApi } from "../services/authApi";
import type { AuthState, User } from "../types";
import { GoogleAuthService } from "../services/googleAuthService";
import { jwtDecode } from "jwt-decode";
import {
  isTokenExpired,
  getTimeUntilTokenExpiry,
} from "../../../shared/utils/tokenUtils";

// Token utilities
const getAccessTokenFromStorage = (): string | null => {
  if (typeof window !== "undefined") {
    try {
      const token = localStorage.getItem("accessToken");
      // Validate token before returning
      if (token && !isTokenExpired(token)) {
        return token;
      }
      // Remove expired token
      if (token) {
        localStorage.removeItem("accessToken");
      }
      return null;
    } catch {
      return null;
    }
  }
  return null;
};

export const getRefreshTokenFromStorage = (): string | null => {
  if (typeof window !== "undefined") {
    try {
      return localStorage.getItem("refreshToken");
    } catch {
      return null;
    }
  }
  return null;
};

const setTokensInStorage = (accessToken: string, refreshToken: string) => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
    } catch (error) {
      console.error("Failed to store tokens:", error);
    }
  }
};

const removeTokensFromStorage = () => {
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
    } catch (error) {
      console.error("Failed to remove tokens:", error);
    }
  }
};

const getUserFromStorage = (): User | null => {
  if (typeof window !== "undefined") {
    try {
      const userStr = localStorage.getItem("user");
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  }
  return null;
};

const setUserInStorage = (user: User) => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("user", JSON.stringify(user));
    } catch (error) {
      console.error("Failed to store user:", error);
    }
  }
};

// Auto-refresh timer ID
let refreshTimerId: NodeJS.Timeout | null = null;

// Async thunks
export const initializeAuth = createAsyncThunk(
  "auth/initialize",
  async (_, { dispatch }) => {
    const accessToken = getAccessTokenFromStorage();
    const refreshToken = getRefreshTokenFromStorage();
    const user = getUserFromStorage();

    if (accessToken && refreshToken && user) {
      // Setup auto-refresh timer
      dispatch(setupAutoRefresh(accessToken));
      return { user, accessToken, refreshToken };
    }

    if (refreshToken) {
      try {
        // Try to refresh token
        const result = await dispatch(refreshAuthToken()).unwrap();

        // Get user info with new token
        const userResult = await dispatch(
          authApi.endpoints.getCurrentUser.initiate()
        ).unwrap();

        if (userResult.success) {
          setUserInStorage(userResult.data);
          dispatch(setupAutoRefresh(result.accessToken));
          return {
            user: userResult.data,
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
          };
        }
      } catch (error) {
        removeTokensFromStorage();
      }
    }

    return null;
  }
);
export const refreshAuthToken = createAsyncThunk(
  "auth/refresh",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const result = await dispatch(
        authApi.endpoints.refreshToken.initiate()
      ).unwrap();

      setTokensInStorage(result.accessToken, result.refreshToken);

      // Setup new auto-refresh timer
      dispatch(setupAutoRefresh(result.accessToken));

      return result;
    } catch (error: any) {
      removeTokensFromStorage();
      dispatch(clearAutoRefresh());
      return rejectWithValue(error.message || "Token refresh failed");
    }
  }
);

// Auto-refresh setup
export const setupAutoRefresh = createAsyncThunk(
  "auth/setupAutoRefresh",
  async (accessToken: string, { dispatch }) => {
    // Clear existing timer
    if (refreshTimerId) {
      clearTimeout(refreshTimerId);
    }

    const timeUntilExpiry = getTimeUntilTokenExpiry(accessToken);

    if (timeUntilExpiry) {
      // Refresh 5 minutes before expiry
      const refreshTime = Math.max(timeUntilExpiry - 5 * 60 * 1000, 60000); // At least 1 minute

      refreshTimerId = setTimeout(() => {
        dispatch(refreshAuthToken());
      }, refreshTime);

      console.log(
        `Auto-refresh scheduled in ${Math.round(refreshTime / 1000)} seconds`
      );
    }

    return { scheduled: true };
  }
);

export const clearAutoRefresh = createAsyncThunk(
  "auth/clearAutoRefresh",
  async () => {
    if (refreshTimerId) {
      clearTimeout(refreshTimerId);
      refreshTimerId = null;
    }
    return { cleared: true };
  }
);

export const initiateGoogleAuth = createAsyncThunk(
  "auth/initiateGoogleAuth",
  async (_, { rejectWithValue }) => {
    try {
      await GoogleAuthService.initiateGoogleLogin();
      return { redirected: true };
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Google authentication initiation failed"
      );
    }
  }
);

interface DecodedJwt {
  id: string;
  email: string;
  role: string;
  name?: string;
  status?: string;
}

// Add defaults for missing fields
const mapDecodedToUser = (decoded: DecodedJwt): User => ({
  id: decoded.id,
  email: decoded.email,
  name: decoded.name || "",
  role: decoded.role as any,
  isVerified: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

export const handleGoogleCallback = createAsyncThunk(
  "auth/handleGoogleCallback",
  async (
    {
      accessToken,
      refreshToken,
    }: { accessToken: string; refreshToken?: string },
    { rejectWithValue }
  ) => {
    if (!accessToken) {
      return rejectWithValue("Missing accessToken");
    }
    try {
      const decoded = jwtDecode<DecodedJwt>(accessToken);
      console.log("decoded:", decoded);
      const user = mapDecodedToUser(decoded);
      return { user, accessToken, refreshToken: refreshToken || "" };
    } catch (e) {
      return rejectWithValue("Invalid accessToken");
    }
  }
);

// Initial state
const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (
      state,
      action: PayloadAction<{
        user: User;
        accessToken: string;
        refreshToken: string;
      }>
    ) => {
      const { user, accessToken, refreshToken } = action.payload;
      state.user = user;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;

      setTokensInStorage(accessToken, refreshToken);
      setUserInStorage(user);
    },

    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;

      removeTokensFromStorage();

      // Clear auto-refresh timer
      if (refreshTimerId) {
        clearTimeout(refreshTimerId);
        refreshTimerId = null;
      }
    },

    clearError: (state) => {
      state.error = null;
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        setUserInStorage(state.user);
      }
    },

    setGoogleAuthLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },

  extraReducers: (builder) => {
    // Initialize auth
    builder
      .addCase(initializeAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        if (action.payload) {
          const { user, accessToken, refreshToken } = action.payload;
          state.user = user;
          state.accessToken = accessToken;
          state.refreshToken = refreshToken;
          state.isAuthenticated = true;
        }
        state.isLoading = false;
      })
      .addCase(initializeAuth.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
      });

    // Refresh token
    builder
      .addCase(refreshAuthToken.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.error = null;
      })
      .addCase(refreshAuthToken.rejected, (state, action) => {
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      });

    // Google Auth
    builder
      .addCase(initiateGoogleAuth.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(initiateGoogleAuth.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(initiateGoogleAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(handleGoogleCallback.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(handleGoogleCallback.fulfilled, (state, action) => {
        const { user, accessToken, refreshToken } = action.payload;
        state.user = user;
        state.accessToken = accessToken;
        state.refreshToken = refreshToken;
        state.isAuthenticated = true;
        state.isLoading = false;
        state.error = null;

        setTokensInStorage(accessToken, refreshToken);
        setUserInStorage(user);
      })
      .addCase(handleGoogleCallback.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Handle auth API responses
    builder
      .addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
        const { user, accessToken, refreshToken } = action.payload.data;
        state.user = user;
        state.accessToken = accessToken;
        state.refreshToken = refreshToken;
        state.isAuthenticated = true;
        state.isLoading = false;
        state.error = null;

        setTokensInStorage(accessToken, refreshToken);
        setUserInStorage(user);
      })
      .addMatcher(authApi.endpoints.login.matchRejected, (state, action) => {
        state.error = action.error.message || "Login failed";
        state.isLoading = false;
      })
      .addMatcher(
        authApi.endpoints.verifyOTP.matchFulfilled,
        (state, action) => {
          const { user, accessToken, refreshToken } = action.payload.data;
          state.user = user;
          state.accessToken = accessToken;
          state.refreshToken = refreshToken;
          state.isAuthenticated = true;
          state.isLoading = false;
          state.error = null;

          setTokensInStorage(accessToken, refreshToken);
          setUserInStorage(user);
        }
      )
      .addMatcher(
        authApi.endpoints.handleGoogleCallback.matchFulfilled,
        (state, action) => {
          const { user, accessToken, refreshToken } = action.payload.data;
          state.user = user;
          state.accessToken = accessToken;
          state.refreshToken = refreshToken;
          state.isAuthenticated = true;
          state.isLoading = false;
          state.error = null;

          setTokensInStorage(accessToken, refreshToken);
          setUserInStorage(user);
        }
      )
      .addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = null;

        removeTokensFromStorage();
      });
  },
});

export const {
  loginSuccess,
  logout,
  clearError,
  setLoading,
  setError,
  updateUser,
  setGoogleAuthLoading,
} = authSlice.actions;

export default authSlice.reducer;
