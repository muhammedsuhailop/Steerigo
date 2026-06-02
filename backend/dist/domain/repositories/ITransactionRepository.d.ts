import { Transaction } from "@domain/entities/Transaction";
import { TransactionDirection } from "@domain/value-objects/TransactionDirection";
import { TransactionType } from "@domain/value-objects/TransactionType";
import { WalletOwnerType } from "@domain/value-objects/WalletOwnerType";
export interface TransactionQueryFilters {
    type?: TransactionType;
    direction?: TransactionDirection;
    fromDate?: Date;
    toDate?: Date;
    page: number;
    limit: number;
    sortOrder: "asc" | "desc";
}
export interface AdminTransactionQueryFilters {
    walletId?: string;
    ownerId?: string;
    ownerType?: WalletOwnerType;
    type?: TransactionType;
    direction?: TransactionDirection;
    relatedEntityId?: string;
    relatedEntityType?: string;
    fromDate?: Date;
    toDate?: Date;
    search?: string;
    page: number;
    limit: number;
    sortBy: "createdAt" | "amount";
    sortOrder: "asc" | "desc";
}
export interface TransactionQueryResult {
    transactions: Transaction[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
export interface ITransactionRepository {
    save(transaction: Transaction): Promise<Transaction>;
    findById(id: string): Promise<Transaction | null>;
    findByWalletId(walletId: string): Promise<Transaction[]>;
    exists(id: string): Promise<boolean>;
    findPaginatedByWalletId(walletId: string, filters: TransactionQueryFilters): Promise<TransactionQueryResult>;
    findByGroupId(groupId: string): Promise<Transaction[]>;
    existsByGroupId(groupId: string): Promise<boolean>;
    findAllPaginated(filters: AdminTransactionQueryFilters): Promise<TransactionQueryResult>;
}
//# sourceMappingURL=ITransactionRepository.d.ts.map