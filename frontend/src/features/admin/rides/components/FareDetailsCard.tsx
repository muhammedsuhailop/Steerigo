import React from "react";
import { MdPayments, MdLocalOffer } from "react-icons/md";
import { SectionHeader, DataItem } from "./RideDetailCards";
import { Formatters } from "@/shared/components/ui/AdminTable/Formatters";
import { CouponDetails } from "../types/ride.types";
import { FareDetails } from "../types/ride-details.types";

interface FareDetailsCardProps {
  fare: FareDetails;
  couponDetails?: CouponDetails;
}

export const FareDetailsCard: React.FC<FareDetailsCardProps> = ({
  fare,
  couponDetails,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 h-full flex flex-col">
      <SectionHeader icon={<MdPayments />} title="Fare Details" />

      <div className="flex-1 flex flex-col justify-center gap-6 mt-4">
        <div className="grid grid-cols-2 gap-y-6 gap-x-4">
          <DataItem
            label="Base Fare"
            value={Formatters.formatCurrency(fare.baseFare, fare.currency)}
          />
          <DataItem
            label="Platform Fee"
            value={Formatters.formatCurrency(fare.platformFee, fare.currency)}
          />
          <DataItem
            label="Tax Component"
            value={Formatters.formatCurrency(
              fare.tax.total.amount,
              fare.tax.total.currency,
            )}
          />
        </div>

        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 shadow-inner flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">
              Final Payable
            </p>
            <span className="text-blue-700 text-2xl font-black">
              {Formatters.formatCurrency(fare.payableAmount, fare.currency)}
            </span>
          </div>
        </div>

        {couponDetails && (
          <div className="flex items-center justify-between p-4 bg-orange-50 border border-orange-100 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <MdLocalOffer className="text-orange-500 text-lg" />
              </div>
              <div>
                <p className="text-sm font-black text-orange-900 uppercase">
                  {couponDetails.couponCode}
                </p>
                <p className="text-[10px] font-bold text-orange-700 uppercase">
                  {couponDetails.discountType} Applied
                </p>
              </div>
            </div>
            <span className="text-lg font-black text-orange-600">
              -{" "}
              {Formatters.formatCurrency(
                couponDetails.discountAmount,
                fare.currency,
              )}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
