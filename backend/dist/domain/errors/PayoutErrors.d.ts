import { DomainError } from "./DomainError";
export declare class PayoutErrors {
    static payoutNotFound(payoutId: string): DomainError;
    static payoutNotRequested(payoutId: string): DomainError;
    static insufficientDriverBalance(available: string, requested: string): DomainError;
    static driverWalletNotFound(driverId: string): DomainError;
    static belowMinimumAmount(minimum: string, currency: string): DomainError;
    static pendingPayoutExists(driverId: string): DomainError;
    static unauthorizedPayoutAccess(payoutId: string): DomainError;
}
//# sourceMappingURL=PayoutErrors.d.ts.map