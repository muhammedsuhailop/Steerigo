import React from "react";
import { AdminCouponFilters, CouponDiscountType } from "../types/coupon.types";
import { Button } from "@/shared/components/ui";

interface Props {
  filters: AdminCouponFilters;
  onFiltersChange: (newFilters: Partial<AdminCouponFilters>) => void;
  onReset: () => void;
  loading: boolean;
}

export const CouponFilters: React.FC<Props> = ({
  filters,
  onFiltersChange,
  onReset,
  loading,
}) => {
  return (
    <div className="bg-white p-3 rounded-2xl border border-gray-200 shadow-sm flex flex-wrap gap-4 l items-end">
      <div className="flex flex-col gap-2">
        <select
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
          value={filters.discountType || ""}
          onChange={(e) =>
            onFiltersChange({
              discountType: (e.target.value as CouponDiscountType) || undefined,
            })
          }
        >
          <option value="">All Types</option>
          <option value="PERCENTAGE">Percentage</option>
          <option value="FLAT">Flat</option>
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <select
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
          value={filters.isActive === undefined ? "" : String(filters.isActive)}
          onChange={(e) =>
            onFiltersChange({
              isActive:
                e.target.value === "" ? undefined : e.target.value === "true",
            })
          }
        >
          <option value="">All Status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          disabled={loading}
        >
          Reset
        </Button>
      </div>
    </div>
  );
};
