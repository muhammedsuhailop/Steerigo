import React, { useState } from "react";
import { AdminLayout } from "@/features/admin/shared/components/AdminLayout/AdminLayout";
import { useGetAdminCouponsQuery } from "../services/adminCouponApi";
import { AdminCouponFilters } from "../types/coupon.types";
import { TablePagination } from "@/shared/components/ui/Table";
import { CouponFilters } from "../componenets/CouponFilters";
import { CouponTable } from "../componenets/CouponTable";
import { MdAdd, MdArrowBack } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { CreateCouponModal } from "../componenets/CreateCouponModal";

export const CouponManagement: React.FC = () => {
  const navigate = useNavigate();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [filters, setFilters] = useState<AdminCouponFilters>({
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const { data, isLoading, isFetching } = useGetAdminCouponsQuery(filters);

  const handleFiltersChange = (newFilters: Partial<AdminCouponFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  const resetFilters = () => {
    setFilters({
      page: 1,
      limit: 10,
      sortBy: "createdAt",
      sortOrder: "desc",
      code: undefined,
      discountType: undefined,
      isActive: undefined,
    });
  };

  return (
    <AdminLayout title="Coupon Management">
      <main className="p-6 space-y-6 max-w-[1400px] mx-auto">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 hover:text-gray-900 rounded-lg transition-all shrink-0"
            >
              <MdArrowBack size={16} />
              <span>Back</span>
            </button>

            <CouponFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onReset={resetFilters}
              loading={isLoading || isFetching}
            />
          </div>

          <button
            className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gray-900 hover:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all w-full sm:w-auto"
            onClick={() => setIsAddModalOpen(true)}
          >
            <MdAdd size={18} />
            <span>Add New Coupon</span>
          </button>
        </header>

        <CouponTable
          coupons={data?.data.coupons || []}
          loading={isLoading || isFetching}
        />

        {data?.data.pagination && (
          <TablePagination
            currentPage={data.data.pagination.page}
            totalPages={data.data.pagination.totalPages}
            totalItems={data.data.pagination.total}
            pageSize={data.data.pagination.limit}
            onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
            onPageSizeChange={(limit) =>
              setFilters((prev) => ({ ...prev, limit, page: 1 }))
            }
          />
        )}
        <CreateCouponModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
        />
      </main>
    </AdminLayout>
  );
};

export default CouponManagement;
