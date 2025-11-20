import React, { useState } from "react";
import {
  FaMoneyBillWave,
  FaReceipt,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import type { EstimatedFare } from "../types/driverSearch.types";

interface FareBreakdownProps {
  fare: EstimatedFare;
}

const FareBreakdown: React.FC<FareBreakdownProps> = ({ fare }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatCurrency = (amount: number, currency: string) => {
    return `${currency} ${amount.toFixed(2)}`;
  };

  return (
    <div className="bg-white rounded-xl p-5 shadow-md border border-gray-200">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="p-3 bg-gray-100 rounded-lg border border-gray-200">
          <FaMoneyBillWave className="text-gray-600 text-xl" />
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">
            Estimated Fare
          </h3>
          <p className="text-xs text-gray-500">
            For {fare.durationHours} hour{fare.durationHours !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Toatal Fare */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-4">
        <p className="text-sm text-gray-500">Total Fare</p>
        <p className="text-4xl font-bold text-gray-900 tracking-tight mt-1">
          {formatCurrency(fare.totalFare.amount, fare.totalFare.currency)}
        </p>
      </div>

      {/* Toggle btn */}
      <button
        onClick={() => setIsExpanded((prev) => !prev)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg border border-gray-300 transition-colors duration-200 text-gray-700 mb-3"
      >
        <span className="text-sm font-medium">
          {isExpanded ? "Hide" : "View"} Fare Breakdown
        </span>
        {isExpanded ? (
          <FaChevronUp className="text-gray-500" />
        ) : (
          <FaChevronDown className="text-gray-500" />
        )}
      </button>

      {/* breakdown */}
      <div
        className={`transition-all duration-300 overflow-hidden ${
          isExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 space-y-4">
          {/* Base Fare */}
          <div className="flex items-center justify-between pb-2 border-b border-gray-200">
            <span className="text-gray-600 text-sm">Base Fare</span>
            <span className="font-medium text-gray-900">
              {formatCurrency(fare.baseFare.amount, fare.baseFare.currency)}
            </span>
          </div>

          {/* Platform Fee */}
          <div className="flex items-center justify-between pb-2 border-b border-gray-200">
            <span className="text-gray-600 text-sm">Platform Fee</span>
            <span className="font-medium text-gray-900">
              {formatCurrency(
                fare.platformFee.amount,
                fare.platformFee.currency
              )}
            </span>
          </div>

          {/* Taxes */}
          <div className="pt-2 space-y-3">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Taxes & Charges
            </p>

            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">
                {fare.taxes.fare.name} ({fare.taxes.fare.rate}%)
              </span>
              <span className="font-semibold text-gray-900">
                {formatCurrency(
                  fare.taxes.fare.amount.amount,
                  fare.taxes.fare.amount.currency
                )}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">
                {fare.taxes.platformFee.name} ({fare.taxes.platformFee.rate}%)
              </span>
              <span className="font-semibold text-gray-900">
                {formatCurrency(
                  fare.taxes.platformFee.amount.amount,
                  fare.taxes.platformFee.amount.currency
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Note */}
      <div className="flex items-start gap-3 bg-gray-100 rounded-lg p-4 border border-gray-200 mt-4">
        <FaReceipt className="text-gray-500 text-sm mt-0.5 flex-shrink-0" />
        <p className="text-xs text-gray-600 leading-relaxed">
          This is an estimated fare. Final amount may vary based on actual
          distance and duration.
        </p>
      </div>
    </div>
  );
};

export default FareBreakdown;
