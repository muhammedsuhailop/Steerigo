import { PayoutStatus } from "@domain/value-objects/PayoutStatus";

export interface ApprovePayoutResponseDto {
  success: boolean;
  message: string;
  data: {
    payoutId: string;
    driverId: string;
    amount: number;
    currency: string;
    status: PayoutStatus;
    processedAt: string;
    driverWalletBalanceAfter: number;
  };
}
