import React from "react";
import { Badge, BadgeProps } from "@/shared/components/ui/Badge";
import { Button } from "@/shared/components/ui/Button";
import { FaEdit, FaShieldAlt, FaCalendarAlt } from "react-icons/fa";
import { MdVerified, MdEmail, MdPhone } from "react-icons/md";
import { Card } from "@/shared/components/ui/Card";
import type { DriverProfileHeaderProps } from "../types/driverProfile.types";

export const DriverProfileHeader: React.FC<DriverProfileHeaderProps> = ({
  profile,
  isLoading = false,
  onEditClick,
}) => {
  const formatMemberSince = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
    });
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const kycStatus = profile.kyc?.overallStatus || "Pending";
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
  };

  return (
    <Card className="border-0 shadow-none">
      <div className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          {/* Profile Info  */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 lg:mb-0">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              {profile.profileImageUrl ? (
                <img
                  src={profile.profileImageUrl}
                  alt={profile.name}
                  className="w-20 h-20 rounded-full object-cover border-4 border-slate-100 shadow-md"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center border-4 border-slate-100 shadow-md">
                  <span className="text-2xl font-bold text-white">
                    {getInitials(profile.name)}
                  </span>
                </div>
              )}

              {profile.isVerified && (
                <div className="absolute -top-1 -right-1 bg-emerald-500 rounded-full p-1.5 border-2 border-white">
                  <MdVerified className="w-4 h-4 text-white" />
                </div>
              )}
            </div>

            {/* Name and Details */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">
                  {profile.name}
                </h1>
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant={statusVariant[profile.status] || "secondary"}
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <FaShieldAlt className="w-3 h-3" />
                    {profile.status}
                  </Badge>
                  {profile.isVerified && (
                    <Badge
                      variant="success"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <MdVerified className="w-3 h-3" />
                      Email Verified
                    </Badge>
                  )}
                </div>
              </div>
              {/* Contact Details */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1.5">
                  <MdEmail className="w-4 h-4 flex-shrink-0" />
                  <span>{profile.email}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MdPhone className="w-4 h-4 flex-shrink-0" />
                  <span>{profile.mobile}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <FaCalendarAlt className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>
                    Member since {formatMemberSince(profile.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>
          {/* Action Buttons - Right Section */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 lg:pt-0">
            <Badge
              variant={kycVariant[kycStatus] || "secondary"}
              size="md"
              className="flex items-center gap-1.5"
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  kycStatus === "Approved"
                    ? "bg-green-500"
                    : kycStatus === "InReview"
                    ? "bg-blue-500"
                    : kycStatus === "Pending"
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
              />
              KYC {kycStatus}
            </Badge>
          </div>
        </div>
      </div>
    </Card>
  );
};
