import React from "react";
import { Button, Input, Select } from "@/shared/components/ui";
import type { UserFiltersProps } from "./UserManagement.types";
import {
  RiSearchLine,
  RiAddLine,
  RiDownloadLine,
  RiFilterLine,
} from "react-icons/ri";

export const UserFilters: React.FC<UserFiltersProps> = ({
  filters,
  onFiltersChange,
  onAddUser,
  onExport,
}) => {
  const statusOptions = [
    { value: "", label: "All Status" },
    { value: "Active", label: "Active" },
    { value: "Pending Verification", label: "Pending Verification" },
    { value: "Suspended", label: "Suspended" },
    { value: "Blocked", label: "Blocked" },
  ];

  const sortOptions = [
    { value: "name", label: "Name" },
    { value: "email", label: "Email" },
    { value: "totalBookings", label: "Total Bookings" },
    { value: "totalSpent", label: "Total Spent" },
    { value: "createdAt", label: "Date Joined" },
    { value: "lastBooked", label: "Last Booked" },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left side - Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <Input
              placeholder="Search users by name, email..."
              value={filters.search}
              onChange={(e) =>
                onFiltersChange({ ...filters, search: e.target.value })
              }
              leftIcon={<RiSearchLine className="w-4 h-4 text-gray-400" />}
              size="md"
            />
          </div>

          {/* Status Filter */}
          <div className="w-full sm:w-48">
            <Select
              options={statusOptions}
              value={filters.status}
              onChange={(e) =>
                onFiltersChange({ ...filters, status: e.target.value })
              }
              placeholder="Filter by status"
              size="md"
            />
          </div>

          {/* Sort By */}
          <div className="w-full sm:w-48">
            <Select
              options={sortOptions}
              value={filters.sortBy}
              onChange={(e) =>
                onFiltersChange({ ...filters, sortBy: e.target.value })
              }
              size="md"
            />
          </div>
        </div>

        {/* Right side - Action Buttons */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="md"
            onClick={onExport}
            leftIcon={<RiDownloadLine className="w-4 h-4" />}
          >
            Export
          </Button>

          <Button
            variant="primary"
            size="md"
            onClick={onAddUser}
            leftIcon={<RiAddLine className="w-4 h-4" />}
          >
            Add User
          </Button>
        </div>
      </div>
    </div>
  );
};
