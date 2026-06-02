import { PayoutMethod } from "../../../domain/value-objects/PayoutMethod";
import { PayoutDestination } from "../../../domain/entities/Payout";
export declare class RequestPayoutDto {
    private readonly userId;
    private readonly amount;
    private readonly method;
    private readonly destination;
    private constructor();
    static create(params: {
        userId: string;
        amount: number;
        method: PayoutMethod;
        destination: PayoutDestination;
    }): RequestPayoutDto;
    getUserId(): string;
    getAmount(): number;
    getMethod(): PayoutMethod;
    getDestination(): PayoutDestination;
}
//# sourceMappingURL=RequestPayoutDto.d.ts.map