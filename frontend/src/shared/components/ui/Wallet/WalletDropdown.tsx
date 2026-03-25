import React from "react";
import { useNavigate } from "react-router-dom";
import type { WalletDropdownProps } from "./Wallet.types";

export const WalletDropdown: React.FC<WalletDropdownProps> = ({
  isOpen,
  onClose,
  balance,
  transactions = [],
  currency = "INR",
}) => {
  const navigate = useNavigate();
  const displaySymbol = currency === "INR" ? "₹ " : currency + ":";

  if (!isOpen) return null;

  const handleWithdraw = () => {
    navigate("/driver/payouts");
    onClose();
  };

  const handleViewHistory = () => {
    navigate("/driver/wallet");
    onClose();
  };

  // Logic based on TransactionDirection from wallet.types.ts
  const getTransactionStyles = (direction: string) => {
    const isIncoming =
      direction.toLowerCase() === "incoming" ||
      direction.toLowerCase() === "credit";
    return {
      color: isIncoming ? "text-emerald-600" : "text-red-600",
      sign: isIncoming ? "+" : "-",
    };
  };

  return (
    <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
      <div className="p-4 border-b border-gray-200 bg-gray-50/50">
        <h3 className="text-sm font-bold text-gray-900">Driver Wallet</h3>
      </div>

      <div className="p-4">
        {/* Real Balance */}
        <div className="text-center mb-5 p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
          <p className="text-[10px] uppercase tracking-wider text-emerald-600 font-bold mb-1">
            Available Balance
          </p>
          <p className="text-3xl font-black text-emerald-700">
            {displaySymbol}
            {balance.toLocaleString("en-IN")}
          </p>
        </div>

        {/* Real Quick Actions */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleWithdraw}
            className="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors text-xs font-bold shadow-sm"
          >
            Withdraw
          </button>
          <button
            onClick={handleViewHistory}
            className="flex-1 py-2.5 px-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg transition-colors text-xs font-bold"
          >
            History
          </button>
        </div>

        {/* Recent Transactions from API */}
        <div className="mt-5 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-tight">
              Recent Activity
            </h4>
          </div>

          <div className="space-y-3">
            {transactions.length > 0 ? (
              transactions.slice(0, 4).map((transaction) => {
                const { color, sign } = getTransactionStyles(
                  transaction.direction,
                );
                return (
                  <div
                    key={transaction.id}
                    className="flex items-start justify-between group"
                  >
                    <div className="flex-1 mr-3">
                      <p className="text-xs font-semibold text-gray-800 line-clamp-1 group-hover:text-emerald-600 transition-colors">
                        {transaction.note || "System Transaction"}
                      </p>
                      <p className="text-[10px] text-gray-400">
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-bold whitespace-nowrap ${color}`}
                    >
                      {sign}
                      {displaySymbol}
                      {transaction.amount}
                    </span>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-center text-gray-400 py-2">
                No recent transactions
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
