export interface TransactionItemData {
    id: string;
    type: string;
    direction: string;
    amount: number;
    currency: string;
    relatedEntityId?: string;
    relatedEntityType?: string;
    note?: string;
    createdAt: string;
}
export interface GetDriverWalletResponseDto {
    walletId: string;
    driverId: string;
    availableBalance: number;
    pendingBalance: number;
    currency: string;
    updatedAt: string;
    transactions: TransactionItemData[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}
//# sourceMappingURL=GetDriverWalletResponseDto.d.ts.map