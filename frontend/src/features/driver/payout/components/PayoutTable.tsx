import React from "react";
import { format } from "date-fns";
import { PayoutStatus } from "@/shared/types/payment.types";

interface Payout {
  payoutId: string;
  amount: number;
  currency: string;
  method: string;
  status: PayoutStatus;
  createdAt: string;
}

interface PayoutTableProps {
  payouts?: Payout[];
  isLoading?: boolean;
  getStatusColor: (status: PayoutStatus) => string;
}

const PayoutTable: React.FC<PayoutTableProps> = ({
  payouts = [],
  isLoading,
  getStatusColor,
}) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Date
              </th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Amount
              </th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Method
              </th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Status
              </th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Reference
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-50">
            {payouts.map((payout) => (
              <tr
                key={payout.payoutId}
                className="hover:bg-slate-50/50 transition-colors"
              >
                <td className="px-6 py-4">
                  <p className="text-sm font-semibold text-gray-900">
                    {format(new Date(payout.createdAt), "MMM dd, yyyy")}
                  </p>
                  <p className="text-[10px] text-gray-400 uppercase">
                    {format(new Date(payout.createdAt), "hh:mm a")}
                  </p>
                </td>

                <td className="px-6 py-4">
                  <span className="text-sm font-bold text-gray-900">
                    {payout.currency === "INR" ? "₹" : payout.currency}{" "}
                    {payout.amount.toLocaleString()}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <span className="text-xs font-medium text-gray-500">
                    {payout.method.replace("_", " ")}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${getStatusColor(
                      payout.status,
                    )}`}
                  >
                    {payout.status}
                  </span>
                </td>

                <td className="px-6 py-4 text-xs font-mono text-gray-400">
                  {payout.payoutId.slice(-8).toUpperCase()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!isLoading && payouts.length === 0 && (
          <div className="p-20 text-center">
            <p className="text-gray-400 font-medium">
              No payout history found.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PayoutTable;
