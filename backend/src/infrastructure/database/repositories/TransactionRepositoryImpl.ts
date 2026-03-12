import { injectable } from "inversify";
import { Transaction } from "@domain/entities/Transaction";
import { ITransactionRepository } from "@domain/repositories/ITransactionRepository";
import { TransactionModel } from "../models/TransactionModel";
import { TransactionMapper } from "../mappers/TransactionMapper";
import { Logger } from "@shared/utils/Logger";

@injectable()
export class TransactionRepositoryImpl implements ITransactionRepository {
  async save(transaction: Transaction): Promise<Transaction> {
    try {
      const persistence = TransactionMapper.toPersistence(transaction);

      const doc = await TransactionModel.findOneAndUpdate(
        { transactionId: transaction.getId() },
        persistence,
        {
          new: true,
          upsert: true,
          runValidators: true,
        },
      ).exec();

      if (!doc) {
        throw new Error("Failed to save transaction");
      }

      Logger.info("Transaction saved", {
        transactionId: doc.transactionId,
        walletId: doc.walletId,
      });

      return TransactionMapper.toDomain(doc);
    } catch (error) {
      Logger.error("Error saving transaction", {
        transactionId: transaction.getId(),
        error,
      });
      throw error;
    }
  }

  async findById(id: string): Promise<Transaction | null> {
    try {
      const doc = await TransactionModel.findOne({
        transactionId: id,
      }).exec();

      return doc ? TransactionMapper.toDomain(doc) : null;
    } catch (error) {
      Logger.error("Error finding transaction", { id, error });
      throw error;
    }
  }

  async findByWalletId(walletId: string): Promise<Transaction[]> {
    try {
      const docs = await TransactionModel.find({ walletId })
        .sort({ createdAt: -1 })
        .exec();

      return docs.map(TransactionMapper.toDomain);
    } catch (error) {
      Logger.error("Error finding wallet transactions", {
        walletId,
        error,
      });
      throw error;
    }
  }

  async exists(id: string): Promise<boolean> {
    try {
      const count = await TransactionModel.countDocuments({
        transactionId: id,
      }).exec();

      return count > 0;
    } catch (error) {
      Logger.error("Error checking transaction existence", { id, error });
      throw error;
    }
  }
}
