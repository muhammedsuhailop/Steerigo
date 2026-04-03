import React from "react";
import { AdminTable } from "@/shared/components/ui/AdminTable/AdminTable";
import { Formatters } from "@/shared/components/ui/AdminTable/Formatters";
import { Column } from "@/shared/components/ui/Table";
import { TransactionItem } from "../types/transaction.types";

interface TransactionTableProps {
  transactions: TransactionItem[];
  loading: boolean;
}

export const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  loading,
}) => {
  const columns: Column<TransactionItem>[] = React.useMemo(
    () => [
      {
        key: "transactionId",
        header: "Transaction ID",
        render: (id: string) => (
          <span className="text-xs font-mono text-gray-500">
            #{id.toUpperCase()}
          </span>
        ),
        width: "150px",
      },
      {
        key: "type",
        header: "Type",
        render: (type: string) => (
          <span className="px-2 py-1 rounded-md text-[10px] font-bold bg-gray-100 text-gray-700 uppercase">
            {type.replace("_", " ")}
          </span>
        ),
        width: "150px",
      },
      {
        key: "amount",
        header: "Amount",
        render: (_, item) => {
          const isCredit = item.direction === "CREDIT";
          return (
            <div className="flex flex-col">
              <span
                className={`font-bold ${isCredit ? "text-green-600" : "text-red-600"}`}
              >
                {isCredit ? "+" : "-"}{" "}
                {Formatters.formatCurrency(item.amount, item.currency)}
              </span>
              <span className="text-[10px] text-gray-400">
                {item.direction}
              </span>
            </div>
          );
        },
        width: "130px",
      },
      {
        key: "note",
        header: "Description / Related Entity",
        render: (_, item) => (
          <div className="max-w-[300px]">
            <p className="text-sm text-gray-900 truncate">
              {item.note || "No description"}
            </p>
            {item.relatedEntityId && (
              <p className="text-[10px] text-blue-600 font-medium">
                {item.relatedEntityType}: {item.relatedEntityId}
              </p>
            )}
          </div>
        ),
      },
      {
        key: "createdAt",
        header: "Date",
        render: (date: string) => (
          <span className="text-sm text-gray-600">
            {Formatters.formatDate(date, { includeTime: true })}
          </span>
        ),
        width: "180px",
      },
    ],
    [],
  );

  return (
    <AdminTable
      data={transactions}
      columns={columns}
      loading={loading}
      emptyMessage="No transactions found matching your filters."
    />
  );
};
