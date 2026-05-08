import React, { useState } from "react";
import { useGetAdminTransactionsQuery } from "../services/adminTransactionApi";
import { TransactionTable } from "../components/TransactionTable";
import { TablePagination } from "@/shared/components/ui/Table";
import { AdminTransactionFilters } from "../types/transaction.types";
import { TransactionFilters } from "../components/TransactionFilters";
import { AdminLayout } from "../../shared/components/AdminLayout/AdminLayout";
import { useDebounce } from "../../../../shared/hooks/useDebounce";

export const TransactionsPage: React.FC = () => {
  // Data Fetching and Filtering Logic
  const [filters, setFilters] = useState<AdminTransactionFilters>({
    page: 1,
    limit: 20,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const debouncedSearch = useDebounce(filters.search, 500);

  const { data, isLoading, isFetching } = useGetAdminTransactionsQuery({
    ...filters,
    search: debouncedSearch,
  });

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
      search: "",
    });
  };

  return (
    <AdminLayout title="Transactions">
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
    </AdminLayout>
  );
};

export default TransactionsPage;
