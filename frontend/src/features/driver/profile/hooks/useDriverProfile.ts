import { useCallback, useEffect, useState } from "react";
import {
  useGetDriverProfileQuery,
  useUpdateDriverProfileMutation,
} from "../services/driverProfileApi";

export const useDriverProfile = () => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    data: profileData,
    isLoading,
    error: fetchError,
    refetch,
  } = useGetDriverProfileQuery();

  const [updateProfile, { isLoading: isUpdating, error: updateError }] =
    useUpdateDriverProfileMutation();

  useEffect(() => {
    if (fetchError) {
      const errorMessage =
        (fetchError as any)?.data?.message || "Failed to fetch profile";
      setError(errorMessage);
    }
  }, [fetchError]);

  useEffect(() => {
    if (updateError) {
      const errorMessage =
        (updateError as any)?.data?.message || "Failed to update profile";
      setError(errorMessage);
    }
  }, [updateError]);

  const handleUpdateProfile = useCallback(
    async (updates: Record<string, any>) => {
      try {
        setError(null);
        setSuccess(null);

        await updateProfile(updates).unwrap();
        setSuccess("Profile updated successfully");

        await refetch();

        return { success: true };
      } catch (err: any) {
        const errorMsg = err?.data?.message || "Failed to update profile";
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }
    },
    [updateProfile, refetch]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearSuccess = useCallback(() => {
    setSuccess(null);
  }, []);

  const profile = profileData || null;

  const isKYCVerified = profile?.kyc?.overallStatus === "Verified";
  const isLicenseVerified = profile?.license?.licenseVerified;
  const isProfileComplete = !!(
    profile?.name &&
    profile?.email &&
    profile?.mobile &&
    profile?.dob &&
    profile?.address
  );

  return {
    profile,
    isKYCVerified,
    isLicenseVerified,
    isProfileComplete,

    isLoading,
    isUpdating,

    error,
    success,

    updateProfile: handleUpdateProfile,
    refetch,
    clearError,
    clearSuccess,
  };
};
