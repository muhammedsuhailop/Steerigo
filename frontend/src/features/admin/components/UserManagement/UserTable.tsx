import React from "react";
import { Table, Badge, Button } from "@/shared/components/ui";
import type { UserTableProps, User } from "./UserManagement.types";
import type { Column } from "@/shared/components/ui/Table";
import {
  RiEyeLine,
  RiEditLine,
  RiDeleteBin6Line,
  RiUserLine,
  RiToggleLine,
  RiToggleFill,
} from "react-icons/ri";

export const UserTable: React.FC<UserTableProps> = ({
  users,
  loading,
  onUserClick,
  onDeleteUser,
  onToggleStatus,
}) => {
  const getBadgeVariant = (status: string) => {
    switch (status) {
      case "active":
        return "success";
      case "inactive":
        return "secondary";
      case "suspended":
        return "danger";
      default:
        return "secondary";
    }
  };

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

  const columns: Column<User>[] = [
    {
      key: "name",
      header: "User",
      render: (_, user) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <RiUserLine className="w-5 h-5 text-gray-500" />
            )}
          </div>
          <div>
            <div className="font-medium text-gray-900">{user.name}</div>
            <div className="text-sm text-gray-500">{user.email}</div>
          </div>
        </div>
      ),
      width: "300px",
    },
    {
      key: "phone",
      header: "Phone",
      render: (phone) => phone || "-",
      width: "150px",
    },
    {
      key: "totalBookings",
      header: "Total Bookings",
      align: "center",
      width: "120px",
    },
    {
      key: "totalSpent",
      header: "Total Spent",
      render: (amount) => formatCurrency(amount),
      align: "right",
      width: "120px",
    },
    {
      key: "status",
      header: "Status",
      render: (status) => (
        <Badge variant={getBadgeVariant(status)} size="sm">
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      ),
      align: "center",
      width: "100px",
    },
    {
      key: "lastBooked",
      header: "Last Booked",
      render: (date) => (date ? formatDate(date) : "Never"),
      align: "center",
      width: "120px",
    },
    {
      key: "actions",
      header: "Actions",
      render: (_, user) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onUserClick(user);
            }}
            leftIcon={<RiEyeLine className="w-4 h-4" />}
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          >
            View
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onToggleStatus(user);
            }}
            leftIcon={
              user.status === "Active" ? (
                <RiToggleFill className="w-4 h-4 text-green-600" />
              ) : (
                <RiToggleLine className="w-4 h-4 text-gray-400" />
              )
            }
            className={`${
              user.status === "Active"
                ? "text-green-600 hover:text-green-700 hover:bg-green-50"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            {user.status === "Active" ? "Deactivate" : "Activate"}
          </Button>
        </div>
      ),
      align: "center",
      width: "200px",
    },
  ];

  return (
    <Table
      columns={columns}
      data={users}
      loading={loading}
      emptyMessage="No users found"
      onRowClick={onUserClick}
      hoverable
      striped
    />
  );
};
