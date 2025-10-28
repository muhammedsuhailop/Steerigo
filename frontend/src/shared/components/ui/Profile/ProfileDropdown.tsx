import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLogoutMutation } from "@/features/auth/services/authApi";
import type { ProfileDropdownProps } from "./ProfileDropdown.types";

export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
  isOpen,
  onClose,
  user,
  actions,
}) => {
  const navigate = useNavigate();
  const [logoutMutation, { isLoading: isLoggingOut }] = useLogoutMutation();
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const defaultLogout = async () => {
    try {
      setError(null);
      await logoutMutation().unwrap();
      onClose();
      navigate("/login", { replace: true });
    } catch (err: any) {
      const errorMessage = err?.data?.message || "Logout failed";
      setError(errorMessage);
      setTimeout(() => {
        onClose();
        navigate("/login", { replace: true });
      }, 2000);
    }
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

      {/* Dynamic Actions */}
      <div className="py-1">
        {actions.map((action) => {
          const Content = (
            <div className="flex items-center">
              <action.icon
                className={`mr-3 ${
                  action.danger ? "text-red-600" : "text-gray-600"
                }`}
              />
              <span>
                {isLoggingOut && action.danger
                  ? "Logging out..."
                  : action.label}
              </span>
            </div>
          );

          if (action.to) {
            return (
              <Link
                key={action.id}
                to={action.to}
                onClick={() => {
                  onClose();
                  action.onClick?.();
                }}
                className={`flex items-center px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                  action.danger
                    ? "text-red-600 hover:bg-red-50"
                    : "text-gray-700 hover:text-gray-900"
                }`}
              >
                {Content}
              </Link>
            );
          } else {
            return (
              <button
                key={action.id}
                onClick={() => {
                  if (action.danger || !action.onClick) {
                    defaultLogout();
                  } else {
                    onClose();
                    action.onClick();
                  }
                }}
                disabled={isLoggingOut && action.danger}
                className={`w-full text-left flex items-center px-4 py-2 text-sm hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  action.danger
                    ? "text-red-600 hover:bg-red-50 hover:text-red-700"
                    : "text-gray-700 hover:text-gray-900"
                }`}
              >
                {Content}
              </button>
            );
          }
        })}
      </div>
    </div>
  );
};
