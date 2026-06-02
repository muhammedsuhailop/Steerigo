import { Payout } from "@domain/entities/Payout";
import { IPayoutDocument } from "../models/PayoutModel";
import { PayoutMethod } from "@domain/value-objects/PayoutMethod";
import { PayoutStatus } from "@domain/value-objects/PayoutStatus";
import { PayoutDestination } from "@domain/entities/Payout";
export declare class PayoutMapper {
    static toDomain(doc: IPayoutDocument): Payout;
    static toPersistence(entity: Payout): {
        payoutId: string;
        driverId: string;
        amount: number;
        currency: string;
        status: PayoutStatus;
        method: PayoutMethod;
        destination: PayoutDestination | undefined;
        externalPayoutId: string | undefined;
        fee: number | undefined;
        feeCurrency: string | undefined;
        failureReason: string | undefined;
        processedAt: Date | undefined;
        updatedAt: Date;
    };
}
//# sourceMappingURL=PayoutMapper.d.ts.map