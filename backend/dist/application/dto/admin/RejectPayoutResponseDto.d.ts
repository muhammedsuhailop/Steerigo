import { PayoutStatus } from "../../../domain/value-objects/PayoutStatus";
export interface RejectPayoutResponseDto {
    payoutId: string;
    driverId: string;
    status: PayoutStatus;
    failureReason: string;
}
//# sourceMappingURL=RejectPayoutResponseDto.d.ts.map