import React from "react";
import { Select, Button, DateInput, Input } from "@/shared/components/ui";
import { MdRefresh } from "react-icons/md";
import {
  AdminTransactionFilters,
  TransactionDirection,
} from "../types/transaction.types";
import { TransactionType } from "../types/transactionTypes";

interface TransactionFiltersProps {
  filters: AdminTransactionFilters;
  onFiltersChange: (filters: Partial<AdminTransactionFilters>) => void;
  onResetFilters: () => void;
  loading?: boolean;
}

export const TransactionFilters: React.FC<TransactionFiltersProps> = ({
  filters,
  onFiltersChange,
  onResetFilters,
  loading = false,
}) => {
  const directionOptions = [
    { value: "", label: "All Directions" },
    { value: "CREDIT", label: "Credit (+)" },
    { value: "DEBIT", label: "Debit (-)" },
  ];

  const formatEnumLabel = (key: string) => {
    return key
      .toLowerCase()
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const typeOptions = React.useMemo(() => {
    const options = Object.keys(TransactionType).map((key) => ({
      value: TransactionType[key as keyof typeof TransactionType],
      label: formatEnumLabel(key),
    }));

    return [{ value: "", label: "All Types" }, ...options];
  }, []);

  const sortOptions = [
    { value: "createdAt", label: "Transaction Date" },
    { value: "amount", label: "Amount" },
    { value: "type", label: "Type" },
  ];

  const sortOrderOptions = [
    { value: "desc", label: "Newest First" },
    { value: "asc", label: "Oldest First" },
  ];

  const hasActiveFilters =
    filters.walletId ||
    filters.type ||
    filters.direction ||
    filters.fromDate ||
    filters.toDate ||
    filters.search ||
    filters.sortBy !== "createdAt" ||
    filters.sortOrder !== "desc";

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="space-y-4">
        {/* First Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>

            <Input
              type="text"
              placeholder="Transaction ID, note..."
              value={filters.search || ""}
              onChange={(e) => onFiltersChange({ search: e.target.value })}
              disabled={loading}
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Transaction Type
            </label>

            <Select
              options={typeOptions}
              value={filters.type || ""}
              onChange={(e) =>
                onFiltersChange({
                  type: e.target.value as TransactionType,
                })
              }
              disabled={loading}
              size="md"
            />
          </div>

          {/* Direction */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Direction
            </label>

            <Select
              options={directionOptions}
              value={filters.direction || ""}
              onChange={(e) =>
                onFiltersChange({
                  direction: e.target.value as TransactionDirection,
                })
              }
              disabled={loading}
              size="md"
            />
          </div>

          {/* From Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              From Date
            </label>

            <DateInput
              emptyPlaceholder="From date"
              value={filters.fromDate || ""}
              onChange={(e) => onFiltersChange({ fromDate: e.target.value })}
              disabled={loading}
              size="md"
            />
          </div>

          {/* To Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              To Date
            </label>

            <DateInput
              emptyPlaceholder="To date"
              value={filters.toDate || ""}
              onChange={(e) => onFiltersChange({ toDate: e.target.value })}
              disabled={loading}
              size="md"
            />
          </div>
        </div>

        {/* Second Row */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full md:w-auto">
            {/* Sort By */}
            <div className="min-w-[220px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sort By
              </label>

              <Select
                options={sortOptions}
                value={filters.sortBy}
                onChange={(e) => onFiltersChange({ sortBy: e.target.value })}
                disabled={loading}
                size="md"
              />
            </div>

            {/* Sort Order */}
            <div className="min-w-[220px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sort Order
              </label>

              <Select
                options={sortOrderOptions}
                value={filters.sortOrder}
                onChange={(e) =>
                  onFiltersChange({
                    sortOrder: e.target.value as "asc" | "desc",
                  })
                }
                disabled={loading}
                size="md"
              />
            </div>
          </div>

          {/* Reset Button */}
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="md"
              onClick={onResetFilters}
              leftIcon={<MdRefresh />}
              className="text-gray-600 border-gray-300 hover:bg-gray-50 md:self-end"
            >
              Reset Filters
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
