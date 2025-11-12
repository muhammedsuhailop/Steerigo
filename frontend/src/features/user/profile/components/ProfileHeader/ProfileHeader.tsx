import React, { useState, useEffect, useMemo } from "react";
import { FaEdit, FaCar, FaCalendarAlt } from "react-icons/fa";
import { MdVerified, MdEmail, MdPhone, MdUploadFile } from "react-icons/md";
import { Button } from "@/shared/components/ui/Button";
import { Badge } from "@/shared/components/ui/Badge";
import { Card } from "@/shared/components/ui/Card";
import { Alert } from "@/shared/components/ui/Alert";
import { ConfirmationModal } from "@/shared/components/ui/ConfirmationModal";
import { ProfilePictureUpload } from "@/shared/components/ProfilePictureUpload/ProfilePictureUpload";
import { useUploadProfilePictureMutation } from "../../services/userProfileApi";
import type { ProfileHeaderProps } from "./ProfileHeader.types";

interface ExtendedProfileHeaderProps extends ProfileHeaderProps {
  onRegistrationSuccess?: () => Promise<void>;
}

export const ProfileHeader: React.FC<ExtendedProfileHeaderProps> = ({
  profile,
  onEditClick,
  onRegisterAsDriver,
  onRegistrationSuccess,
  isLoading = false,
  isRegisteringDriver = false,
}) => {
  const [uploadProfilePicture, { isLoading: isUploadingProfilePic }] =
    useUploadProfilePictureMutation();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState<string>(
    profile?.profilePicture || ""
  );

  const userId = useMemo(() => {
    try {
      const userJson = localStorage.getItem("user");
      if (!userJson) return "";
      const user = JSON.parse(userJson);
      return user?.id || "";
    } catch {
      return "";
    }
  }, []);

  const formatMemberSince = useMemo(
    () => (dateString?: string) => {
      if (!dateString) return "—";
      const date = new Date(dateString);
      return date.toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
      });
    },
    []
  );

  const getInitials = useMemo(
    () => (name?: string) => {
      if (!name) return "NA";
      return name
        .split(" ")
        .map((n) => n[0] || "")
        .join("")
        .toUpperCase()
        .slice(0, 2);
    },
    []
  );

  useEffect(() => {
    if (success && onRegistrationSuccess) {
      const timer = setTimeout(async () => {
        try {
          await onRegistrationSuccess();
        } catch {}
      }, 2000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [success, onRegistrationSuccess]);

  useEffect(() => {
    setProfileImageUrl(profile?.profilePicture || "");
  }, [profile?.profilePicture]);

  const handleRegisterClick = () => setShowConfirmation(true);

  const handleConfirmRegistration = async () => {
    try {
      setError(null);
      setSuccess(null);
      if (!onRegisterAsDriver) {
        setError("Registration handler not available");
        setShowConfirmation(false);
        return;
      }
      const result = await onRegisterAsDriver();
      if (result?.success) {
        setSuccess("Successfully registered as driver! Please login again.");
      } else {
        setError(result?.error || "Registration failed");
      }
    } catch (err: any) {
      setError(err?.message || "An error occurred during registration");
    } finally {
      setShowConfirmation(false);
    }
  };

  const handleProfilePictureUpload = async (file: File) => {
    try {
      const response = await uploadProfilePicture({
        userId,
        file,
      }).unwrap();

      if (response?.data?.profilePictureUrl) {
        setProfileImageUrl(response.data.profilePictureUrl);
        setSuccess("Profile picture updated");
        setTimeout(() => setSuccess(null), 2200);
      } else {
        setError(response?.message || "Failed to upload profile picture");
      }
    } catch (err: any) {
      setError(err?.data?.message || "Failed to upload profile picture");
    }
  };

  return (
    <Card className="bg-white rounded-xl shadow-sm p-6 sm:p-8">
      {/* Alerts */}
      <div className="mb-3 space-y-2">
        {error && (
          <Alert type="error" message={error} onClose={() => setError(null)} />
        )}
        {success && (
          <Alert
            type="success"
            message={success}
            onClose={() => setSuccess(null)}
          />
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
        {/* Avatar */}
        <div className="sm:col-span-2 flex justify-center sm:justify-start">
          <div className="relative group w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden ring-1 ring-slate-100 shadow-sm transform transition-transform duration-200 hover:scale-105">
            <ProfilePictureUpload
              currentImage={profileImageUrl}
              initials={getInitials(profile?.name)}
              onUpload={handleProfilePictureUpload}
              isLoading={isUploadingProfilePic}
              disabled={isLoading || isRegisteringDriver}
            />

            {/* overlay */}
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center rounded-full">
              <div className="flex flex-col items-center gap-1">
                {isUploadingProfilePic ? (
                  <div className="animate-spin text-white">
                    <MdUploadFile size={20} />
                  </div>
                ) : (
                  <>
                    <FaEdit className="text-white" />
                    <span className="text-xs text-white drop-shadow">
                      Change
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="sm:col-span-7">
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-2xl font-semibold text-slate-900 leading-tight">
                  {profile?.name || "—"}
                </h2>
                {profile?.isVerified && (
                  <span
                    className="inline-flex items-center gap-1 text-green-600 bg-green-50 rounded-full px-2 py-0.5 text-xs font-medium"
                    title="Verified"
                  >
                    <MdVerified size={14} />
                    Verified
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {profile?.role || "User"}
              </p>
            </div>

            {/* small spacer on mobile */}
            <div className="hidden sm:block sm:flex-1" />
          </div>

          {/* contact rows */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-700">
            <div className="flex items-center gap-2">
              <MdEmail size={18} className="text-slate-400" />
              <span className="truncate break-words">
                {profile?.email || "—"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <MdPhone size={18} className="text-slate-400" />
              <span className="truncate">{profile?.mobile || "—"}</span>
            </div>

            <div className="flex items-center gap-2">
              <FaCalendarAlt size={16} className="text-slate-400" />
              <span>Member since {formatMemberSince(profile?.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="sm:col-span-3 flex flex-col md:flex-row items-center sm:justify-end gap-3">
          {profile?.role !== "Driver" ? (
            <Button
              onClick={handleRegisterClick}
              disabled={isLoading || isRegisteringDriver}
              isLoading={isRegisteringDriver}
              className="w-full md:w-auto flex items-center justify-center px-4 py-2"
            >
              <FaCar className="mr-2" />
              {isRegisteringDriver ? "Registering..." : "Register as Driver"}
            </Button>
          ) : (
            <Badge variant="info" className="px-3 py-1">
              Driver Account
            </Badge>
          )}

          <Button
            onClick={onEditClick}
            disabled={isLoading || isRegisteringDriver}
            variant="outline"
            className="w-full md:w-auto flex items-center justify-center px-4 py-2"
          >
            <FaEdit className="mr-2" />
            Edit Profile
          </Button>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleConfirmRegistration}
        title="Register as Driver?"
        message="Are you sure you want to register as a driver? You can't switch back to a rider once registered."
        confirmText="Yes, Register"
        cancelText="Cancel"
        variant="question"
        isLoading={isRegisteringDriver}
      />
    </Card>
  );
};
