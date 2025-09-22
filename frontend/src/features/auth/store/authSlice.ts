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
import { errorHandler, AuthContext } from "../../../shared/utils/errorUtils";

const getAccessTokenFromStorage = (): string | null => {
  if (typeof window !== "undefined") {
    try {
      const token = localStorage.getItem("accessToken");
      if (token && !isTokenExpired(token)) {
        return token;
      }
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

interface DecodedJwt {
  userId: string;
  role: string;
  iat?: number;
  exp?: number;
  aud?: string;
  iss?: string;
}

// Add defaults for missing fields
const mapDecodedToUser = (decoded: DecodedJwt): User => ({
  id: decoded.userId,
  email: "",
  name: "",
  role: decoded.role as any,
  isVerified: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

export const refreshAuthToken = createAsyncThunk(
  "auth/refresh",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const result = await dispatch(
        authApi.endpoints.refreshToken.initiate()
      ).unwrap();

      console.log("Raw refresh result:", result);

      const accessToken = result.data?.accessToken;
      const refreshToken = result.data?.refreshToken;

      if (!accessToken || !refreshToken) {
        throw new Error("Invalid refresh response structure");
      }

      setTokensInStorage(accessToken, refreshToken);
      console.log("Tokens stored in localStorage:", {
        accessToken,
        refreshToken,
      });

      dispatch(setupAutoRefresh(accessToken));

      return {
        accessToken,
        refreshToken,
        data: { accessToken, refreshToken },
      };
    } catch (error: any) {
      console.error("Refresh token failed:", error);
      removeTokensFromStorage();
      dispatch(clearAutoRefresh());
      return rejectWithValue(error.message || "Token refresh failed");
    }
  }
);

export const setupAutoRefresh = createAsyncThunk(
  "auth/setupAutoRefresh",
  async (accessToken: string, { dispatch }) => {
    // Clear existing timer
    if (refreshTimerId) {
      clearTimeout(refreshTimerId);
    }

    const timeUntilExpiry = getTimeUntilTokenExpiry(accessToken);

    if (timeUntilExpiry) {
      // Refresh 2 minutes before expiry
      const refreshTime = Math.max(timeUntilExpiry - 2 * 60 * 1000, 60000);

      refreshTimerId = setTimeout(() => {
        dispatch(refreshAuthToken());
      }, refreshTime);
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

export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const result = await dispatch(
        authApi.endpoints.getCurrentUser.initiate()
      ).unwrap();

      if (result.success) {
        const userData = result.data;
        setUserInStorage(userData);
        return userData;
      } else {
        throw new Error("Failed to fetch user");
      }
    } catch (error: any) {
      console.error("Fetch current user failed:", error);
      return rejectWithValue(error.message || "Failed to fetch user details");
    }
  }
);

export const initializeAuth = createAsyncThunk(
  "auth/initialize",
  async (_, { dispatch }) => {
    const accessToken = getAccessTokenFromStorage();
    const refreshToken = getRefreshTokenFromStorage();
    const user = getUserFromStorage();

    if (accessToken && refreshToken && user) {
      dispatch(setupAutoRefresh(accessToken));
      return { user, accessToken, refreshToken };
    }

    if (accessToken && refreshToken) {
      try {
        const userData = await dispatch(fetchCurrentUser()).unwrap();
        dispatch(setupAutoRefresh(accessToken));

        return {
          user: userData,
          accessToken,
          refreshToken,
        };
      } catch (error) {
        console.error("Failed to fetch user during init:", error);
        try {
          const decoded = jwtDecode<DecodedJwt>(accessToken);
          const fallbackUser = mapDecodedToUser(decoded);
          setUserInStorage(fallbackUser);
          dispatch(setupAutoRefresh(accessToken));

          return {
            user: fallbackUser,
            accessToken,
            refreshToken,
          };
        } catch (decodeError) {
          console.error("JWT decode also failed:", decodeError);
          removeTokensFromStorage();
        }
      }
    }

    if (refreshToken) {
      try {
        const result = await dispatch(refreshAuthToken()).unwrap();

        const newAccessToken = result.data?.accessToken;
        const newRefreshToken = result.data?.refreshToken;

        if (!newAccessToken) {
          throw new Error("No access token in refresh response");
        }

        try {
          const userData = await dispatch(fetchCurrentUser()).unwrap();
          dispatch(setupAutoRefresh(newAccessToken));

          return {
            user: userData,
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
          };
        } catch (userError) {
          console.error(
            "Failed to fetch user after refresh, using JWT fallback:",
            userError
          );
          const decoded = jwtDecode<DecodedJwt>(newAccessToken);
          const fallbackUser = mapDecodedToUser(decoded);
          setUserInStorage(fallbackUser);
          dispatch(setupAutoRefresh(newAccessToken));

          return {
            user: fallbackUser,
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
          };
        }
      } catch (error) {
        console.error("Token refresh during init failed:", error);
        removeTokensFromStorage();
      }
    }

    return null;
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

// Initial state - removed error property
const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true,
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

      setTokensInStorage(accessToken, refreshToken);
      setUserInStorage(user);
      
      // Clear any auth errors on successful login
      errorHandler.clearAuthErrors(AuthContext.LOGIN);
    },

    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.isLoading = false;

      removeTokensFromStorage();

      // Clear all auth-related errors
      errorHandler.clearAuthErrors(AuthContext.LOGIN);
      errorHandler.clearAuthErrors(AuthContext.SIGNUP);
      errorHandler.clearAuthErrors(AuthContext.OTP_VERIFICATION);
      errorHandler.clearAuthErrors(AuthContext.PASSWORD_RESET);
      errorHandler.clearAuthErrors(AuthContext.PASSWORD_UPDATE);
      errorHandler.clearAuthErrors(AuthContext.GOOGLE_AUTH);

      if (refreshTimerId) {
        clearTimeout(refreshTimerId);
        refreshTimerId = null;
      }
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
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

    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        // loading
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        if (state.accessToken) {
          state.isAuthenticated = true;
        }
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        console.warn("Failed to fetch current user:", action.payload);
      });

    // Refresh token
    builder
      .addCase(refreshAuthToken.fulfilled, (state, action) => {
        const accessToken = action.payload.accessToken;
        const refreshToken = action.payload.refreshToken;

        state.accessToken = accessToken;
        state.refreshToken = refreshToken;
      })
      .addCase(refreshAuthToken.rejected, (state, action) => {
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
      });

    // Google Auth
    builder
      .addCase(initiateGoogleAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(initiateGoogleAuth.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(initiateGoogleAuth.rejected, (state, action) => {
        state.isLoading = false;
      })
      .addCase(handleGoogleCallback.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(handleGoogleCallback.fulfilled, (state, action) => {
        const { user, accessToken, refreshToken } = action.payload;
        state.user = user;
        state.accessToken = accessToken;
        state.refreshToken = refreshToken;
        state.isAuthenticated = true;
        state.isLoading = false;

        setTokensInStorage(accessToken, refreshToken);
        setUserInStorage(user);
        
        // Clear Google auth errors on success
        errorHandler.clearAuthErrors(AuthContext.GOOGLE_AUTH);
      })
      .addCase(handleGoogleCallback.rejected, (state, action) => {
        state.isLoading = false;
      });

    // Handle auth API responses - preserved all functionality, added error cleanup
    builder
      .addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
        const { user, accessToken, refreshToken } = action.payload.data;
        state.user = user;
        state.accessToken = accessToken;
        state.refreshToken = refreshToken;
        state.isAuthenticated = true;
        state.isLoading = false;

        setTokensInStorage(accessToken, refreshToken);
        setUserInStorage(user);
        
        // Clear login errors on successful login
        errorHandler.clearAuthErrors(AuthContext.LOGIN);
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

          setTokensInStorage(accessToken, refreshToken);
          setUserInStorage(user);
          
          // Clear OTP errors on successful verification
          errorHandler.clearAuthErrors(AuthContext.OTP_VERIFICATION);
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

          setTokensInStorage(accessToken, refreshToken);
          setUserInStorage(user);
          
          // Clear Google auth errors on successful callback
          errorHandler.clearAuthErrors(AuthContext.GOOGLE_AUTH);
        }
      )
      .addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.isLoading = false;

        removeTokensFromStorage();
      });
  },
});

export const {
  loginSuccess,
  logout,
  setLoading,
  updateUser,
  setGoogleAuthLoading,
} = authSlice.actions;

export default authSlice.reducer;