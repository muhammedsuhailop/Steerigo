import { PayoutMethod, PayoutStatus } from "@/shared/types/payment.types";

export interface PayoutDestination {
  type: "BANK" | "UPI";
  accountNumber?: string;
  ifsc?: string;
  beneficiaryName?: string;
  bankName?: string;
  vpa?: string;
}

export interface PayoutItemDto {
  payoutId: string;
  driverId: string;
  amount: number;
  currency: string;
  method: PayoutMethod;
  status: PayoutStatus;
  destination?: PayoutDestination;
  failureReason?: string;
  createdAt: string;
  processedAt?: string;
  updatedAt: string;
}

export interface GetPayoutsResponseDto {
  success: boolean;
  message: string;
  data: {
    payouts: PayoutItemDto[];
    total: number;
    page: number;
    limit: number;
  };
}

export interface RequestPayoutRequest {
  amount: number;
  method: PayoutMethod;
  destination: PayoutDestination;
}

export interface PayoutFilters {
  page?: number;
  limit?: number;
  status?: PayoutStatus;
}
