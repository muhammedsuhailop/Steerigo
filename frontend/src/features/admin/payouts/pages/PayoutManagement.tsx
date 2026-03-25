import React, { useState } from "react";
import {
  useGetAdminPayoutsQuery,
  useApprovePayoutMutation,
  useRejectPayoutMutation,
} from "../services/adminPayoutApi";
import { PayoutTable } from "../components/PayoutTable";
import { TablePagination } from "@/shared/components/ui/Table";
import { AdminPayoutFilters } from "../types/payout.types";
import { AdminSidebar, AdminTopbar } from "@/features/admin/shared/components";
import ApprovePayoutModal from "../components/ApprovePayoutModal";
import RejectPayoutModal from "../components/RejectPayoutModal";

export const PayoutManagement: React.FC = () => {
  const [filters, setFilters] = useState<AdminPayoutFilters>({
    page: 1,
    limit: 10,
  });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [approveId, setApproveId] = useState<string | null>(null);
  const [rejectId, setRejectId] = useState<string | null>(null);

  const { data, isLoading, isFetching } = useGetAdminPayoutsQuery(filters);
  const [approvePayout] = useApprovePayoutMutation();
  const [rejectPayout] = useRejectPayoutMutation();

  const handleApprove = (id: string) => {
    setApproveId(id);
  };
  const handleReject = (id: string) => {
    setRejectId(id);
  };

  const confirmApprove = async () => {
    if (!approveId) return;

    setActionLoadingId(approveId);
    try {
      await approvePayout(approveId).unwrap();
    } finally {
      setActionLoadingId(null);
      setApproveId(null);
    }
  };

  const submitReject = async (reason: string) => {
    if (!rejectId) return;

    setActionLoadingId(rejectId);
    try {
      await rejectPayout({ payoutId: rejectId, reason }).unwrap();
    } finally {
      setActionLoadingId(null);
      setRejectId(null);
    }
  };

  const pagination = {
    currentPage: data?.data.page || 1,
    totalPages: Math.ceil((data?.data.total || 0) / (data?.data.limit || 10)),
    totalItems: data?.data.total || 0,
    pageSize: data?.data.limit || 10,
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
          title="Admin - Payout Requests"
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        <main className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-gray-900">
                Payout Requests
              </h1>
              <p className="text-sm text-gray-500">
                Review and process driver withdrawal requests
              </p>
            </div>
          </div>

          <PayoutTable
            payouts={data?.data.payouts || []}
            loading={isLoading || isFetching}
            onApprove={handleApprove}
            onReject={handleReject}
            actionLoading={actionLoadingId}
          />

          <TablePagination
            {...pagination}
            onPageChange={(page) => setFilters({ ...filters, page })}
            onPageSizeChange={(limit) =>
              setFilters({ ...filters, limit, page: 1 })
            }
          />

          <ApprovePayoutModal
            isOpen={!!approveId}
            onClose={() => setApproveId(null)}
            onConfirm={confirmApprove}
            loading={actionLoadingId === approveId}
          />

          <RejectPayoutModal
            isOpen={!!rejectId}
            onClose={() => setRejectId(null)}
            onSubmit={submitReject}
            loading={actionLoadingId === rejectId}
          />
        </main>
      </div>
    </div>
  );
};

export default PayoutManagement;
