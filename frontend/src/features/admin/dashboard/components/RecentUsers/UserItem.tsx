import React from "react";
import { UserStatusBadge } from "../../../user-management/components/UserStatusBadge";
import type { UserItemProps } from "./RecentUsers.types";

export const UserItem: React.FC<UserItemProps> = ({ user, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick(user);
    }
  };

  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join("");
  };

  return (
    <div
      className={`flex items-center justify-between p-4 bg-gray-50 rounded-lg transition-colors ${
        onClick ? "hover:bg-gray-100 cursor-pointer" : ""
      }`}
      onClick={handleClick}
    >
      <div className="flex items-center space-x-3">
        {/* User Avatar */}
        <div className="flex-shrink-0">
          {user.avatar ? (
            <img
              className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100"
              src={user.avatar}
              alt={`${user.name}'s avatar`}
            />
          ) : (
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-gray-600">
                {getInitials(user.name)}
              </span>
            </div>
          )}
        </div>

        {/* User Info */}
        <div className="min-w-0 flex-1">
          <h4 className="font-medium text-gray-900 truncate">{user.name}</h4>
          <p className="text-sm text-gray-600 truncate">{user.email}</p>
        </div>
      </div>

      {/* User Status and Date */}
      <div className="flex items-center space-x-3">
        <UserStatusBadge status={user.status} size="sm" />
        <span className="text-sm text-gray-500">
          {new Date(user.createdAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
};
