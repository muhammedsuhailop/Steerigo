import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { useLogoutMutation } from "@/features/auth/services/authApi";
import type { ProfileDropdownProps } from "./Header.types";
import { CgProfile } from "react-icons/cg";
import { IoMdLogOut } from "react-icons/io";
import { RiLockPasswordLine } from "react-icons/ri";

export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
  isOpen,
  onClose,
  user,
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [logoutMutation, { isLoading: isLoggingOut }] = useLogoutMutation();
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLogout = async () => {
    try {
      setError(null);

      await logoutMutation().unwrap();

      console.log("Backend logout successful");

      onClose();

      navigate("/login", { replace: true });
    } catch (err: any) {
      const errorMessage =
        err?.data?.message ||
        err?.message ||
        "Logout failed. Please try again.";

      console.error("Logout error:", errorMessage);
      setError(errorMessage);

      // Even if logout request fails, clear client-side data
      // (user might be offline or token already invalid)
      setTimeout(() => {
        onClose();
        navigate("/login", { replace: true });
      }, 2000);
    }
  };

  const goToProfile = (path: string) => {
    onClose();
    navigate(path);
  };

  return (
    <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 py-2 z-50">
      {/* Error Message */}
      {error && (
        <div className="px-4 py-2 bg-red-50 border-b border-red-100">
          <p className="text-xs text-red-600">{error}</p>
        </div>
      )}

      {/* User Info */}
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-sm font-medium text-white">
            {user?.name ? user.name.charAt(0).toUpperCase() : "👤"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.name || "User"}
            </p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Profile Links */}
      <div className="py-1">
        <Link
          to="/profile"
          onClick={onClose}
          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-150"
        >
          <span className="mr-3">
            <CgProfile />
          </span>
          My Profile
        </Link>

        <button
          onClick={() => goToProfile("/update-password")}
          disabled={isLoggingOut}
          className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RiLockPasswordLine className="mr-3" />
          Update Password
        </button>

        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="mr-3">
            <IoMdLogOut />
          </span>
          {isLoggingOut ? "Logging out..." : "Logout"}
        </button>
      </div>
    </div>
  );
};
