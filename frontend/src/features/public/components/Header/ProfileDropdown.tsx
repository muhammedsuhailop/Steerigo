import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "@/features/auth/store/authSlice";
import type { ProfileDropdownProps } from "./Header.types";
import { CgProfile } from "react-icons/cg";
import { IoMdLogOut } from "react-icons/io";
import { RiLockPasswordLine } from "react-icons/ri";

export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
  isOpen,
  onClose,
  user,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleLogout = () => {
    dispatch(logout());
    onClose();
  };

  const goToProfile = (path: string) => {
    onClose();
    navigate(path);
  };

  return (
    <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 py-2 z-50">
      {/* User Info */}
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-sm font-medium text-gray-700">
            {user?.name ? user.name.charAt(0).toUpperCase() : "👤"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.name || "User"}
            </p>
            <p className="text-sm text-gray-500 truncate">{user?.email}</p>
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
          className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-150"
        >
          <RiLockPasswordLine className="mr-3" />
          Update Password
        </button>

        <button
          onClick={handleLogout}
          className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-150"
        >
          <span className="mr-3">
            <IoMdLogOut />
          </span>
          Logout
        </button>
      </div>
    </div>
  );
};
