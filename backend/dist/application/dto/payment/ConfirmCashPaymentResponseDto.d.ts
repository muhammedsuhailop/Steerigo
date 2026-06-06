import { PaymentStatus } from "../../../domain/value-objects/PaymentStatus";
export interface ConfirmCashPaymentResponseDto {
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
//# sourceMappingURL=ConfirmCashPaymentResponseDto.d.ts.map