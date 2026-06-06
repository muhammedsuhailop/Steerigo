import { DomainError } from "./DomainError";
export declare class PaymentErrors {
    static rideNotCompleted(rideId: string): DomainError;
    static rideNotCompletedOrCancelled(rideId: string): DomainError;
    static paymentAlreadyExists(rideId: string): DomainError;
    static paymentNotFound(paymentId: string): DomainError;
    static paymentNotPending(paymentId: string): DomainError;
    static invalidSignature(): DomainError;
    static insufficientWalletBalance(available: string, required: string): DomainError;
    static walletNotFound(ownerId: string): DomainError;
    static unauthorizedPaymentAccess(paymentId: string): DomainError;
    static invalidPaymentMethod(method: string): DomainError;
    static cashConfirmationUnauthorized(rideId: string): DomainError;
    static invalidPaymentAmount(expected: string, received: string): DomainError;
}
//# sourceMappingURL=PaymentErrors.d.ts.map