import { DomainError } from "./DomainError";
export declare class TransactionErrors {
    static transactionNotFound(transactionId: string): DomainError;
    static invalidTransactionType(type: string): DomainError;
    static invalidTransactionDirection(direction: string): DomainError;
    static invalidOwnerType(ownerType: string): DomainError;
    static invalidDateField(fieldName: string): DomainError;
    static invalidDateRange(): DomainError;
    static invalidPaginationField(fieldName: string): DomainError;
}
//# sourceMappingURL=TransactionErrors.d.ts.map