import { PayoutStatus } from "../../../domain/value-objects/PayoutStatus";
import { PayoutMethod } from "../../../domain/value-objects/PayoutMethod";
export interface RequestPayoutResponseDto {
    payoutId: string;
    driverId: string;
    amount: number;
    currency: string;
    method: PayoutMethod;
    status: PayoutStatus;
    createdAt: string;
}
//# sourceMappingURL=RequestPayoutResponseDto.d.ts.map