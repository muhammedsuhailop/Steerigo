import React from "react";
import { Button, Input, Select } from "@/shared/components/ui";
import type { UserFiltersProps } from "./UserManagement.types";
import {
  RiSearchLine,
  RiFilterLine,
  RiArrowUpLine,
  RiArrowDownLine,
} from "react-icons/ri";
import { DateInput } from "@/shared/components/ui/DateInput";

export const UserFilters: React.FC<UserFiltersProps> = ({
  filters,
  onFiltersChange,
}) => {
  const statusOptions = [
    { value: "", label: "All Status" },
    { value: "Active", label: "Active" },
    { value: "Pending Verification", label: "Pending Verification" },
    { value: "Suspended", label: "Suspended" },
    { value: "Blocked", label: "Blocked" },
    { value: "Inactive", label: "Inactive" },
  ];

  const sortOptions = [
    { value: "name", label: "Name" },
    { value: "email", label: "Email" },
    { value: "totalBookings", label: "Total Bookings" },
    { value: "totalSpent", label: "Total Spent" },
    { value: "createdAt", label: "Date Joined" },
    { value: "lastBooked", label: "Last Booked" },
    { value: "status", label: "Status" },
  ];

  const handleSortOrderToggle = () => {
    const newOrder = filters.sortOrder === "asc" ? "desc" : "asc";
    onFiltersChange({ ...filters, sortOrder: newOrder });
  };

  const handleDateFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ ...filters, dateFrom: e.target.value });
  };

  const handleDateToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ ...filters, dateTo: e.target.value });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: "",
      status: "",
      sortBy: "createdAt",
      sortOrder: "desc",
      dateFrom: "",
      dateTo: "",
    });
  };

  const hasActiveFilters =
    filters.search ||
    filters.status ||
    filters.dateFrom ||
    filters.dateTo ||
    filters.sortBy !== "createdAt" ||
    filters.sortOrder !== "desc";

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Left side - Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          {/* Search */}
          <div className="flex-1 min-w-0">
            <Input
              placeholder="Search by name or email..."
              value={filters.search}
              onChange={(e) =>
                onFiltersChange({ ...filters, search: e.target.value })
              }
              leftIcon={<RiSearchLine />}
              size="md"
            />
          </div>

          {/* Status Filter */}
          <div className="min-w-[200px]">
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

          {/* Date Range Filters */}
          <div className="flex gap-2 min-w-[300px]">
            <div className="flex-1">
              <DateInput
                emptyPlaceholder="From date"
                datePrefix="From:"
                value={filters.dateFrom}
                onChange={handleDateFromChange}
                size="md"
              />
            </div>
            <div className="flex-1">
              <DateInput
                emptyPlaceholder="To date"
                datePrefix="To:"
                value={filters.dateTo}
                onChange={handleDateToChange}
                size="md"
              />
            </div>
          </div>
        </div>

        {/* Right side - Sort and Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          {/* Sort Controls */}
          <div className="flex gap-2 items-center">
            <Select
              options={sortOptions}
              value={filters.sortBy}
              onChange={(e) =>
                onFiltersChange({ ...filters, sortBy: e.target.value })
              }
              size="md"
              className="min-w-[140px]"
            />

            <Button
              variant="outline"
              size="md"
              onClick={handleSortOrderToggle}
              className="!px-3"
              title={`Sort ${
                filters.sortOrder === "asc" ? "Ascending" : "Descending"
              }`}
            >
              {filters.sortOrder === "asc" ? (
                <RiArrowUpLine className="h-4 w-4" />
              ) : (
                <RiArrowDownLine className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="md"
              onClick={clearFilters}
              leftIcon={<RiFilterLine />}
            >
              Clear
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
