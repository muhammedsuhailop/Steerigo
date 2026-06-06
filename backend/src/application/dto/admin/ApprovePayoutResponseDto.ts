import { PayoutStatus } from "@domain/value-objects/PayoutStatus";

export interface ApprovePayoutResponseDto {
    payoutId: string;
    driverId: string;
    amount: number;
    currency: string;
    status: PayoutStatus;
    processedAt: string;
    driverWalletBalanceAfter: number;
}
