import { TransactionDirection } from "../../../domain/value-objects/TransactionDirection";
import { TransactionType } from "../../../domain/value-objects/TransactionType";
export interface TransactionItem {
    transactionId: string;
    walletId: string;
    type: TransactionType;
    direction: TransactionDirection;
    amount: number;
    currency: string;
    signedAmount: number;
    relatedEntityId?: string;
    relatedEntityType?: string;
    groupId?: string;
    note?: string;
    metadata: Readonly<Record<string, string>>;
    createdAt: string;
}
export interface TransactionPagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
export interface GetAdminTransactionsResponseDto {
    success: boolean;
    data: {
        transactions: TransactionItem[];
        pagination: TransactionPagination;
    };
}
//# sourceMappingURL=GetAdminTransactionsResponseDto.d.ts.map