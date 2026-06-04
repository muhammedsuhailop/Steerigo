import React, { useState, useEffect } from "react";
import { useGetPayoutsQuery } from "../services/driverPayoutApi";
import { useGetWalletDetailsQuery } from "../../wallet/services/driverWalletApi";
import { PayoutFilters } from "../types/payout.types";
import RequestPayoutModal from "../components/RequestPayoutModal";
import {
  DriverSidebar,
  DriverTopbar,
} from "@/features/driver/shared/components";
import { Footer } from "@/features/public/components";
import { PayoutStatus } from "@/shared/types/payment.types";
import PayoutTable from "../components/PayoutTable";
import { FcRefresh } from "react-icons/fc";

const PayoutPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState<PayoutFilters>({
    page: 1,
    limit: 10,
  });

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const { data: walletData } = useGetWalletDetailsQuery({});
  const { data, isLoading, isFetching, refetch } = useGetPayoutsQuery(filters);

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

  const getStatusColor = (status: PayoutStatus) => {
    switch (status) {
      case PayoutStatus.COMPLETED:
        return "bg-green-100 text-green-700";
      case PayoutStatus.FAILED:
        return "bg-red-100 text-red-700";
      case PayoutStatus.REQUESTED:
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-amber-100 text-amber-700";
    }
  };

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
        <DriverTopbar onToggleSidebar={toggleSidebar} title="Payouts" />

        {/* Main Content */}
        <main className="flex-1 max-w-7xl mx-auto px-6 lg:px-12 py-8 w-full space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-gray-900">Withdrawals</h1>
              <p className="text-sm text-gray-500">
                Manage your earnings and transfers
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => refetch()}
                disabled={isFetching}
                className="flex items-center gap-2 border border-gray-300 bg-white px-4 py-3 rounded-2xl text-sm font-semibold hover:bg-gray-50 transition-all disabled:opacity-50"
              >
                <FcRefresh
                  className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
                />
                Refresh
              </button>

              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-gray-900 text-white px-6 py-3 rounded-2xl text-sm font-bold shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Request Payout
              </button>
            </div>
          </div>

          {/* Payout Table */}
          <PayoutTable
            payouts={data?.data.payouts}
            isLoading={isLoading}
            getStatusColor={getStatusColor}
          />
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

      {/* Modal */}
      <RequestPayoutModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        availableBalance={walletData?.data.availableBalance ?? 0}
      />
    </div>
  );
};

export default PayoutPage;
