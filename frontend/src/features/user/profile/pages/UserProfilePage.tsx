import React, { useState, useEffect } from "react";
import { MdRefresh, MdError } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useUserProfile } from "../hooks/useUserProfile";
import { useLogoutMutation } from "@/features/auth/services/authApi";
import { Button } from "@/shared/components/ui/Button";
import { LoadingSpinner } from "@/shared/components/ui/LoadingSpinner";
import { Alert } from "@/shared/components/ui/Alert";
import { ProfileHeader } from "../components/ProfileHeader";
import { UpdateProfileForm } from "../components/UpdateProfileForm";
import { ProfileStats } from "../components/ProfileStats";
import type { UserProfileFormData } from "../types/userProfile.types";
import { useAppDispatch } from "@/app/store/hooks";
import { useGetUserStatsQuery } from "../services/userProfileApi";

const UserProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [logoutMutation] = useLogoutMutation();
  const {
    profile,
    isLoading,
    isUpdating,
    error,
    updateError,
    updateProfile,
    registerAsDriver,
    isRegisteringDriver,
    navigateToDriverRegistration,
    refreshData,
    clearErrors,
  } = useUserProfile();

  const { data: statsResponse, isLoading: statsLoading } =
    useGetUserStatsQuery();

  const [isEditMode, setIsEditMode] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  const handleEditClick = () => {
    setIsEditMode(true);
    clearErrors();
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    clearErrors();
  };

  const handleSaveProfile = async (data: UserProfileFormData) => {
    const result = await updateProfile(data);

    if (result && result.success) {
      setIsEditMode(false);
      setShowSuccess(true);
    }
  };

  const handleRefresh = async () => {
    await refreshData();
  };

  const handleRegistrationSuccess = async () => {
    try {
      await logoutMutation().unwrap();
      console.log("Logout successful after registration");
    } catch (err) {
      console.error("Logout error during registration flow:", err);
    } finally {
      navigate("/login", { replace: true });
    }
  };

  // Loading state
  if (isLoading && !profile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <LoadingSpinner size="large" className="mx-auto mb-4" />
              <p className="text-gray-600">Loading your profile...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !profile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <MdError className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Failed to Load Profile
              </h2>
              <p className="text-gray-600 mb-6">
                {typeof error === "string"
                  ? error
                  : "message" in (error as any)
                    ? (error as any).message
                    : "An unexpected error occurred"}
              </p>
              <Button
                variant="primary"
                leftIcon={<MdRefresh />}
                onClick={handleRefresh}
                isLoading={isLoading}
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <p className="mt-2 text-gray-600">
              Manage your personal information and view your ride statistics
            </p>
          </div>

          <div className="mt-4 sm:mt-0">
            <Button
              variant="outline"
              leftIcon={<MdRefresh />}
              onClick={handleRefresh}
              isLoading={isLoading}
              disabled={isUpdating || isRegisteringDriver}
            >
              Refresh
            </Button>
          </div>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <Alert variant="success" className="mb-6">
            <div>
              <h4 className="font-semibold">Profile Updated Successfully!</h4>
              <p>Your profile information has been saved.</p>
            </div>
          </Alert>
        )}

        {/* Error Message */}
        {updateError && (
          <Alert variant="danger" className="mb-6" onClose={clearErrors}>
            <MdError className="w-5 h-5" />
            <div>
              <h4 className="font-semibold">Update Failed</h4>
              <p>{updateError}</p>
            </div>
          </Alert>
        )}

        {/* Main Content */}
        <div className="space-y-8">
          {/* Profile Header or Edit Form */}
          {isEditMode ? (
            <UpdateProfileForm
              profile={profile}
              onSave={handleSaveProfile}
              onCancel={handleCancelEdit}
              isLoading={isUpdating}
              error={updateError}
            />
          ) : (
            <ProfileHeader
              profile={profile}
              stats={statsResponse?.data}
              onEditClick={handleEditClick}
              onDriverRegisterClick={navigateToDriverRegistration}
              onRegisterAsDriver={registerAsDriver}
              onRegistrationSuccess={handleRegistrationSuccess}
              isRegisteringDriver={isRegisteringDriver}
              isLoading={isLoading}
            />
          )}

          {/* Profile Statistics */}
          {!isEditMode && statsResponse?.data && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-6">Your Statistics</h2>
              <ProfileStats
                stats={statsResponse.data}
                isLoading={statsLoading}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
