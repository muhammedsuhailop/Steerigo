import { Transaction } from "@domain/entities/Transaction";

export interface ITransactionRepository {
  save(transaction: Transaction): Promise<Transaction>;
  findById(id: string): Promise<Transaction | null>;
  findByWalletId(walletId: string): Promise<Transaction[]>;
  exists(id: string): Promise<boolean>;
}
