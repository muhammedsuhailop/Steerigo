import React from "react";
import { Input, Select, Button, DateInput } from "@/shared/components/ui";
import {
  MdSearch,
  MdRefresh,
  MdArrowUpward,
  MdArrowDownward,
  MdFilterAltOff,
} from "react-icons/md";
import type { KYCFilters as KYCFiltersType } from "../../../shared/types";

interface KYCFiltersProps {
  filters: KYCFiltersType;
  onFiltersChange: (filters: Partial<KYCFiltersType>) => void;
  onResetFilters: () => void;
  loading?: boolean;
}

export const KYCFilters: React.FC<KYCFiltersProps> = ({
  filters,
  onFiltersChange,
  onResetFilters,
  loading = false,
}) => {
  const statusOptions = [
    { value: "", label: "All Status" },
    { value: "Pending", label: "Pending" },
    { value: "Aproved", label: "Approved" },
    { value: "Rejected", label: "Rejected" },
  ];

  const sortOptions = [
    { value: "submittedAt", label: "Submission Date" },
    { value: "driverName", label: "Driver Name" },
    { value: "status", label: "Status" },
    { value: "updatedAt", label: "Last Updated" },
  ];

  const sortOrderOptions = [
    { value: "desc", label: "Descending" },
    { value: "asc", label: "Ascending" },
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
    onResetFilters();
  };

  const hasActiveFilters =
    filters.search ||
    filters.status ||
    filters.dateFrom ||
    filters.dateTo ||
    filters.sortBy !== "submittedAt" ||
    filters.sortOrder !== "desc";

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Left side - Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          {/* Search */}
          <div className="flex-1 min-w-0">
            <Input
              placeholder="Search by driver name, email, or license..."
              value={filters.search}
              onChange={(e) =>
                onFiltersChange({ ...filters, search: e.target.value })
              }
              leftIcon={<MdSearch />}
              size="md"
              label="Search"
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
              label="Status"
            />
          </div>

          {/* Date Range Filters */}
          <div className="flex gap-2 min-w-[300px]">
            <div className="flex-1">
              <DateInput
                label="From"
                emptyPlaceholder="From date"
                datePrefix="From:"
                value={filters.dateFrom}
                onChange={handleDateFromChange}
                size="md"
              />
            </div>
            <div className="flex-1">
              <DateInput
                label="To"
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
              value={filters.sortBy ?? "submittedAt"}
              onChange={(e) =>
                onFiltersChange({ ...filters, sortBy: e.target.value })
              }
              size="md"
              className="min-w-[140px]"
              label="Sort By"
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
                <MdArrowUpward className="h-4 w-4" />
              ) : (
                <MdArrowDownward className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="md"
              onClick={clearFilters}
              leftIcon={<MdFilterAltOff />}
            ></Button>
          )}
        </div>
      </div>
    </div>
  );
};
