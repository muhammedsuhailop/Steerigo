import React, { useState } from "react";
import { useGetAdminTransactionsQuery } from "../services/adminTransactionApi";
import { TransactionTable } from "../components/TransactionTable";
import { TablePagination } from "@/shared/components/ui/Table";
import { AdminSidebar, AdminTopbar } from "@/features/admin/shared/components";
import { AdminTransactionFilters } from "../types/transaction.types";
import { TransactionFilters } from "../components/TransactionFilters";

export const TransactionsPage: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [filters, setFilters] = useState<AdminTransactionFilters>({
    page: 1,
    limit: 20,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const { data, isLoading, isFetching } = useGetAdminTransactionsQuery(filters);

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleLimitChange = (limit: number) => {
    setFilters((prev) => ({ ...prev, limit, page: 1 }));
  };

  const handleFiltersChange = (
    newFilters: Partial<AdminTransactionFilters>,
  ) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handleResetFilters = () => {
    setFilters({
      page: 1,
      limit: 20,
      sortBy: "createdAt",
      sortOrder: "desc",
      walletId: undefined,
      type: undefined,
      direction: undefined,
      fromDate: undefined,
      toDate: undefined,
    });
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
          title="Transactions"
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        <main className="p-6 space-y-6">
          <TransactionFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onResetFilters={handleResetFilters}
            loading={isLoading || isFetching}
          />

          <TransactionTable
            transactions={data?.data.transactions || []}
            loading={isLoading || isFetching}
          />

          {data?.data.pagination && (
            <TablePagination
              currentPage={data.data.pagination.page}
              totalPages={data.data.pagination.totalPages}
              totalItems={data.data.pagination.total}
              pageSize={data.data.pagination.limit}
              onPageChange={handlePageChange}
              onPageSizeChange={handleLimitChange}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default TransactionsPage;
