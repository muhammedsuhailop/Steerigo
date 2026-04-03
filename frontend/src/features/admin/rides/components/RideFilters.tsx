import React from "react";
import { Select, Button, DateInput } from "@/shared/components/ui";
import { MdRefresh } from "react-icons/md";
import { AdminRideFilters, RideStatus } from "../types/ride.types";

interface RideFiltersProps {
  filters: AdminRideFilters;
  onFiltersChange: (filters: Partial<AdminRideFilters>) => void;
  onResetFilters: () => void;
  loading?: boolean;
}

export const RideFilters: React.FC<RideFiltersProps> = ({
  filters,
  onFiltersChange,
  onResetFilters,
  loading = false,
}) => {
  const formatStatusLabel = (status: string) =>
    status.charAt(0) + status.slice(1).toLowerCase();

  const statusOptions = React.useMemo(() => {
    const options = Object.values(RideStatus).map((value) => ({
      value: value as string,
      label: formatStatusLabel(value),
    }));
    return [{ value: "", label: "All Status" }, ...options];
  }, []);

  const sortOptions = [
    { value: "createdAt", label: "Request Date" },
    { value: "fare", label: "Fare Amount" },
    { value: "updatedAt", label: "Last Updated" },
  ];

  const hasActiveFilters =
    !!filters.status ||
    !!filters.fromDate ||
    !!filters.toDate ||
    filters.sortBy !== "createdAt" ||
    filters.sortOrder !== "desc";

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-end gap-4">
        {/* Status Select */}
        <div className="flex-1 min-w-[160px]">
          <Select
            label="Status"
            options={statusOptions}
            value={filters.status || ""}
            onChange={(e) => {
              const val = e.target.value;
              onFiltersChange({
                status: val ? (val as RideStatus) : undefined,
              });
            }}
            size="md"
            disabled={loading}
          />
        </div>

        {/* Date Range */}
        <div className="flex flex-col gap-1 flex-[1.5] min-w-[280px]">
          <label className="text-sm font-medium text-gray-700">
            Date Range
          </label>
          <div className="flex gap-2">
            <div className="flex-1">
              <DateInput
                emptyPlaceholder="From"
                value={filters.fromDate || ""}
                onChange={(e) => {
                  const val = e.target.value;
                  onFiltersChange({ fromDate: val || undefined });
                }}
                size="md"
                disabled={loading}
              />
            </div>
            <div className="flex-1">
              <DateInput
                emptyPlaceholder="To"
                value={filters.toDate || ""}
                onChange={(e) => {
                  const val = e.target.value;
                  onFiltersChange({ toDate: val || undefined });
                }}
                size="md"
                disabled={loading}
              />
            </div>
          </div>
        </div>

        {/* Sorting */}
        <div className="flex gap-2 flex-1 min-w-[300px]">
          <div className="flex-1">
            <Select
              label="Sort By"
              options={sortOptions}
              value={filters.sortBy}
              onChange={(e) =>
                onFiltersChange({ sortBy: e.target.value as any })
              }
              size="md"
              disabled={loading}
            />
          </div>
          <div className="w-[140px]">
            <Select
              label="Order"
              options={[
                { value: "desc", label: "Descending" },
                { value: "asc", label: "Ascending" },
              ]}
              value={filters.sortOrder}
              onChange={(e) =>
                onFiltersChange({ sortOrder: e.target.value as "asc" | "desc" })
              }
              size="md"
              disabled={loading}
            />
          </div>
        </div>

        <div className={hasActiveFilters ? "block" : "invisible lg:block"}>
          <Button
            variant="outline"
            onClick={onResetFilters}
            leftIcon={<MdRefresh />}
            disabled={loading || !hasActiveFilters}
            className="whitespace-nowrap h-[42px]"
          >
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
};
