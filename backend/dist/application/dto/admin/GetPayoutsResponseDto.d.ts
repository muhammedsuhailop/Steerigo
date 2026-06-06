import { PayoutStatus } from "../../../domain/value-objects/PayoutStatus";
import { PayoutMethod } from "../../../domain/value-objects/PayoutMethod";
import { PayoutDestination } from "../../../domain/entities/Payout";
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
    payouts: PayoutItemDto[];
    total: number;
    page: number;
    limit: number;
}
//# sourceMappingURL=GetPayoutsResponseDto.d.ts.map