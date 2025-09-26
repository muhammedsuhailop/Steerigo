import React from 'react';
import { Input } from '@/shared/components/ui/Input';
import { Select } from '@/shared/components/ui/Select';
import { Button } from '@/shared/components/ui/Button';
import { AdminUserFiltersProps } from '../types/component.interfaces';

export const AdminUserFilters: React.FC<AdminUserFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
}) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ search: e.target.value });
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFiltersChange({ role: e.target.value });
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFiltersChange({ status: e.target.value });
  };

  return (
    <div className="bg-white p-4 rounded-lg border mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search Input */}
        <Input
          type="text"
          placeholder="Search users..."
          value={filters.search}
          onChange={handleSearchChange}
          className="w-full"
        />

        {/* Role Filter */}
        <Select
                  value={filters.role}
                  onChange={handleRoleChange}
                  className="w-full" options={[]}        >
          <option value="">All Roles</option>
          <option value="Rider">Rider</option>
          <option value="Driver">Driver</option>
          <option value="Admin">Admin</option>
        </Select>

        {/* Status Filter */}
        <Select
                  value={filters.status}
                  onChange={handleStatusChange}
                  className="w-full" options={[]}        >
          <option value="">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
          <option value="Pending">Pending</option>
          <option value="Suspended">Suspended</option>
        </Select>

        {/* Clear Filters Button */}
        <Button
          variant="outline"
          onClick={onClearFilters}
          className="w-full"
        >
          Clear Filters
        </Button>
      </div>
    </div>
  );
};
