import React, { useState } from "react";
import { Button, Table } from "@/shared/components/ui";
import { UserStatusBadge } from "../UserStatusBadge/UserStatusBadge";
import type { UserTableProps, User, UserAction } from "./UserManagement.types";
import { ActionDropdown } from "./ActionDropdown";
import type { Column } from "@/shared/components/ui/Table";
import { RiUserLine } from "react-icons/ri";
import { API_ENDPOINTS } from "@/shared/constants";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { useNavigate } from "react-router-dom";

export const UserTable: React.FC<UserTableProps> = ({
  users,
  loading,
  onUserAction,
}) => {
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const navigate = useNavigate();

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  const handleUserAction = async (userId: string, action: UserAction) => {
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
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white">
                <RiUserLine className="text-lg" />
              </div>
            )}
          </div>

          <div>
            <p className="font-semibold text-gray-900">{user.name}</p>
            <p className="text-sm text-gray-900">{user.email}</p>
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
        <span className="text-sm font-semibold text-gray-900">{bookings}</span>
      ),
      align: "center",
      width: "100px",
    },

    {
      key: "totalSpent",
      header: "Total Spent",
      render: (amount) => (
        <span className="text-sm font-semibold text-gray-900">
          {formatCurrency(amount)}
        </span>
      ),
      align: "right",
      width: "120px",
    },

    {
      key: "status",
      header: "Status",
      render: (status) => <UserStatusBadge status={status} />,
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
        <ActionDropdown
          user={user}
          loading={actionLoading === user.id}
          onAction={handleUserAction}
        />
      ),
      align: "center",
      width: "280px",
    },
    {
      key: "view-btn",
      header: "View",
      render: (_, user) => {
        const userId = user.userId;
        return (
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate(`${API_ENDPOINTS.ADMIN.USERS}/${userId}`)}
            leftIcon={<MdOutlineRemoveRedEye />}
          >
            View
          </Button>
        );
      },
      align: "center",
      width: "120px",
    },
  ];

  return (
    <Table
      columns={columns}
      data={users}
      loading={loading}
      className="w-full"
    />
  );
};

export default UserTable;
