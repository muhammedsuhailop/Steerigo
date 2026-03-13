import React from "react";
import { FareDetails } from "../types/viewRide.types";
import {
  useInitiatePaymentMutation,
  useVerifyPaymentMutation,
} from "../services/viewRideApi";
import { toast } from "react-hot-toast";
import { PaymentMethod, PaymentStatus } from "@/shared/types/payment.types";
import { RideStatus } from "@/shared/types/ride.types";
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaClock,
  FaUndo,
  FaRedo,
} from "react-icons/fa";
import { useDispatch } from "react-redux";
import { updatePaymentStatusLocal } from "../store/viewRideSlice";

interface FareBreakdownProps {
  fare: FareDetails;
  rideId: string;
  status: string;
  userName: string;
  userEmail: string;
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
  rideId,
  status,
  paymentStatus,
  userName,
  userEmail,
}) => {
  const taxAndFees = fare.tax.total + fare.platformFee;
  const [initiatePayment, { isLoading: isInitiating }] =
    useInitiatePaymentMutation();
  const [verifyPayment, { isLoading: isVerifying }] =
    useVerifyPaymentMutation();
  const dispatch = useDispatch();

  const handlePayment = async () => {
    try {
      const orderResponse = await initiatePayment({
        rideId,
        method: PaymentMethod.ONLINE,
      }).unwrap();

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderResponse.data.amount * 100,
        currency: orderResponse.data.currency,
        name: "Steerigo",
        description: `Payment for Ride ${rideId}`,
        order_id: orderResponse.data.gatewayOrderId,
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          try {
            await verifyPayment({
              paymentId: orderResponse.data.paymentId,
              gatewayPaymentId: response.razorpay_payment_id,
              gatewayOrderId: response.razorpay_order_id,
              gatewaySignature: response.razorpay_signature,
            }).unwrap();
            toast.success("Payment Successful!");
            dispatch(
              updatePaymentStatusLocal({
                paymentStatus: PaymentStatus.SUCCESS,
                paymentCompletedAt: new Date().toISOString(),
              }),
            );
          } catch (err) {
            toast.error("Payment verification failed.");
          }
        },
        prefill: {
          name: userName,
          email: userEmail,
        },
        theme: { color: "#111827" },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error("Could not initiate payment.");
    }
  };

  const shouldShowPayButton =
    status === RideStatus.COMPLETED &&
    (!paymentStatus ||
      paymentStatus === PaymentStatus.FAILED ||
      paymentStatus === PaymentStatus.PENDING);

  const currentStatusUI = paymentStatus
    ? PAYMENT_STATUS_CONFIG[paymentStatus]
    : null;

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
          <span>₹{taxAndFees.toFixed(2)}</span>
        </div>

        <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
          <span className="font-bold text-gray-900">Total Payable</span>
          <span className="text-xl font-black text-gray-900">
            {fare.currency === "INR" ? "₹" : fare.currency}{" "}
            {fare.totalFare.toFixed(2)}
          </span>
        </div>

        {currentStatusUI && (
          <div
            className={`mt-4 flex items-center justify-center gap-3 p-3 border rounded-xl font-bold text-sm transition-all ${currentStatusUI.container}`}
          >
            {currentStatusUI.icon}
            <span className="uppercase tracking-wide">
              {currentStatusUI.label}
            </span>
          </div>
        )}

        {/* Payment Button  */}
        {shouldShowPayButton && (
          <button
            onClick={handlePayment}
            disabled={isInitiating || isVerifying}
            className="w-full mt-2 bg-black text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-900 transition-all active:scale-[0.98] disabled:bg-gray-400"
          >
            {isInitiating || isVerifying ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <FaRedo
                  className={
                    paymentStatus === PaymentStatus.FAILED ? "block" : "hidden"
                  }
                />
                {paymentStatus === PaymentStatus.FAILED
                  ? "Retry Payment"
                  : "Pay Online"}
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default FareBreakdown;
