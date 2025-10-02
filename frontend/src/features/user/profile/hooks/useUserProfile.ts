import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth";
import {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useGetUserStatsQuery,
  useUploadProfilePictureMutation,
} from "../services/userProfileApi";
import {
  fetchUserProfile,
  updateUserProfile,
  clearError,
  clearProfile,
  selectUserProfile,
  selectUserProfileLoading,
  selectUserProfileError,
  selectUserProfileUpdating,
  selectUserProfileUpdateError,
} from "../store/userProfileSlice";
import type { UserProfileFormData } from "../types/userProfile.types";
import type { AppDispatch } from "@/app/store";

export const useUserProfile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Redux selectors
  const profile = useSelector(selectUserProfile);
  const isLoading = useSelector(selectUserProfileLoading);
  const error = useSelector(selectUserProfileError);
  const isUpdating = useSelector(selectUserProfileUpdating);
  const updateError = useSelector(selectUserProfileUpdateError);

  // RTK Query hooks
  const {
    data: profileData,
    isLoading: profileLoading,
    error: profileError,
    refetch: refetchProfile,
  } = useGetUserProfileQuery(user?.id || "", {
    skip: !user?.id,
  });

  const {
    data: statsData,
    isLoading: statsLoading,
    error: statsError,
    refetch: refetchStats,
  } = useGetUserStatsQuery(user?.id || "", {
    skip: !user?.id,
  });

  const [updateProfileMutation, { isLoading: updateLoading }] =
    useUpdateUserProfileMutation();

  const [uploadProfilePicture, { isLoading: uploadLoading }] =
    useUploadProfilePictureMutation();

  // Actions
  const handleUpdateProfile = useCallback(
    async (data: UserProfileFormData) => {
      if (!user?.id) return;

      try {
        await dispatch(
          updateUserProfile({
            userId: user.id,
            data,
          })
        ).unwrap();

        // Refetch data to ensure consistency
        await refetchProfile();
        return { success: true };
      } catch (error: any) {
        console.error("Update profile error:", error);
        return { success: false, error: error.message };
      }
    },
    [user?.id, dispatch, refetchProfile]
  );

  const handleUploadProfilePicture = useCallback(
    async (file: File) => {
      if (!user?.id) return { success: false, error: "User not found" };

      try {
        const result = await uploadProfilePicture({
          userId: user.id,
          file,
        }).unwrap();

        if (result.success) {
          await refetchProfile();
          return { success: true, data: result.data };
        } else {
          throw new Error("Upload failed");
        }
      } catch (error: any) {
        console.error("Upload profile picture error:", error);
        return { success: false, error: error.message };
      }
    },
    [user?.id, uploadProfilePicture, refetchProfile]
  );

  const handleNavigateToDriverRegistration = useCallback(() => {
    navigate("/driver/register");
  }, [navigate]);

  const handleRefreshData = useCallback(async () => {
    await Promise.all([refetchProfile(), refetchStats()]);
  }, [refetchProfile, refetchStats]);

  const clearErrors = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const clearProfileData = useCallback(() => {
    dispatch(clearProfile());
  }, [dispatch]);

  // Computed values
  const currentProfile = profileData?.success ? profileData.data : profile;
  const currentStats = statsData?.success ? statsData.data : null;

  const isLoadingAny =
    isLoading ||
    profileLoading ||
    statsLoading ||
    isUpdating ||
    updateLoading ||
    uploadLoading;

  const hasError = error || updateError || profileError || statsError;

  return {
    // Data
    profile: currentProfile,
    stats: currentStats,
    user,

    // Loading states
    isLoading: isLoadingAny,
    isUpdating: isUpdating || updateLoading,
    isUploading: uploadLoading,

    // Error states
    error: hasError,
    profileError: error || profileError,
    updateError,

    // Actions
    updateProfile: handleUpdateProfile,
    uploadProfilePicture: handleUploadProfilePicture,
    navigateToDriverRegistration: handleNavigateToDriverRegistration,
    refreshData: handleRefreshData,
    clearErrors,
    clearProfileData,

    // Utils
    refetchProfile,
    refetchStats,
  };
};
