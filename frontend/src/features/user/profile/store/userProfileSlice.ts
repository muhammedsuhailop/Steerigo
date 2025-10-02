import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { userProfileApi } from "../services/userProfileApi";
import type {
  UserProfileState,
  UserProfile,
  UserProfileFormData,
  UpdateProfileRequest,
} from "../types/userProfile.types";

const initialState: UserProfileState = {
  profile: null,
  isLoading: false,
  error: null,
  isUpdating: false,
  updateError: null,
};

// Async thunks
export const fetchUserProfile = createAsyncThunk(
  "userProfile/fetchProfile",
  async (userId: string, { dispatch, rejectWithValue }) => {
    try {
      const result = await dispatch(
        userProfileApi.endpoints.getUserProfile.initiate(userId)
      ).unwrap();

      if (result.success) {
        return result.data;
      } else {
        throw new Error("Failed to fetch user profile");
      }
    } catch (error: any) {
      console.error("Fetch user profile failed:", error);
      return rejectWithValue(error.message || "Failed to fetch user profile");
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "userProfile/updateProfile",
  async (
    { userId, data }: UpdateProfileRequest,
    { dispatch, rejectWithValue }
  ) => {
    try {
      const result = await dispatch(
        userProfileApi.endpoints.updateUserProfile.initiate({ userId, data })
      ).unwrap();

      if (result.success) {
        return result.data;
      } else {
        throw new Error("Failed to update user profile");
      }
    } catch (error: any) {
      console.error("Update user profile failed:", error);
      return rejectWithValue(error.message || "Failed to update user profile");
    }
  }
);

const userProfileSlice = createSlice({
  name: "userProfile",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.updateError = null;
    },
    clearProfile: (state) => {
      state.profile = null;
      state.error = null;
      state.updateError = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setUpdating: (state, action: PayloadAction<boolean>) => {
      state.isUpdating = action.payload;
    },
    updateProfileField: (
      state,
      action: PayloadAction<Partial<UserProfile>>
    ) => {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    // Fetch profile
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
        state.error = null;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update profile
    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.isUpdating = true;
        state.updateError = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.profile = action.payload;
        state.updateError = null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isUpdating = false;
        state.updateError = action.payload as string;
      });
  },
});

export const {
  clearError,
  clearProfile,
  setLoading,
  setUpdating,
  updateProfileField,
} = userProfileSlice.actions;

export const selectUserProfile = (state: { userProfile: UserProfileState }) =>
  state.userProfile.profile;

export const selectUserProfileLoading = (state: {
  userProfile: UserProfileState;
}) => state.userProfile.isLoading;

export const selectUserProfileError = (state: {
  userProfile: UserProfileState;
}) => state.userProfile.error;

export const selectUserProfileUpdating = (state: {
  userProfile: UserProfileState;
}) => state.userProfile.isUpdating;

export const selectUserProfileUpdateError = (state: {
  userProfile: UserProfileState;
}) => state.userProfile.updateError;

export default userProfileSlice.reducer;
