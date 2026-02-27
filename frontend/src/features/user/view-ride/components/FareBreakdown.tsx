import React from "react";
import { FareDetails } from "../types/viewRide.types";

interface FareBreakdownProps {
  fare: FareDetails;
}

const FareBreakdown: React.FC<FareBreakdownProps> = ({ fare }) => {
  return (
    <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
      <h4 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">
        Fare Summary
      </h4>
      <div className="space-y-3">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Base Fare</span>
          <span>₹{fare.baseFare.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Taxes & Fees</span>
          <span>
            ₹{(fare.tax.cgst + fare.tax.sgst + fare.platformFee).toFixed(2)}
          </span>
        </div>
        <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
          <span className="font-bold text-gray-900">Total Payable</span>
          <span className="text-xl font-black text-gray-900">
            {fare.currency === "INR" ? "₹" : fare.currency}{" "}
            {fare.totalFare.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default FareBreakdown;
