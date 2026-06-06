import { Money } from "../value-objects/Money";
import { PayoutMethod } from "../value-objects/PayoutMethod";
import { PayoutStatus } from "../value-objects/PayoutStatus";
export type BankDestination = {
    type: "BANK";
    accountNumber: string;
    ifsc: string;
    beneficiaryName: string;
    bankName?: string;
};
export type UpiDestination = {
    type: "UPI";
    upiId: string;
    beneficiaryName?: string;
};
export type PayoutDestination = BankDestination | UpiDestination;
export declare class Payout {
    private readonly id;
    private readonly driverId;
    private readonly amount;
    private readonly currency;
    private status;
    private readonly method;
    private readonly destination?;
    private externalPayoutId?;
    private readonly fee?;
    private failureReason?;
    private readonly createdAt;
    private processedAt?;
    private updatedAt;
    private constructor();
    static request(params: {
        id: string;
        driverId: string;
        amount: Money;
        method: PayoutMethod;
        destination?: PayoutDestination;
        fee?: Money;
    }): Payout;
    static fromData(data: {
        id: string;
        driverId: string;
        amount: Money;
        currency: string;
        status: PayoutStatus;
        method: PayoutMethod;
        destination?: PayoutDestination;
        externalPayoutId?: string;
        fee?: Money;
        failureReason?: string;
        createdAt: Date;
        processedAt?: Date;
        updatedAt: Date;
    }): Payout;
    markProcessing(externalPayoutId?: string): void;
    markCompleted(processedAt?: Date): void;
    markFailed(reason?: string): void;
    cancel(): void;
    getId(): string;
    getDriverId(): string;
    getAmount(): Money;
    getCurrency(): string;
    getStatus(): PayoutStatus;
    getMethod(): PayoutMethod;
    getDestination(): PayoutDestination | undefined;
    getExternalPayoutId(): string | undefined;
    getFee(): Money | undefined;
    getFailureReason(): string | undefined;
    getCreatedAt(): Date;
    getProcessedAt(): Date | undefined;
    getUpdatedAt(): Date;
}
//# sourceMappingURL=Payout.d.ts.map