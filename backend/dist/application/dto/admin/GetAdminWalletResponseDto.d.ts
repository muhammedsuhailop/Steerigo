import { TransactionType } from "../../../domain/value-objects/TransactionType";
import { TransactionDirection } from "../../../domain/value-objects/TransactionDirection";
export interface AdminTransactionItemData {
    id: string;
    type: TransactionType;
    direction: TransactionDirection;
    amount: number;
    currency: string;
    signedAmount: number;
    relatedEntityId?: string;
    relatedEntityType?: string;
    groupId?: string;
    note?: string;
    createdAt: string;
}
export interface GetAdminWalletResponseDto {
    walletId: string;
    ownerId: string;
    availableBalance: number;
    pendingBalance: number;
    totalBalance: number;
    currency: string;
    updatedAt: string;
    transactions: AdminTransactionItemData[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}
//# sourceMappingURL=GetAdminWalletResponseDto.d.ts.map