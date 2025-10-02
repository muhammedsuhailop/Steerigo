import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { KYCFilters, KYCRequestsTable } from "../components";
import { fetchKYCRequests } from "@/features/admin/shared/store/adminKYCSlice";
import { useKYCOperations } from "../hooks/useKYCOperations";
import { TablePagination, LoadingSpinner } from "@/shared/components/ui";
import { AdminSidebar, AdminTopbar } from "../../shared/components";
import type { RootState, AppDispatch } from "@/app/store";

export const KYCRequestsLayout: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { requests, loading, filters, page, limit, pagination, actionLoading } =
    useSelector((state: RootState) => state.adminKYC);

  const {
    handleFiltersChange,
    handlePageChange,
    handleSizeChange,
    handleKYCAction,
    handleResetFilters,
  } = useKYCOperations();

  const { search, status, dateFrom, dateTo, sortBy, sortOrder } = filters;

  // Responsive sidebar control states
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarCollapsed(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setSidebarCollapsed((prev) => !prev);
  const sidebarWidth = isMobile ? 0 : sidebarCollapsed ? 64 : 256;

  useEffect(() => {
    dispatch(fetchKYCRequests());
  }, [
    dispatch,
    search,
    status,
    dateFrom,
    dateTo,
    sortBy,
    sortOrder,
    page,
    limit,
  ]);

  const isActionLoading = (requestId: string) => !!actionLoading[requestId];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar
        isCollapsed={sidebarCollapsed}
        onToggle={toggleSidebar}
        isMobile={isMobile}
      />

      {/* Main Content */}
      <div
        className="flex-1 flex flex-col transition-all duration-300"
        style={{ marginLeft: `${sidebarWidth}px` }}
      >
        {/* Topbar */}
        <AdminTopbar
          title="Admin - KYC Requests"
          onToggleSidebar={toggleSidebar}
        />

        {/* Page Content */}
        <div className="p-6 space-y-6">
          <KYCFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onResetFilters={handleResetFilters}
            loading={loading}
          />

          {loading ? (
            <div className="flex justify-center py-20">
              <LoadingSpinner size="large" />
            </div>
          ) : (
            <>
              <KYCRequestsTable
                requests={requests}
                loading={loading}
                onKYCAction={handleKYCAction}
                isActionLoading={isActionLoading}
              />

              <TablePagination
                currentPage={page}
                totalPages={pagination.totalPages}
                totalItems={pagination.totalItems}
                pageSize={limit}
                onPageChange={handlePageChange}
                onPageSizeChange={handleSizeChange}
              />
            </>
          )}
        </div>
      </div>

      {/* Mobile overlay for sidebar */}
      {isMobile && !sidebarCollapsed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
};

export default KYCRequestsLayout;
