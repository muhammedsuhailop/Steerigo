import React from 'react';
import { Input, Select, Button, DateInput } from '@/shared/components/ui';
import { MdSearch, MdRefresh } from 'react-icons/md';
import type { DriverFilters as DriverFiltersType } from '../../../../shared/types';

interface DriverFiltersProps {
  filters: DriverFiltersType;
  onFiltersChange: (filters: Partial<DriverFiltersType>) => void;
  onResetFilters: () => void;
  loading?: boolean;
}

export const DriverFilters: React.FC<DriverFiltersProps> = ({
  filters,
  onFiltersChange,
  onResetFilters,
  loading = false,
}) => {
  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'Active', label: 'Active' },
    { value: 'Blocked', label: 'Blocked' },
    { value: 'InReview', label: 'InReview' },
  ];

  const kycStatusOptions = [
    { value: '', label: 'All KYC Status' },
    { value: 'Pending', label: 'KYC Pending' },
    { value: 'Verified', label: 'KYC Verified' },
    { value: 'Rejected', label: 'KYC Rejected' },
  ];

  const sortOptions = [
    { value: 'createdAt', label: 'Join Date' },
    { value: 'fullName', label: 'Name' },
    { value: 'rating', label: 'Rating' },
    { value: 'totalTrips', label: 'Total Trips' },
    { value: 'lastActive', label: 'Last Active' },
  ];

  const sortOrderOptions = [
    { value: 'desc', label: 'Descending' },
    { value: 'asc', label: 'Ascending' },
  ];

  const hasActiveFilters =
    filters.search ||
    filters.status ||
    filters.kycStatus ||
    filters.dateFrom ||
    filters.dateTo ||
    filters.sortBy !== 'createdAt' ||
    filters.sortOrder !== 'desc';

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Left side: Search and selects */}
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="flex-1 min-w-0">
            <Input
              placeholder="Search drivers..."
              leftIcon={<MdSearch />}
              value={filters.search}
              onChange={(e) => onFiltersChange({ search: e.target.value })}
              disabled={loading}
              size="md"
            />
          </div>

          <div className="min-w-[150px]">
            <Select
              options={statusOptions}
              value={filters.status}
              onChange={(e) => onFiltersChange({ status: e.target.value })}
              disabled={loading}
              size="md"
              placeholder="Status"
            />
          </div>

          <div className="min-w-[180px]">
            <Select
              options={kycStatusOptions}
              value={filters.kycStatus}
              onChange={(e) => onFiltersChange({ kycStatus: e.target.value })}
              disabled={loading}
              size="md"
              placeholder="KYC Status"
            />
          </div>
        </div>

        {/* Middle: Date inputs */}
        <div className="flex gap-2 min-w-[280px]">
          <div className="flex-1">
            <DateInput
              // label="From Date"
              emptyPlaceholder="From date"
              value={filters.dateFrom}
              onChange={(e) => onFiltersChange({ dateFrom: e.target.value })}
              disabled={loading}
              size="md"
            />
          </div>
          <div className="flex-1">
            <DateInput
              // label="To Date"
              emptyPlaceholder="To date"
              value={filters.dateTo}
              onChange={(e) => onFiltersChange({ dateTo: e.target.value })}
              disabled={loading}
              size="md"
            />
          </div>
        </div>

        {/* Right side: Sort and reset */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <Select
            // label="Sort By"
            options={sortOptions}
            value={filters.sortBy}
            onChange={(e) => onFiltersChange({ sortBy: e.target.value })}
            disabled={loading}
            size="md"
            className="min-w-[140px]"
          />

          <Select
            // label="Order"
            options={sortOrderOptions}
            value={filters.sortOrder}
            onChange={(e) =>
              onFiltersChange({ sortOrder: e.target.value as 'asc' | 'desc' })
            }
            disabled={loading}
            size="md"
            className="min-w-[120px]"
          />

          {hasActiveFilters && (
            <Button
              variant="outline"
              size="md"
              onClick={onResetFilters}
              leftIcon={<MdRefresh />}
            >
              Reset
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
