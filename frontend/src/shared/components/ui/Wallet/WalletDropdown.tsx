import React from "react";
import type { WalletDropdownProps, Transaction } from "./Wallet.types";

const mockTransactions: Transaction[] = [
  {
    id: "1",
    type: "credit",
    description: "Ride Payment",
    amount: 250,
    timestamp: "2 minutes ago",
    category: "ride_payment",
  },
  {
    id: "2",
    type: "credit",
    description: "Night Bonus",
    amount: 50,
    timestamp: "1 hour ago",
    category: "bonus",
  },
  {
    id: "3",
    type: "debit",
    description: "Platform Fee",
    amount: 25,
    timestamp: "2 hours ago",
    category: "fee",
  },
];

export const WalletDropdown: React.FC<WalletDropdownProps> = ({
  isOpen,
  onClose,
  balance,
  transactions = mockTransactions,
  onWithdraw,
  onViewHistory,
  currency = "₹",
}) => {
  if (!isOpen) return null;

  const handleWithdraw = () => {
    if (onWithdraw) {
      onWithdraw();
    }
    onClose();
  };

  const handleViewHistory = () => {
    if (onViewHistory) {
      onViewHistory();
    }
    onClose();
  };

  const getTransactionColor = (type: Transaction["type"]): string => {
    return type === "credit" ? "text-emerald-600" : "text-red-600";
  };

  const getTransactionSign = (type: Transaction["type"]): string => {
    return type === "credit" ? "+" : "-";
  };

  return (
    <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900">Wallet</h3>
      </div>
      <div className="p-4">
        {/* Balance */}
        <div className="text-center mb-4">
          <p className="text-xs text-gray-500 mb-1">Available Balance</p>
          <p className="text-2xl font-bold text-emerald-600">
            {currency}
            {balance.toLocaleString()}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="space-y-2">
          <button
            onClick={handleWithdraw}
            className="w-full py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg transition-colors text-sm font-medium"
          >
            Withdraw Money
          </button>
          <button
            onClick={handleViewHistory}
            className="w-full py-2 px-3 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors text-sm font-medium"
          >
            Transaction History
          </button>
        </div>

        {/* Recent Transactions */}
        {transactions.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h4 className="text-xs font-medium text-gray-700 mb-2">Recent</h4>
            <div className="space-y-2">
              {transactions.slice(0, 3).map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between text-xs"
                >
                  <span className="text-gray-600 truncate flex-1 mr-2">
                    {transaction.description}
                  </span>
                  <span
                    className={`font-medium ${getTransactionColor(
                      transaction.type
                    )}`}
                  >
                    {getTransactionSign(transaction.type)}
                    {currency}
                    {transaction.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
