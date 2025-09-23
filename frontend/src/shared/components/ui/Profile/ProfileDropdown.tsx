import React from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import type { ProfileDropdownProps } from "./ProfileDropdown.types";
import { logout } from "@/features/auth/store/authSlice";

export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
  isOpen,
  onClose,
  user,
  actions,
}) => {
  const dispatch = useDispatch();
  if (!isOpen) return null;

  const defaultLogout = () => {
    dispatch(logout());
    onClose();
  };

  return (
    <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 py-2 z-50">
      {/* User Info */}
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-sm text-gray-700">
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
              <span>{action.label}</span>
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
                    : "text-gray-700"
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
                  onClose();
                  (action.onClick ?? defaultLogout)();
                }}
                className={`w-full text-left flex items-center px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                  action.danger
                    ? "text-red-600 hover:bg-red-50"
                    : "text-gray-700"
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
