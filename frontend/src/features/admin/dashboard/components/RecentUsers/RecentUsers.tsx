import React from "react";
import { UserItem } from "./UserItem";
import { Button } from "@/shared/components/ui";
import type { RecentUsersProps } from "./RecentUsers.types";

export const RecentUsers: React.FC<RecentUsersProps> = ({
  users,
  loading = false,
  onUserClick,
  onViewAll,
  maxUsers = 5,
  className = "",
}) => {
  const displayUsers = users.slice(0, maxUsers);

  if (loading) {
    return (
      <div
        className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className}`}
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Recent Users
        </h2>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg animate-pulse"
            >
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              </div>
              <div className="flex space-x-2">
                <div className="h-6 bg-gray-200 rounded w-16"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className}`}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Recent Users</h2>
        {onViewAll && (
          <Button variant="ghost" size="sm" onClick={onViewAll}>
            View All
          </Button>
        )}
      </div>

      {displayUsers.length > 0 ? (
        <div className="space-y-4">
          {displayUsers.map((user) => (
            <UserItem key={user.id} user={user} onClick={onUserClick} />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0a4 4 0 11-8-4.536 4 4 0 018 4.536z"
              />
            </svg>
          </div>
          <p className="text-gray-500 font-medium">No users found</p>
          <p className="text-sm text-gray-400 mt-1">
            Users will appear here once they register
          </p>
        </div>
      )}
    </div>
  );
};
