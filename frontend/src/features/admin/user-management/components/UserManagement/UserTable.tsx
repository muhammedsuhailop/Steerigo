import React, { useState } from "react";
import { Table, Button } from "@/shared/components/ui";
import { UserStatusBadge } from "../UserStatusBadge/UserStatusBadge";
import type { UserTableProps, User } from "./UserManagement.types";
import { ActionDropdown } from "./ActionDropdown";
import type { Column } from "@/shared/components/ui/Table";
import { RiUserLine } from "react-icons/ri";

export const UserTable: React.FC<UserTableProps> = ({
  users,
  loading,
  onUserClick,
  onDeleteUser,
  onUserAction,
}) => {
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleUserAction = async (userId: string, action: any) => {
    setActionLoading(userId);
    try {
      await onUserAction(userId, action);
    } finally {
      setActionLoading(null);
    }
  };

  const columns: Column<User>[] = [
    {
      key: "name",
      header: "User",
      render: (_, user) => (
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            {user.avatar ? (
              <img
                className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100"
                src={user.avatar}
                alt={user.name}
              />
            ) : (
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <RiUserLine className="w-5 h-5 text-gray-500" />
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold text-gray-900 truncate">
              {user.name}
            </div>
            <div className="text-sm text-gray-500 truncate">{user.email}</div>
          </div>
        </div>
      ),
      width: "280px",
    },
    {
      key: "mobile",
      header: "Mobile",
      render: (mobile) => (
        <span className="text-sm text-gray-900">{mobile || "—"}</span>
      ),
      width: "140px",
    },
    {
      key: "totalBookings",
      header: "Bookings",
      render: (bookings) => (
        <div className="text-center">
          <span className="text-sm font-medium text-gray-900">{bookings}</span>
        </div>
      ),
      align: "center",
      width: "100px",
    },
    {
      key: "totalSpent",
      header: "Total Spent",
      render: (amount) => (
        <span className="text-sm font-medium text-gray-900">
          {formatCurrency(amount)}
        </span>
      ),
      align: "right",
      width: "120px",
    },
    {
      key: "status",
      header: "Status",
      render: (status) => (
        <div className="flex justify-center">
          <UserStatusBadge status={status} />
        </div>
      ),
      align: "center",
      width: "140px",
    },
    {
      key: "lastBooked",
      header: "Last Booked",
      render: (date) => (
        <span className="text-sm text-gray-900">
          {date ? formatDate(date) : "N/A"}
        </span>
      ),
      align: "center",
      width: "120px",
    },
    {
      key: "actions",
      header: "Actions",
      render: (_, user) => (
        <div className="flex justify-center">
          <ActionDropdown
            user={user}
            onAction={handleUserAction}
            loading={
              actionLoading === user.id || actionLoading === (user as any)._id
            }
          />
        </div>
      ),
      align: "center",
      width: "280px",
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <Table
        columns={columns}
        data={users}
        loading={loading}
        emptyMessage="No users found"
      />
    </div>
  );
};
