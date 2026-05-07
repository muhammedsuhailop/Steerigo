import React, { useState, useEffect, useRef } from "react";
import { RideStatus } from "@/shared/types/ride.types";
import { PaymentStatus } from "@/shared/types/payment.types";
import {
  useApplyCouponMutation,
  useRemoveCouponMutation,
  useGetUserCouponsQuery,
} from "../services/viewRideApi";
import { RiTicket2Line, RiCloseCircleFill } from "react-icons/ri";
import { FaCheckCircle, FaExclamationCircle, FaTag } from "react-icons/fa";
import { CouponDetails, AvailableCoupon } from "../types/viewRide.types";
import { useDispatch } from "react-redux";
import { updateCouponData } from "../store/viewRideSlice";
import { IoChevronBack } from "react-icons/io5";
import { BaseError } from "@/shared/components/ui/ErrorHandling/ErrorHandling.types";
import { RTKQueryError } from "@/shared/api/types/errors";

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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: couponsData } = useGetUserCouponsQuery();
  const [applyCoupon, { isLoading: isApplying }] = useApplyCouponMutation();
  const [removeCoupon, { isLoading: isRemoving }] = useRemoveCouponMutation();

  const isApplied = !!couponDetails?.couponCode;

  useEffect(() => {
    if (localError) setLocalError(null);
  }, [couponCode]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const handleApply = async (code?: string) => {
    const codeToApply = code || couponCode;
    if (!codeToApply.trim()) return;
    try {
      setLocalError(null);
      setIsDropdownOpen(false);
      const result = await applyCoupon({
        rideId,
        couponCode: codeToApply,
      }).unwrap();
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
      setIsDropdownOpen(false);
    } catch (err) {
      const rtkError = err as RTKQueryError;

      const errorMessage =
        rtkError.data?.error?.userMessage ||
        rtkError.data?.error?.message ||
        rtkError.message ||
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

  const availableCoupons =
    couponsData?.data?.coupons?.filter((c: AvailableCoupon) => c.isActive) ||
    [];

  return (
    <div
      className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm mt-4 transition-all"
      ref={dropdownRef}
    >
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
        <div className="space-y-3 relative">
          <div className="relative">
            <input
              type="text"
              value={couponCode}
              onFocus={() => setIsDropdownOpen(true)}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              placeholder="ENTER COUPON CODE"
              className={`w-full bg-gray-50 border-2 rounded-2xl px-5 py-4 text-xs font-bold uppercase tracking-wide outline-none transition-all placeholder:text-gray-300 ${
                localError
                  ? "border-red-200 focus:border-red-500"
                  : "border-gray-100 focus:border-blue-500"
              }`}
            />
            <button
              onClick={() => handleApply()}
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

          {/* Coupon Listing Dropdown */}
          {isDropdownOpen && availableCoupons.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-100 rounded-2xl shadow-xl max-h-48 overflow-y-auto">
              {availableCoupons.map((coupon: AvailableCoupon) => (
                <div
                  key={coupon.id}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 border-b border-gray-50 last:border-0 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FaTag className="text-blue-500 text-xs" />
                    <div>
                      <p className="text-xs font-bold text-gray-800">
                        {coupon.code}
                      </p>
                      <p className="text-[10px] text-gray-500 font-medium">
                        {coupon.discountType === "PERCENTAGE"
                          ? `${coupon.discountValue}% OFF`
                          : `₹${coupon.discountValue} OFF`}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleApply(coupon.code)}
                    className="text-[10px] font-black text-blue-600 uppercase hover:underline"
                  >
                    Apply
                  </button>
                </div>
              ))}
            </div>
          )}

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
