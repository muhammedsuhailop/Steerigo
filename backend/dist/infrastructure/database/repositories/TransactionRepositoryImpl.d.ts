import { Transaction } from "@domain/entities/Transaction";
import { AdminTransactionQueryFilters, ITransactionRepository, TransactionQueryFilters, TransactionQueryResult } from "@domain/repositories/ITransactionRepository";
export declare class TransactionRepositoryImpl implements ITransactionRepository {
    save(transaction: Transaction): Promise<Transaction>;
    findById(id: string): Promise<Transaction | null>;
    findByWalletId(walletId: string): Promise<Transaction[]>;
    exists(id: string): Promise<boolean>;
    findPaginatedByWalletId(walletId: string, filters: TransactionQueryFilters): Promise<TransactionQueryResult>;
    findByGroupId(groupId: string): Promise<Transaction[]>;
    existsByGroupId(groupId: string): Promise<boolean>;
    findAllPaginated(filters: AdminTransactionQueryFilters): Promise<TransactionQueryResult>;
}
//# sourceMappingURL=TransactionRepositoryImpl.d.ts.map