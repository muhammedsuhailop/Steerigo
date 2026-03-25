import { PayoutStatus } from "@domain/value-objects/PayoutStatus";

export interface RejectPayoutResponseDto {
  success: boolean;
  message: string;
  data: {
    payoutId: string;
    driverId: string;
    status: PayoutStatus;
    failureReason: string;
  };
}
