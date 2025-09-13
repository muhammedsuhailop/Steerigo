import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { authApi } from "../services/authApi";
import type { AuthState, User } from "../types";
import { GoogleAuthService } from "../services/googleAuthService";
import { jwtDecode } from "jwt-decode";

// Token utilities
const getTokenFromStorage = (): string | null => {
    if (typeof window !== "undefined") {
        try {
            return localStorage.getItem("token");
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

const setTokensInStorage = (token: string, refreshToken: string) => {
    if (typeof window !== "undefined") {
        try {
            localStorage.setItem("token", token);
            localStorage.setItem("refreshToken", refreshToken);
        } catch (error) {
            console.error("Failed to store tokens:", error);
        }
    }
};

const removeTokensFromStorage = () => {
    if (typeof window !== "undefined") {
        try {
            localStorage.removeItem("token");
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

// Async thunks
export const initializeAuth = createAsyncThunk(
    "auth/initialize",
    async (_, { dispatch }) => {
        const token = getTokenFromStorage();
        const refreshToken = getRefreshTokenFromStorage();
        const user = getUserFromStorage();

        if (token && refreshToken && user) {
            return { user, token, refreshToken };
        }

        if (token && refreshToken) {
            try {
                const result = await dispatch(
                    authApi.endpoints.getCurrentUser.initiate()
                ).unwrap();
                if (result.success) {
                    setUserInStorage(result.data);
                    return { user: result.data, token, refreshToken };
                }
            } catch (error) {
                removeTokensFromStorage();
            }
        }

        return null;
    }
);

export const refreshAuthToken = createAsyncThunk(
    "auth/refreshToken",
    async (_, { dispatch, rejectWithValue }) => {
        try {
            const result = await dispatch(
                authApi.endpoints.refreshToken.initiate()
            ).unwrap();
            setTokensInStorage(result.token, result.refreshToken);
            return result;
        } catch (error: any) {
            removeTokensFromStorage();
            return rejectWithValue(error.message || "Token refresh failed");
        }
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
            return { user, token: accessToken, refreshToken: refreshToken || "" };
        } catch (e) {
            return rejectWithValue("Invalid token");
        }
    }
);

// Initial state
const initialState: AuthState = {
    user: null,
    token: null,
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
            action: PayloadAction<{ user: User; token: string; refreshToken: string }>
        ) => {
            const { user, token, refreshToken } = action.payload;
            state.user = user;
            state.token = token;
            state.refreshToken = refreshToken;
            state.isAuthenticated = true;
            state.isLoading = false;
            state.error = null;

            setTokensInStorage(token, refreshToken);
            setUserInStorage(user);
        },

        logout: (state) => {
            state.user = null;
            state.token = null;
            state.refreshToken = null;
            state.isAuthenticated = false;
            state.isLoading = false;
            state.error = null;

            removeTokensFromStorage();
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
                    const { user, token, refreshToken } = action.payload;
                    state.user = user;
                    state.token = token;
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
                state.token = action.payload.token;
                state.refreshToken = action.payload.refreshToken;
                state.error = null;
            })
            .addCase(refreshAuthToken.rejected, (state, action) => {
                state.user = null;
                state.token = null;
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
                const { user, token, refreshToken } = action.payload;
                state.user = user;
                state.token = token;
                state.refreshToken = refreshToken;
                state.isAuthenticated = true;
                state.isLoading = false;
                state.error = null;

                setTokensInStorage(token, refreshToken);
                setUserInStorage(user);
            })
            .addCase(handleGoogleCallback.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Handle auth API responses
        builder
            .addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
                const { user, token, refreshToken } = action.payload.data;
                state.user = user;
                state.token = token;
                state.refreshToken = refreshToken;
                state.isAuthenticated = true;
                state.isLoading = false;
                state.error = null;

                setTokensInStorage(token, refreshToken);
                setUserInStorage(user);
            })
            .addMatcher(authApi.endpoints.login.matchRejected, (state, action) => {
                state.error = action.error.message || "Login failed";
                state.isLoading = false;
            })
            .addMatcher(
                authApi.endpoints.verifyOTP.matchFulfilled,
                (state, action) => {
                    const { user, token, refreshToken } = action.payload.data;
                    state.user = user;
                    state.token = token;
                    state.refreshToken = refreshToken;
                    state.isAuthenticated = true;
                    state.isLoading = false;
                    state.error = null;

                    setTokensInStorage(token, refreshToken);
                    setUserInStorage(user);
                }
            )
            .addMatcher(
                authApi.endpoints.handleGoogleCallback.matchFulfilled,
                (state, action) => {
                    const { user, token, refreshToken } = action.payload.data;
                    state.user = user;
                    state.token = token;
                    state.refreshToken = refreshToken;
                    state.isAuthenticated = true;
                    state.isLoading = false;
                    state.error = null;

                    setTokensInStorage(token, refreshToken);
                    setUserInStorage(user);
                }
            )
            .addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
                state.user = null;
                state.token = null;
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
