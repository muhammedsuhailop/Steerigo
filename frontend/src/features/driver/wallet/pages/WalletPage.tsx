import React, { useState, useEffect } from "react";
import { useGetWalletDetailsQuery } from "../services/driverWalletApi";
import {
  WalletFilters as IWalletFilters,
  WalletFilters,
} from "../types/wallet.types";
import TransactionRow from "../components/TransactionRow";
import WalletBalanceCards from "../components/WalletBalanceCards";
import { FilterConfig } from "../../../../shared/components/ui/DriverTable/DriverFilterBar";
import {
  DriverSidebar,
  DriverTopbar,
} from "@/features/driver/shared/components";
import { Footer } from "@/features/public/components";
import FiltersBar from "../../../../shared/components/ui/DriverTable/DriverFilterBar";
import {
  TransactionDirection,
  TransactionType,
} from "@/shared/types/payment.types";

const WalletPage: React.FC = () => {
  const [filters, setFilters] = useState<IWalletFilters>({
    page: 1,
    limit: 10,
    sortOrder: "desc",
  });

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const { data, isLoading, isFetching } = useGetWalletDetailsQuery(filters);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) setSidebarCollapsed(true);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setSidebarCollapsed((prev) => !prev);
  const sidebarWidth = isMobile ? 0 : sidebarCollapsed ? 64 : 256;

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const updateFilter = (
    key: keyof IWalletFilters,
    value: string | number | undefined,
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const walletFilterConfigs: FilterConfig<WalletFilters>[] = [
    {
      key: "type",
      label: "Type",
      placeholder: "All Transactions",
      options: Object.values(TransactionType).map((t) => ({
        label: t.replace(/_/g, " "),
        value: t,
      })),
    },
    {
      key: "direction",
      label: "Direction",
      placeholder: "All Directions",
      options: [
        { label: "Credits (+)", value: TransactionDirection.CREDIT },
        { label: "Debits (-)", value: TransactionDirection.DEBIT },
      ],
    },
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Sidebar */}
      <DriverSidebar
        isCollapsed={sidebarCollapsed}
        onToggle={toggleSidebar}
        isMobile={isMobile}
      />

      <div
        className="flex-1 flex flex-col min-h-screen transition-all duration-300"
        style={{ marginLeft: isMobile ? 0 : sidebarWidth }}
      >
        {/* Topbar */}
        <DriverTopbar
          onToggleSidebar={toggleSidebar}
          title="Earnings & Wallet"
        />

        {/* Main Content */}
        <main className="flex-1 max-w-7xl mx-auto px-6 lg:px-12 py-8 w-full space-y-6">
          {/* Wallet Balance */}
          <WalletBalanceCards
            availableBalance={data?.data.availableBalance ?? 0}
            pendingBalance={data?.data.pendingBalance ?? 0}
            currency={data?.data.currency ?? "₹"}
            isLoading={isLoading}
          />

          {/* Filters */}
          <FiltersBar
            filters={filters}
            configs={walletFilterConfigs}
            onFilterChange={updateFilter}
          />

          {/* Transactions */}
          <div className="bg-white/90 backdrop-blur rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center text-sm font-bold text-gray-900">
              <h3>Recent Transactions</h3>

              {isFetching && (
                <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full" />
              )}
            </div>

            <div className="divide-y divide-gray-50">
              {data?.data.transactions.map((tx) => (
                <TransactionRow key={tx.id} transaction={tx} />
              ))}

              {!isLoading && data?.data.transactions.length === 0 && (
                <div className="p-16 text-center text-gray-400 font-medium">
                  No transactions found for the selected filters.
                </div>
              )}
            </div>

            {/* Pagination */}
            {data?.data.pagination && data.data.pagination.totalPages > 1 && (
              <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between px-8">
                <button
                  disabled={filters.page === 1}
                  onClick={() => handlePageChange(filters.page! - 1)}
                  className="px-4 py-2 text-sm font-bold text-gray-600 disabled:opacity-30 hover:bg-white rounded-xl transition-all"
                >
                  Previous
                </button>

                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Page {filters.page} of {data.data.pagination.totalPages}
                </span>

                <button
                  disabled={filters.page === data.data.pagination.totalPages}
                  onClick={() => handlePageChange(filters.page! + 1)}
                  className="px-4 py-2 text-sm font-bold text-gray-600 disabled:opacity-30 hover:bg-white rounded-xl transition-all"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </main>

        {/* Footer */}
        <Footer />
      </div>

      {/* Mobile Overlay */}
      {isMobile && !sidebarCollapsed && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
};

export default WalletPage;
