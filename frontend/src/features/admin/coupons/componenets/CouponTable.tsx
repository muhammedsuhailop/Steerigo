import React, { useMemo } from "react";
import { MdEdit } from "react-icons/md";
import { CouponData } from "../types/coupon.types";
import { Formatters } from "@/shared/components/ui/AdminTable/Formatters";
import {
  AdminTable,
  createColumnBuilder,
} from "@/shared/components/ui/AdminTable/AdminTable";
import { AdminTableRow } from "@/shared/components/ui/AdminTable/AdminTable.types";

interface CouponRow extends CouponData, AdminTableRow {}

interface Props {
  coupons: CouponRow[];
  onEdit: (coupon: CouponData) => void;
  loading: boolean;
}

export const CouponTable: React.FC<Props> = ({ coupons, loading, onEdit }) => {
  const columns = useMemo(() => {
    return createColumnBuilder<CouponRow>()
      .addTextColumn("code", "Code", { width: "150px" })
      .addCustomColumn(
        "discount",
        "Discount",
        (_, row) => (
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-900">
              {row.discountType === "PERCENTAGE"
                ? `${row.discountValue}%`
                : Formatters.formatCurrency(row.discountValue, "INR")}
            </span>
            {row.maxDiscount && (
              <p className="text-[10px] text-gray-400 tracking-tighter">
                Up to {Formatters.formatCurrency(row.maxDiscount, "INR")}
              </p>
            )}
          </div>
        ),
        { width: "150px" },
      )
      .addCustomColumn(
        "usage",
        "Usage Limit",
        (_, row) => (
          <div className="flex flex-col">
            <span className="font-semibold text-gray-700 text-sm">
              {row.usagePerUser ? `${row.usagePerUser} per User` : "∞ per User"}
            </span>
          </div>
        ),
        { width: "180px" },
      )
      .addCustomColumn(
        "validity",
        "Validity",
        (_, row) => (
          <div className="flex flex-col gap-0.5">
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">
              {row.validFrom
                ? Formatters.formatDate(row.validFrom)
                : "START N/A"}
            </div>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">
              TO {row.validTo ? Formatters.formatDate(row.validTo) : "END N/A"}
            </div>
          </div>
        ),
        { width: "180px" },
      )
      .addStatusColumn(
        "isActive",
        "Status",
        (isActive) => (
          <span
            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${
              isActive
                ? "bg-green-50 text-green-700 border-green-200"
                : "bg-red-50 text-red-700 border-red-200"
            }`}
          >
            {isActive ? "Active" : "Inactive"}
          </span>
        ),
        { width: "120px" },
      )
      .addActionsColumn(
        (row) => (
          <button
            className="flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 hover:text-gray-900 rounded-lg transition-all"
            title={`Edit ${row.code}`}
            onClick={(e) => {
              e.stopPropagation();
              onEdit(row);
            }}
          >
            <span>Edit</span>
            <MdEdit size={14} />
          </button>
        ),
        { width: "120px" },
      )
      .build();
  }, [onEdit]);

  return (
    <AdminTable
      data={coupons}
      columns={columns}
      loading={loading}
      emptyMessage="No coupons found."
      className="bg-white shadow-sm"
    />
  );
};
