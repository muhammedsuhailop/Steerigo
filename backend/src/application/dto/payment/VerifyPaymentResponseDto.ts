import { PaymentStatus } from "@domain/value-objects/PaymentStatus";

export interface VerifyPaymentResponseDto {
  success: boolean;
  message: string;
  data: {
    paymentId: string;
    rideId: string;
    status: PaymentStatus;
    paidAt: string;
    amount: number;
    currency: string;
  };
}
