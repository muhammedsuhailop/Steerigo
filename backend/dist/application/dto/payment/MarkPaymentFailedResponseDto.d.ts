import { PaymentStatus } from "../../../domain/value-objects/PaymentStatus";
import { PaymentMethod } from "../../../domain/value-objects/PaymentMethod";
import { PaymentFailureReason } from "../../../domain/value-objects/PaymentFailureReason";
export interface MarkPaymentFailedResponseDto {
    success: boolean;
    message: string;
    data: {
        paymentId: string;
        rideId: string;
        status: PaymentStatus;
        method: PaymentMethod;
        failureReason: PaymentFailureReason;
        amount: number;
        currency: string;
        failedAt: string;
    };
}
//# sourceMappingURL=MarkPaymentFailedResponseDto.d.ts.map