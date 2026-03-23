import { toast } from "react-hot-toast";
import {
  useInitiatePaymentMutation,
  useVerifyPaymentMutation,
  useMarkPaymentFailedMutation,
} from "../services/viewRideApi";
import {
  PaymentFailureReason,
  PaymentMethod,
  PaymentStatus,
} from "@/shared/types/payment.types";
import { useDispatch } from "react-redux";
import { updatePaymentStatusLocal } from "../store/viewRideSlice";

export const usePayment = () => {
  const dispatch = useDispatch();

  const [initiatePayment, { isLoading: isInitiating }] =
    useInitiatePaymentMutation();
  const [verifyPayment, { isLoading: isVerifying }] =
    useVerifyPaymentMutation();
  const [markFailed] = useMarkPaymentFailedMutation();

  const handlePayment = async ({
    rideId,
    user,
  }: {
    rideId: string;
    user: { name: string; email: string };
  }) => {
    try {
      const orderResponse = await initiatePayment({
        rideId,
        method: PaymentMethod.ONLINE,
      }).unwrap();

      const paymentId = orderResponse.data.paymentId;

      let isFinalized = false;
      let lastKnownFailureReason: PaymentFailureReason | null = null;

      const safeMarkFailed = async (reason: PaymentFailureReason) => {
        if (isFinalized) return;
        isFinalized = true;
        await markFailed({ paymentId, reason }).catch(() => {});
      };

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderResponse.data.amount * 100,
        currency: orderResponse.data.currency,
        name: "Steerigo",
        description: `Payment for Ride ${rideId}`,
        order_id: orderResponse.data.gatewayOrderId,

        handler: async (response: any) => {
          isFinalized = true;
          try {
            await verifyPayment({
              paymentId,
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
            await safeMarkFailed(
              PaymentFailureReason.SIGNATURE_VERIFICATION_FAILED,
            );
            toast.error("Payment verification failed.");
          }
        },

        retry: { enabled: true },

        modal: {
          ondismiss: async () => {
            if (!isFinalized) {
              const finalReason =
                lastKnownFailureReason || PaymentFailureReason.USER_CANCELLED;

              await safeMarkFailed(finalReason);

              const message = lastKnownFailureReason
                ? "Payment failed. Please try again later."
                : "Payment cancelled.";
              toast.error(message);
            }
          },
        },
        prefill: { name: user.name, email: user.email },
        theme: { color: "#000000" },
      };

      const rzp = new (window as any).Razorpay(options);

      rzp.on("payment.failed", (response: any) => {
        const error = response?.error;

        if (error?.reason === "payment_failed") {
          lastKnownFailureReason = PaymentFailureReason.PAYMENT_DECLINED;
          toast.error("Card declined. You can try another method.");
        } else if (error?.description?.toLowerCase().includes("timeout")) {
          lastKnownFailureReason = PaymentFailureReason.TIMEOUT;
          toast.error("Request timed out.");
        } else {
          lastKnownFailureReason = PaymentFailureReason.NETWORK_ERROR;
        }
      });

      rzp.open();
    } catch (err) {
      toast.error("Could not initiate payment.");
    }
  };

  return { handlePayment, isLoading: isInitiating || isVerifying };
};
