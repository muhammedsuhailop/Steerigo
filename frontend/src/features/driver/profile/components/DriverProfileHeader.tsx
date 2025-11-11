import React, { useState, useMemo, useEffect, useCallback } from "react";
import { Badge, BadgeProps } from "@/shared/components/ui/Badge";
import { Card } from "@/shared/components/ui/Card";
import { FaEdit, FaCalendarAlt } from "react-icons/fa";
import { MdVerified, MdEmail, MdPhone } from "react-icons/md";
import { Alert } from "@/shared/components/ui/Alert";
import { ProfilePictureUpload } from "@/shared/components/ProfilePictureUpload/ProfilePictureUpload";
import { useUploadDriverProfilePictureMutation } from "../services/driverProfileApi";
import type { DriverProfileHeaderProps } from "../types/driverProfile.types";

export const DriverProfileHeader: React.FC<DriverProfileHeaderProps> = ({
  profile,
  isLoading = false,
  onEditClick,
}) => {
  const [uploadDriverProfilePicture, { isLoading: isUploadingProfilePic }] =
    useUploadDriverProfilePictureMutation();
  const [profileImageUrl, setProfileImageUrl] = useState<string>(
    profile?.profileImageUrl || ""
  );
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const userId = useMemo(() => {
    try {
      const u = JSON.parse(localStorage.getItem("user") || "null");
      const extractedId = u?.id || "";
      if (!extractedId) {
        console.warn("User ID not found in localStorage");
      }
      return extractedId;
    } catch {
      console.error("Error parsing user from localStorage");
      return "";
    }
  }, []);

  useEffect(() => {
    setProfileImageUrl(profile?.profileImageUrl || "");
  }, [profile?.profileImageUrl]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [success]);

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
    () =>
      (name = "") =>
        name
          .split(" ")
          .map((n) => n[0] || "")
          .join("")
          .toUpperCase()
          .slice(0, 2),
    []
  );

  const statusVariant: Record<string, BadgeProps["variant"]> = {
    Active: "success",
    Inactive: "warning",
    Suspended: "danger",
  };

  const kycVariant: Record<string, BadgeProps["variant"]> = {
    Verified: "success",
    InReview: "info",
    Pending: "warning",
    Rejected: "danger",
    Approved: "success",
  };

  const kycStatus = profile?.kyc?.overallStatus || "Pending";

  const handleProfilePictureUpload = useCallback(
    async (file: File) => {
      if (!userId) {
        throw new Error("User ID not found. Please logout and login again.");
      }

      try {
        console.log("Starting driver profile picture upload...", {
          userId,
          fileName: file.name,
        });

        const resp = await uploadDriverProfilePicture({
          userId,
          file,
        }).unwrap();

        console.log("Upload response:", resp);

        let pictureUrl: string | null = null;

        if (resp?.data?.profilePictureUrl) {
          pictureUrl = resp.data.profilePictureUrl;
        }

        if (pictureUrl) {
          console.log("Setting profile image URL:", pictureUrl);
          setProfileImageUrl(pictureUrl);
        } else {
          console.error("No picture URL in response:", resp);
          throw new Error(
            resp?.message || "Failed to get image URL from server"
          );
        }
      } catch (err: any) {
        console.error("Profile picture upload error:", err);
        const errorMessage =
          err?.data?.message ||
          err?.message ||
          "Failed to upload profile picture";
        throw new Error(errorMessage);
      }
    },
    [userId, uploadDriverProfilePicture]
  );

  const handleUploadSuccess = useCallback(() => {
    setSuccess("Profile picture updated successfully");
  }, []);

  const handleUploadError = useCallback((errorMessage: string) => {
    setError(errorMessage);
  }, []);

  return (
    <Card className="bg-white rounded-xl shadow-sm p-5 sm:p-6">
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
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden ring-1 ring-slate-100 shadow-sm transform transition-transform duration-200 hover:scale-105">
            <ProfilePictureUpload
              currentImage={profileImageUrl}
              initials={getInitials(profile?.name || "")}
              onUpload={handleProfilePictureUpload}
              isLoading={isUploadingProfilePic}
              disabled={isLoading}
              onUploadSuccess={handleUploadSuccess}
              onUploadError={handleUploadError}
            />
          </div>
        </div>

        {/* Main info */}
        <div className="sm:col-span-7">
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <h2 className="text-lg sm:text-2xl font-semibold text-slate-900 truncate">
                  {profile?.name || "—"}
                </h2>

                {profile?.isVerified && (
                  <span
                    className="inline-flex items-center gap-1 text-green-600 bg-green-50 rounded-full px-2 py-0.5 text-xs font-medium"
                    title="Verified"
                    aria-hidden
                  >
                    <MdVerified size={14} />
                    Verified
                  </span>
                )}
              </div>

              <p className="text-sm text-gray-500 mt-1">
                {profile?.role || "Driver"}
              </p>
            </div>

            <div className="hidden sm:flex sm:flex-1" />
          </div>

          {/* contact rows */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-700">
            <div className="flex items-center gap-2 min-w-0">
              <MdEmail className="text-slate-400 flex-shrink-0" size={18} />
              <span className="truncate break-words">
                {profile?.email || "—"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <MdPhone className="text-slate-400" size={18} />
              <span className="truncate">{profile?.mobile || "—"}</span>
            </div>

            <div className="flex items-center gap-2">
              <FaCalendarAlt className="text-slate-400" size={16} />
              <span>Member since {formatMemberSince(profile?.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Actions & statuses */}
        <div className="sm:col-span-3 flex flex-col items-end gap-3">
          <div className="w-full flex flex-col items-end gap-3">
            <div className="text-right">
              <p className="text-xs text-gray-500 mb-1">Account Status</p>
              <Badge variant={statusVariant[profile?.status || ""] || "info"}>
                {profile?.status || "Unknown"}
              </Badge>
            </div>

            <div className="text-right">
              <p className="text-xs text-gray-500 mb-1">KYC</p>
              <Badge variant={kycVariant[kycStatus] || "info"}>
                {kycStatus}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
