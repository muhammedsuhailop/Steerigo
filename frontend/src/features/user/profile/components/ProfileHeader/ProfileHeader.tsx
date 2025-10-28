import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaEdit,
  FaCar,
  FaCalendarAlt,
  FaShieldAlt,
} from "react-icons/fa";
import { MdVerified, MdEmail, MdPhone } from "react-icons/md";
import { Button } from "@/shared/components/ui/Button";
import { Badge } from "@/shared/components/ui/Badge";
import { Card } from "@/shared/components/ui/Card";
import { Alert } from "@/shared/components/ui/Alert";
import { ConfirmationModal } from "@/shared/components/ui/ConfirmationModal";
import type { ProfileHeaderProps } from "./ProfileHeader.types";

interface ExtendedProfileHeaderProps extends ProfileHeaderProps {
  onRegistrationSuccess?: () => Promise<void>;
}

export const ProfileHeader: React.FC<ExtendedProfileHeaderProps> = ({
  profile,
  stats,
  onEditClick,
  onDriverRegisterClick,
  onRegisterAsDriver,
  onRegistrationSuccess,
  isLoading = false,
  isRegisteringDriver = false,
}) => {
  const formatMemberSince = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
    });
  };

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  useEffect(() => {
    if (success && onRegistrationSuccess) {
      const timer = setTimeout(async () => {
        await onRegistrationSuccess();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [success, onRegistrationSuccess]);

  const handleRegisterClick = () => {
    setShowConfirmation(true);
  };

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

      if (result.success) {
        setSuccess("Successfully registered as driver! Please Login again");
      } else {
        setError(result.error || "Registration failed");
      }
    } catch (err: any) {
      setError("An error occurred during registration");
    } finally {
      setShowConfirmation(false);
    }
  };

  return (
    <Card className="mb-6">
      <div className="p-6">
        {/* Error Alert */}
        {error && (
          <Alert
            variant="danger"
            className="mb-4"
            onClose={() => setError(null)}
          >
            <p>{error}</p>
          </Alert>
        )}

        {/* Success Alert */}
        {success && (
          <Alert
            variant="success"
            className="mb-4"
            onClose={() => setSuccess(null)}
          >
            <p>{success}</p>
          </Alert>
        )}

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          {/* Profile Info */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4 lg:mb-0">
            {/* Avatar */}
            <div className="relative">
              {profile.profilePicture ? (
                <img
                  src={profile.profilePicture}
                  alt={profile.name}
                  className="w-20 h-20 rounded-full object-cover border-4 border-gray-100"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center border-4 border-gray-100">
                  <span className="text-2xl font-bold text-gray-600">
                    {getInitials(profile.name)}
                  </span>
                </div>
              )}

              {profile.isVerified && (
                <div className="absolute -top-1 -right-1 bg-blue-500 rounded-full p-1">
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
                <div className="flex gap-2">
                  <Badge variant="outline" className="text-xs">
                    <FaShieldAlt className="w-3 h-3 mr-1" />
                    {profile.role}
                  </Badge>
                  {profile.isVerified && (
                    <Badge variant="success" className="text-xs">
                      <MdVerified className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <MdEmail className="w-4 h-4 mr-2" />
                  {profile.email}
                </div>
                <div className="flex items-center">
                  <MdPhone className="w-4 h-4 mr-2" />
                  {profile.mobile}
                </div>
                <div className="flex items-center">
                  <FaCalendarAlt className="w-4 h-4 mr-2" />
                  Member since {formatMemberSince(stats.memberSince)}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            {profile.role !== "Driver" && (
              <Button
                variant="outline"
                leftIcon={<FaCar />}
                onClick={handleRegisterClick}
                disabled={isLoading || isRegisteringDriver}
                isLoading={isRegisteringDriver}
                className="justify-center sm:justify-start"
              >
                {isRegisteringDriver ? "Registering..." : "Register as Driver"}
              </Button>
            )}

            {profile.role === "Driver" && (
              <Badge variant="success" className="text-sm py-2 px-3">
                <FaCar className="w-3 h-3 mr-2" />
                Driver Account
              </Badge>
            )}

            <Button
              variant="primary"
              leftIcon={<FaEdit />}
              onClick={onEditClick}
              disabled={isLoading || isRegisteringDriver}
              className="justify-center sm:justify-start"
            >
              Edit Profile
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {stats.totalRides}
            </div>
            <div className="text-sm text-gray-600">Total Rides</div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {stats.completedRides}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              ₹{stats.totalSpent.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Total Spent</div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {stats.favoriteDrivers?.length}
            </div>
            <div className="text-sm text-gray-600">Favorite Drivers</div>
          </div>
        </div>

        {/* Confirmation Modal */}
        <ConfirmationModal
          isOpen={showConfirmation}
          onClose={() => setShowConfirmation(false)}
          onConfirm={handleConfirmRegistration}
          title="Register as Driver?"
          message="Are you sure you want to register as a driver? You can’t switch back to a rider once registered."
          confirmText="Yes, Register"
          cancelText="Cancel"
          variant="question"
          isLoading={isRegisteringDriver}
        />
      </div>
    </Card>
  );
};
