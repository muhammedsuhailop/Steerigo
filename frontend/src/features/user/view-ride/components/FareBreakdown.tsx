import React from "react";
import { FareDetails } from "../types/viewRide.types";
import { PaymentStatus } from "@/shared/types/payment.types";
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaClock,
  FaUndo,
} from "react-icons/fa";

interface FareBreakdownProps {
  fare: FareDetails;
  paymentStatus?: PaymentStatus;
}

const PAYMENT_STATUS_CONFIG = {
  [PaymentStatus.SUCCESS]: {
    container: "bg-green-50 border-green-100 text-green-700",
    label: "Payment Successful",
    icon: <FaCheckCircle className="text-lg" />,
  },
  [PaymentStatus.PENDING]: {
    container: "bg-amber-50 border-amber-100 text-amber-700",
    label: "Payment Pending",
    icon: <FaClock className="text-lg animate-pulse" />,
  },
  [PaymentStatus.FAILED]: {
    container: "bg-red-50 border-red-100 text-red-700",
    label: "Payment Failed",
    icon: <FaExclamationCircle className="text-lg" />,
  },
  [PaymentStatus.REFUNDED]: {
    container: "bg-gray-100 border-gray-200 text-gray-600",
    label: "Fully Refunded",
    icon: <FaUndo className="text-lg" />,
  },
  [PaymentStatus.PARTIALLY_REFUNDED]: {
    container: "bg-blue-50 border-blue-100 text-blue-700",
    label: "Partial Refund",
    icon: <FaUndo className="text-lg" />,
  },
};

const FareBreakdown: React.FC<FareBreakdownProps> = ({
  fare,
  paymentStatus,
}) => {
  const taxAndFees = fare.tax.total + fare.platformFee;
  const currentStatusUI = paymentStatus
    ? PAYMENT_STATUS_CONFIG[paymentStatus]
    : null;

  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6">
        Fare Summary
      </h4>

      <div className="space-y-4">
        <div className="flex justify-between text-sm font-medium text-gray-500">
          <span>Base Fare</span>
          <span className="text-gray-900">₹{fare.baseFare.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-sm font-medium text-gray-500">
          <span>Taxes & Fees</span>
          <span className="text-gray-900">₹{taxAndFees.toFixed(2)}</span>
        </div>

        <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
          <span className="font-bold text-gray-900">Total Amount</span>
          <span className="text-2xl font-black text-gray-900">
            {fare.currency === "INR" ? "₹" : fare.currency}{" "}
            {fare.totalFare.toFixed(2)}
          </span>
        </div>

        {currentStatusUI && (
          <div
            className={`mt-2 flex items-center justify-center gap-3 p-4 border rounded-2xl font-bold text-sm transition-all ${currentStatusUI.container}`}
          >
            {currentStatusUI.icon}
            <span className="uppercase tracking-wide">
              {currentStatusUI.label}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default FareBreakdown;
