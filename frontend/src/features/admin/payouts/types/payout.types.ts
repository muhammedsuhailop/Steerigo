import { PayoutDestination } from "@/features/driver/payout/types/payout.types";
import { PayoutMethod, PayoutStatus } from "@/shared/types/payment.types";

export interface AdminPayoutItem extends Omit<any, "payoutId"> {
  payoutId: string;
  driverId: string;
  amount: number;
  currency: string;
  method: PayoutMethod;
  status: PayoutStatus;
  destination: PayoutDestination;
  failureReason?: string;
  createdAt: string;
  updatedAt: string;
  driver?: {
    name: string;
    email: string;
  };
}

export interface AdminPayoutResponse {
  success: boolean;
  message: string;
  data: {
    payouts: AdminPayoutItem[];
    total: number;
    page: number;
    limit: number;
  };
}

export interface AdminPayoutFilters {
  page?: number;
  limit?: number;
  status?: PayoutStatus;
  method?: PayoutMethod;
  search?: string;
}
