import React from "react";
import { AdminTable } from "@/shared/components/ui/AdminTable/AdminTable";
import { Formatters } from "@/shared/components/ui/AdminTable/Formatters";
import {
  renderStatusBadge,
  PayoutStatusRegistry,
} from "@/shared/components/ui/AdminTable/StatusRegistry";
import { Button } from "@/shared/components/ui";
import { MdCheck, MdClose } from "react-icons/md";
import type { Column } from "@/shared/components/ui/Table";
import { AdminPayoutItem } from "../types/payout.types";
import { PayoutStatus } from "@/shared/types/payment.types";

interface PayoutTableProps {
  payouts: AdminPayoutItem[];
  loading: boolean;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  actionLoading: string | null;
}

export const PayoutTable: React.FC<PayoutTableProps> = ({
  payouts,
  loading,
  onApprove,
  onReject,
  actionLoading,
}) => {
  const columns: Column<AdminPayoutItem>[] = React.useMemo(
    () => [
      {
        key: "payoutId",
        header: "ID",
        render: (id) => (
          <span className="text-xs font-mono text-gray-500">
            #{id.slice(-8).toUpperCase()}
          </span>
        ),
        width: "100px",
      },
      {
        key: "amount",
        header: "Amount",
        render: (_, item) => (
          <span className="font-bold text-gray-900">
            {item.currency} {item.amount.toLocaleString()}
          </span>
        ),
        width: "120px",
      },
      {
        key: "destination",
        header: "Bank Details",
        render: (_, item) => (
          <div className="text-sm">
            <p className="font-semibold text-gray-900">
              {item.destination.beneficiaryName}
            </p>
            <p className="text-gray-500">
              {item.destination.bankName} • {item.destination.accountNumber}
            </p>
            <p className="text-[10px] text-gray-400 font-mono">
              {item.destination.ifsc}
            </p>
          </div>
        ),
        width: "250px",
      },
      {
        key: "status",
        header: "Status",
        render: (status) =>
          renderStatusBadge(status as string, PayoutStatusRegistry),
        align: "center",
        width: "120px",
      },
      {
        key: "failureReason",
        header: "Note",
        render: (reason) => (
          <span className="text-xs text-red-500 font-medium italic italic-none">
            {reason || "-"}
          </span>
        ),
        width: "200px",
      },
      {
        key: "createdAt",
        header: "Requested On",
        render: (date) => (
          <span className="text-sm">
            {Formatters.formatDate(date as string)}
          </span>
        ),
        width: "150px",
      },
      {
        key: "actions",
        header: "Actions",
        render: (_, item) => {
          if (item.status !== PayoutStatus.REQUESTED) return null;
          return (
            <div className="flex items-center gap-2">
              <Button
                variant="primary"
                size="sm"
                className="bg-green-600 hover:bg-green-700"
                onClick={() => onApprove(item.payoutId)}
                isLoading={actionLoading === item.payoutId}
                leftIcon={<MdCheck />}
              >
                Approve
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 border-red-200 hover:bg-red-50"
                onClick={() => onReject(item.payoutId)}
                disabled={actionLoading === item.payoutId}
                leftIcon={<MdClose />}
              >
                Reject
              </Button>
            </div>
          );
        },
        width: "220px",
      },
    ],
    [onApprove, onReject, actionLoading],
  );

  return (
    <AdminTable
      data={payouts}
      columns={columns}
      loading={loading}
      emptyMessage="No payout requests found"
    />
  );
};
