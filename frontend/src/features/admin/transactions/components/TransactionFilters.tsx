import React from "react";
import { Select, Button, DateInput } from "@/shared/components/ui";
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
    filters.sortBy !== "createdAt" ||
    filters.sortOrder !== "desc";

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="min-w-[150px]">
            <Select
              options={typeOptions}
              value={filters.type || ""}
              onChange={(e) =>
                onFiltersChange({ type: e.target.value as TransactionType })
              }
              disabled={loading}
              size="md"
              placeholder="Transaction Type"
            />
          </div>

          <div className="min-w-[150px]">
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
              placeholder="Direction"
            />
          </div>
        </div>

        <div className="flex gap-2 min-w-[280px]">
          <div className="flex-1">
            <DateInput
              emptyPlaceholder="From date"
              value={filters.fromDate || ""}
              onChange={(e) => onFiltersChange({ fromDate: e.target.value })}
              disabled={loading}
              size="md"
            />
          </div>
          <div className="flex-1">
            <DateInput
              emptyPlaceholder="To date"
              value={filters.toDate || ""}
              onChange={(e) => onFiltersChange({ toDate: e.target.value })}
              disabled={loading}
              size="md"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <Select
            options={sortOptions}
            value={filters.sortBy}
            onChange={(e) => onFiltersChange({ sortBy: e.target.value })}
            disabled={loading}
            size="md"
            className="min-w-[160px]"
          />

          <Select
            options={sortOrderOptions}
            value={filters.sortOrder}
            onChange={(e) =>
              onFiltersChange({ sortOrder: e.target.value as "asc" | "desc" })
            }
            disabled={loading}
            size="md"
            className="min-w-[130px]"
          />

          {hasActiveFilters && (
            <Button
              variant="outline"
              size="md"
              onClick={onResetFilters}
              leftIcon={<MdRefresh />}
              className="text-gray-600 border-gray-300 hover:bg-gray-50"
            >
              Reset
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
