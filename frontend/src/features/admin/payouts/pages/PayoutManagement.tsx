import React, { useState } from "react";
import {
  useGetAdminPayoutsQuery,
  useApprovePayoutMutation,
  useRejectPayoutMutation,
} from "../services/adminPayoutApi";
import { PayoutTable } from "../components/PayoutTable";
import { TablePagination } from "@/shared/components/ui/Table";
import { AdminPayoutFilters } from "../types/payout.types";
import ApprovePayoutModal from "../components/ApprovePayoutModal";
import RejectPayoutModal from "../components/RejectPayoutModal";
import { AdminLayout } from "../../shared/components/AdminLayout/AdminLayout";
import { FcRefresh } from "react-icons/fc";

export const PayoutManagement: React.FC = () => {
  const [filters, setFilters] = useState<AdminPayoutFilters>({
    page: 1,
    limit: 10,
  });
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [approveId, setApproveId] = useState<string | null>(null);
  const [rejectId, setRejectId] = useState<string | null>(null);

  const { data, isLoading, isFetching, refetch } =
    useGetAdminPayoutsQuery(filters);
  const [approvePayout] = useApprovePayoutMutation();
  const [rejectPayout] = useRejectPayoutMutation();

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
    <AdminLayout title="Payout Management">
      <main className="p-6 space-y-6">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black text-gray-900">
              Payout Requests
            </h1>
            <p className="text-sm text-gray-500">
              Review and process driver withdrawal requests
            </p>
          </div>

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
        </header>

        <PayoutTable
          payouts={data?.data.payouts || []}
          loading={isLoading || isFetching}
          onApprove={(id) => setApproveId(id)}
          onReject={(id) => setRejectId(id)}
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
    </AdminLayout>
  );
};

export default PayoutManagement;
