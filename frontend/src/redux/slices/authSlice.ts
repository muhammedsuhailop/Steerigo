import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { authService } from "@/services/authService";
import {
  setStoredTokens,
  setStoredUser,
  clearStoredTokens,
  clearStoredUser,
  getStoredUser,
  getStoredToken,
  getStoredRefreshToken,
} from "@/utils";
import type {
  AuthState,
  LoginCredentials,
  SignupCredentials,
  User,
  UserRole,
  LoginResponse,
  SignupResponse,
  VerifyOTPCredentials,
  RefreshTokenResponse,
} from "@/types";
import { log } from "@/utils/logger";

const initialState: AuthState = {
  user: null,
  token: getStoredToken(),
  refreshToken: getStoredRefreshToken(),
  isAuthenticated: false,
  isLoading: false,
  error: null,
  role: null,
  requiresOTPVerification: false,
  pendingVerificationEmail: null,
  passwordResetEmailSent: false,
};

function normalizeRole(role: string): UserRole {
  // Handle different case variations from the API
  const roleMap: Record<string, UserRole> = {
    rider: "Rider",
    Rider: "Rider",
    driver: "Driver",
    Driver: "Driver",
    admin: "Admin",
    Admin: "Admin",
  };

  return roleMap[role] || "Rider";
}

// Async Thunks with proper error handling
export const loginUser = createAsyncThunk<
  LoginResponse,
  LoginCredentials,
  { rejectValue: string }
>("/auth/login", async (credentials, { rejectWithValue }) => {
  try {
    log.info("Login attempt", { email: credentials.email });

    const response = await authService.login(credentials);

    // Normalize the role to match our UserRole type
    const normalizedResponse: LoginResponse = {
      ...response,
      data: {
        ...response.data,
        user: {
          ...response.data.user,
          role: normalizeRole(response.data.user.role),
        },
      },
    };

    // log.debug("Login response", normalizedResponse);
    return normalizedResponse;
  } catch (error) {
    console.error("📝 loginUser thunk catch:", {
      message: error.message,
      responseData: error.response?.data,
      status: error.response?.status,
    });

    const message = error instanceof Error ? error.message : "Login failed";
    return rejectWithValue(message);
  }
});

export const signupUser = createAsyncThunk<
  SignupResponse,
  SignupCredentials,
  { rejectValue: string }
>("/auth/signup", async (credentials, { rejectWithValue }) => {
  try {
    const response = await authService.signup(credentials);
    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Signup failed";
    return rejectWithValue(message);
  }
});

export const verifyOTP = createAsyncThunk<
  LoginResponse,
  VerifyOTPCredentials,
  { rejectValue: string }
>("/auth/verify", async (credentials, { rejectWithValue }) => {
  try {
    const response = await authService.verifyOTP(credentials);
    return response;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "OTP verification failed";
    return rejectWithValue(message);
  }
});

export const resendOTP = createAsyncThunk<
  { success: boolean; message: string },
  string,
  { rejectValue: string }
>("auth/resend-otp", async (email, { rejectWithValue }) => {
  try {
    const response = await authService.resendOTP(email);
    return { success: response.success, message: response.message };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to resend OTP";
    return rejectWithValue(message);
  }
});

export const requestPasswordReset = createAsyncThunk<
  { success: boolean; message: string },
  string,
  { rejectValue: string }
>("auth/requestPasswordReset", async (email, { rejectWithValue }) => {
  try {
    const response = await authService.requestPasswordReset(email);
    return { success: response.success, message: response.message };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Password reset request failed";
    return rejectWithValue(message);
  }
});

export const refreshToken = createAsyncThunk<
  RefreshTokenResponse,
  void,
  { rejectValue: string }
>("/auth/refresh", async (_, { rejectWithValue, getState }) => {
  try {
    const state = getState() as { auth: AuthState };
    const refreshToken = state.auth.refreshToken;

    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await authService.refreshToken(refreshToken);
    return response;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Token refresh failed";
    return rejectWithValue(message);
  }
});

export const logoutUser = createAsyncThunk(
  "/auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Logout failed";
      return rejectWithValue(message);
    }
  }
);

export const getCurrentUser = createAsyncThunk<
  User,
  void,
  { rejectValue: string }
>("/auth/me", async (_, { rejectWithValue }) => {
  try {
    const user = await authService.getCurrentUser();
    return user;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to get user";
    return rejectWithValue(message);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCredentials: (
      state,
      action: PayloadAction<{
        user: User;
        token: string;
        refreshToken: string;
      }>
    ) => {
      const { user, token, refreshToken } = action.payload;
      state.user = user;
      state.token = token;
      state.refreshToken = refreshToken;
      state.role = user.role;
      state.isAuthenticated = true;
      state.error = null;
      state.requiresOTPVerification = false;
      state.pendingVerificationEmail = null;

      // Persist to storage
      setStoredTokens(token, refreshToken);
      setStoredUser(user);
    },
    clearCredentials: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.role = null;
      state.isAuthenticated = false;
      state.error = null;
      state.requiresOTPVerification = false;
      state.pendingVerificationEmail = null;
      state.passwordResetEmailSent = false;

      // Clear storage
      clearStoredTokens();
      clearStoredUser();
    },
    initializeAuth: (state) => {
      const token = getStoredToken();
      const refreshToken = getStoredRefreshToken();
      const user = getStoredUser();

      if (token && refreshToken && user) {
        state.user = user;
        state.token = token;
        state.refreshToken = refreshToken;
        state.role = user.role;
        state.isAuthenticated = true;
      }
    },
    setPendingVerificationEmail: (state, action: PayloadAction<string>) => {
      state.pendingVerificationEmail = action.payload;
      state.requiresOTPVerification = true;
    },
    resetPasswordResetState: (state) => {
      state.passwordResetEmailSent = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        console.log("loginUser.fulfilled payload:", action.payload);

        state.user = action.payload.data.user;
        state.token = action.payload.data.accessToken;
        state.refreshToken = action.payload.data.refreshToken;
        state.role = action.payload.data.user.role;
        state.isAuthenticated = true;
        state.error = null;
        state.requiresOTPVerification = false;

        setStoredTokens(
          action.payload.data.accessToken,
          action.payload.data.refreshToken
        );
        setStoredUser(action.payload.data.user);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Login failed";
        state.isAuthenticated = false;
      })

      // Signup cases
      .addCase(signupUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;

        if (action.payload.requiresVerification) {
          state.requiresOTPVerification = true;
        }
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Signup failed";
      })

      // OTP Verification cases
      .addCase(verifyOTP.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.data.user;
        state.token = action.payload.data.accessToken;
        state.refreshToken = action.payload.data.refreshToken;
        state.role = action.payload.data.user.role;
        state.isAuthenticated = true;
        state.requiresOTPVerification = false;
        state.pendingVerificationEmail = null;
        state.error = null;

        setStoredTokens(
          action.payload.data.accessToken,
          action.payload.data.refreshToken
        );
        setStoredUser(action.payload.data.user);
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "OTP verification failed";
      })

      // Resend OTP cases
      .addCase(resendOTP.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resendOTP.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(resendOTP.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to resend OTP";
      })

      // Password reset request cases
      .addCase(requestPasswordReset.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(requestPasswordReset.fulfilled, (state) => {
        state.isLoading = false;
        state.passwordResetEmailSent = true;
        state.error = null;
      })
      .addCase(requestPasswordReset.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Password reset request failed";
      })

      // Refresh token cases
      .addCase(refreshToken.fulfilled, (state, action) => {
        if (action.payload.success && action.payload.data) {
          state.token = action.payload.data.accessToken;

          if (state.token && state.refreshToken) {
            setStoredTokens(state.token, state.refreshToken);
          }
        }
      })
      .addCase(refreshToken.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.role = null;
        state.isAuthenticated = false;

        clearStoredTokens();
        clearStoredUser();
      })

      // Logout cases
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.role = null;
        state.isAuthenticated = false;
        state.error = null;
        state.requiresOTPVerification = false;
        state.pendingVerificationEmail = null;
        state.passwordResetEmailSent = false;

        clearStoredTokens();
        clearStoredUser();
      })

      // Get current user cases
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.role = action.payload.role;
        state.isAuthenticated = true;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to get user";
      });
  },
});

export const {
  clearError,
  setCredentials,
  clearCredentials,
  initializeAuth,
  setPendingVerificationEmail,
  resetPasswordResetState,
} = authSlice.actions;

export default authSlice.reducer;
