import React, { useState } from "react";
import { AdminSidebar, AdminTopbar } from "@/features/admin/shared/components";
import { TablePagination } from "@/shared/components/ui/Table";
import { useGetAdminRidesQuery } from "../services/adminRideApi";
import { RideTable } from "../components/RideTable";
import { RideFilters } from "../components/RideFilters";
import { AdminRideFilters } from "../types/ride.types";

export const RideManagement: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [filters, setFilters] = useState<AdminRideFilters>({
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const { data, isLoading, isFetching } = useGetAdminRidesQuery(filters);

  const handleFiltersChange = (newFilters: Partial<AdminRideFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const resetFilters = () => {
    setFilters({ page: 1, limit: 10, sortBy: "createdAt", sortOrder: "desc" });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <div
        className="flex-1 flex flex-col transition-all duration-300"
        style={{ marginLeft: sidebarCollapsed ? "64px" : "256px" }}
      >
        <AdminTopbar
          title="Admin - Ride Management"
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <main className="p-6 space-y-6">
          <RideFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onResetFilters={resetFilters}
            loading={isLoading || isFetching}
          />

          <RideTable
            rides={data?.data.rides || []}
            loading={isLoading || isFetching}
          />

          {data?.data.pagination && (
            <TablePagination
              currentPage={data.data.pagination.page}
              totalPages={data.data.pagination.totalPages}
              totalItems={data.data.pagination.total}
              pageSize={data.data.pagination.limit}
              onPageChange={(page) => handlePageChange(page)}
              onPageSizeChange={(limit) =>
                handleFiltersChange({ limit, page: 1 })
              }
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default RideManagement;
