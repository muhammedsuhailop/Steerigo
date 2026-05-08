import React from "react";
import {
  MdPayment,
  MdCheckCircle,
  MdError,
  MdHourglassEmpty,
} from "react-icons/md";
import { StatusBadge } from "./RideDetailCards";

interface PaymentStatusCardProps {
  status?: string;
  amount: number;
  currency: string;
}

export const PaymentStatusCard: React.FC<PaymentStatusCardProps> = ({
  status,
}) => {
  const isSuccess = status === "SUCCESS";
  const isFailed = status === "FAILED";

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex-1">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MdPayment className="text-gray-400 text-xl" />
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest">
            Payment Status
          </h3>
        </div>
        <StatusBadge status={status || "PENDING"} />
      </div>

      <div
        className={`flex items-center gap-4 p-4 rounded-xl border ${
          isSuccess
            ? "bg-green-50 border-green-100"
            : isFailed
              ? "bg-red-50 border-red-100"
              : "bg-gray-50 border-gray-100"
        }`}
      >
        <div
          className={`h-10 w-10 rounded-full flex items-center justify-center text-xl shadow-sm ${
            isSuccess
              ? "bg-white text-green-600"
              : isFailed
                ? "bg-white text-red-600"
                : "bg-white text-gray-400"
          }`}
        >
          {isSuccess ? (
            <MdCheckCircle />
          ) : isFailed ? (
            <MdError />
          ) : (
            <MdHourglassEmpty />
          )}
        </div>
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase">
            Transaction Status
          </p>
          <p
            className={`text-sm font-black ${isSuccess ? "text-green-700" : "text-gray-700"}`}
          >
            {isSuccess
              ? "Successfully Processed"
              : status || "Waiting for Payment"}
          </p>
        </div>
      </div>
    </div>
  );
};
