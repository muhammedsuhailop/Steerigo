import React from "react";
import { Transaction } from "../types/wallet.types";
import { format } from "date-fns";
import { TransactionDirection } from "@/shared/types/payment.types";

interface TransactionRowProps {
  transaction: Transaction;
}

const TransactionRow: React.FC<TransactionRowProps> = ({ transaction }) => {
  const isCredit = transaction.direction === TransactionDirection.CREDIT;

  const currencySymbol =
    transaction.currency === "INR" ? "₹" : transaction.currency;

  return (
    <div className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors duration-200">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {/* Indicator */}
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center font-semibold text-sm
          ${
            isCredit ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
          }`}
        >
          {isCredit ? "+" : "-"}
        </div>

        {/* Transaction Info */}
        <div className="flex flex-col">
          <p className="text-sm font-semibold text-gray-900 leading-none">
            {transaction.note}
          </p>

          <p className="text-xs text-gray-400 mt-1">
            {format(new Date(transaction.createdAt), "MMM dd, yyyy • hh:mm a")}
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="text-right flex flex-col items-end gap-1">
        <p
          className={`text-sm font-semibold tracking-tight ${
            isCredit ? "text-green-600" : "text-red-600"
          }`}
        >
          {isCredit ? "+" : "-"}
          {currencySymbol} {transaction.amount.toLocaleString()}
        </p>

        {/* Transaction Type Chip */}
        <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md">
          {transaction.type.replace(/_/g, " ")}
        </span>
      </div>
    </div>
  );
};

export default TransactionRow;
