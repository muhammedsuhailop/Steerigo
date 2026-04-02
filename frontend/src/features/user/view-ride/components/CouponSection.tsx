import React, { useState, useEffect } from "react";
import { RideStatus } from "@/shared/types/ride.types";
import { PaymentStatus } from "@/shared/types/payment.types";
import {
  useApplyCouponMutation,
  useRemoveCouponMutation,
} from "../services/viewRideApi";
import { RiTicket2Line, RiCloseCircleFill } from "react-icons/ri";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { CouponDetails } from "../types/viewRide.types";
import { useDispatch } from "react-redux";
import { updateCouponData } from "../store/viewRideSlice";
import { IoChevronBack } from "react-icons/io5";
import { ApiErrorResponse } from "@/shared/api/types/errors";
import { BaseError } from "@/shared/components/ui/ErrorHandling/ErrorHandling.types";

interface CouponSectionProps {
  rideId: string;
  status: RideStatus;
  paymentStatus?: PaymentStatus;
  couponDetails?: CouponDetails;
}

const CouponSection: React.FC<CouponSectionProps> = ({
  rideId,
  status,
  paymentStatus,
  couponDetails,
}) => {
  const dispatch = useDispatch();
  const [couponCode, setCouponCode] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const [showConfirmRemove, setShowConfirmRemove] = useState(false);

  const [applyCoupon, { isLoading: isApplying }] = useApplyCouponMutation();
  const [removeCoupon, { isLoading: isRemoving }] = useRemoveCouponMutation();

  const isApplied = !!couponDetails?.couponCode;

  useEffect(() => {
    if (localError) setLocalError(null);
  }, [couponCode]);

  const isEligibleStatus = [
    RideStatus.ACCEPTED,
    RideStatus.ARRIVED,
    RideStatus.STARTED,
    RideStatus.COMPLETED,
  ].includes(status);

  const isPaymentPending =
    !paymentStatus ||
    [PaymentStatus.PENDING, PaymentStatus.FAILED].includes(paymentStatus);

  if (!isEligibleStatus || !isPaymentPending) return null;

  const handleApply = async () => {
    if (!couponCode.trim()) return;
    try {
      setLocalError(null);
      const result = await applyCoupon({ rideId, couponCode }).unwrap();
      dispatch(
        updateCouponData({
          couponDetails: {
            couponCode: result.data.couponCode!,
            discountAmount: result.data.discountAmount,
            discountType: result.data.discountType!,
          },
          payableAmount: result.data.payableAmount,
        }),
      );
      setCouponCode("");
    } catch (err) {
      const error = err as BaseError & {
        data?: ApiErrorResponse & { message?: string };
      };

      const errorMessage =
        error.userMessage ||
        error.message ||
        error.data?.message ||
        error.data?.error?.userMessage ||
        "Failed to apply coupon.";

      setLocalError(errorMessage);
    }
  };

  const handleRemove = async () => {
    try {
      setLocalError(null);
      const result = await removeCoupon(rideId).unwrap();
      dispatch(
        updateCouponData({
          couponDetails: undefined,
          payableAmount: result.data.payableAmount,
        }),
      );
      setShowConfirmRemove(false);
    } catch (err) {
      const error = err as BaseError;
      setLocalError(
        error.userMessage || error.message || "Failed to remove coupon.",
      );
      setShowConfirmRemove(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm mt-4 transition-all">
      <div className="flex items-center gap-2 mb-4">
        <RiTicket2Line className="text-gray-600 text-lg" />
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide">
          Coupons
        </h4>
      </div>

      {isApplied ? (
        !showConfirmRemove ? (
          <div className="flex items-center justify-between bg-green-50 border border-green-100 rounded-2xl p-4 animate-in fade-in zoom-in-95 duration-300">
            <div className="flex items-center gap-3">
              <div className="bg-green-600 p-2 rounded-lg shadow-md shadow-green-100">
                <FaCheckCircle className="text-white text-xs" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-green-700 uppercase tracking-wide">
                  Applied: {couponDetails.couponCode}
                </p>
                <p className="text-sm font-extrabold text-green-900">
                  Saved ₹{couponDetails.discountAmount.toFixed(2)}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowConfirmRemove(true)}
              className="text-gray-400 hover:text-red-500 transition-colors p-1"
            >
              <RiCloseCircleFill className="text-2xl" />
            </button>
          </div>
        ) : (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-4 animate-in slide-in-from-right-4 duration-300">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-red-600">
                <FaExclamationCircle className="text-sm" />
                <p className="text-xs font-bold uppercase tracking-wide">
                  Remove this coupon?
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleRemove}
                  disabled={isRemoving}
                  className="flex-1 bg-red-600 text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wide hover:bg-red-700 transition-all disabled:opacity-50"
                >
                  {isRemoving ? "Removing..." : "Remove"}
                </button>
                <button
                  onClick={() => setShowConfirmRemove(false)}
                  className="px-4 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-all"
                >
                  <IoChevronBack className="text-sm" />
                </button>
              </div>
            </div>
          </div>
        )
      ) : (
        <div className="space-y-3">
          <div className="relative">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              placeholder="ENTER COUPON CODE"
              className={`w-full bg-gray-50 border-2 rounded-2xl px-5 py-4 text-xs font-bold uppercase tracking-wide outline-none transition-all placeholder:text-gray-300 ${
                localError
                  ? "border-red-200 focus:border-red-500"
                  : "border-gray-100 focus:border-blue-500"
              }`}
            />
            <button
              onClick={handleApply}
              disabled={isApplying || !couponCode}
              className="absolute right-2 top-2 bottom-2 px-6 bg-black text-white rounded-xl font-bold text-xs uppercase tracking-wide hover:bg-gray-800 disabled:opacity-30 transition-all min-w-[80px]"
            >
              {isApplying ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Apply"
              )}
            </button>
          </div>

          {localError && (
            <div className="flex items-center gap-2 px-1">
              <FaExclamationCircle className="text-red-500 text-xs" />
              <p className="text-[11px] font-semibold text-red-600">
                {localError}
              </p>
            </div>
          )}
        </div>
      )}
      {isApplied && status !== RideStatus.COMPLETED && (
        <p className="mt-4 text-[10px] font-medium text-gray-500 italic text-center">
          * Actual discount calculated on final fare.
        </p>
      )}
    </div>
  );
};

export default CouponSection;
