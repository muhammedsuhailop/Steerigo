import { PaymentMethod } from "@domain/value-objects/PaymentMethod";
import { PaymentStatus } from "@domain/value-objects/PaymentStatus";
export interface OnlinePaymentInitData {
    paymentId: string;
    gatewayOrderId: string;
    amount: number;
    currency: string;
    gateway: string;
}
export interface WalletPaymentInitData {
    paymentId: string;
    status: PaymentStatus;
    amount: number;
    currency: string;
    walletBalanceAfter: number;
}
export interface CashPaymentInitData {
    paymentId: string;
    status: PaymentStatus;
    amount: number;
    currency: string;
}
export type PaymentInitData = OnlinePaymentInitData | WalletPaymentInitData | CashPaymentInitData;
export interface InitiatePaymentResponseDto {
    success: boolean;
    message: string;
    method: PaymentMethod;
    data: PaymentInitData;
}
//# sourceMappingURL=InitiatePaymentResponseDto.d.ts.map