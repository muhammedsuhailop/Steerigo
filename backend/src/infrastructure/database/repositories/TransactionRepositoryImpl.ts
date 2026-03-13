import { injectable } from "inversify";
import { Transaction } from "@domain/entities/Transaction";
import {
  ITransactionRepository,
  TransactionQueryFilters,
  TransactionQueryResult,
} from "@domain/repositories/ITransactionRepository";
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

  async findPaginatedByWalletId(
    walletId: string,
    filters: TransactionQueryFilters,
  ): Promise<TransactionQueryResult> {
    const query: Record<string, unknown> = { walletId };

    if (filters.type) {
      query["type"] = filters.type;
    }

    if (filters.direction) {
      query["direction"] = filters.direction;
    }

    if (filters.fromDate ?? filters.toDate) {
      const dateFilter: Record<string, Date> = {};
      if (filters.fromDate) dateFilter["$gte"] = filters.fromDate;
      if (filters.toDate) dateFilter["$lte"] = filters.toDate;
      query["createdAt"] = dateFilter;
    }

    const sortDirection = filters.sortOrder === "asc" ? 1 : -1;
    const skip = (filters.page - 1) * filters.limit;

    const [docs, total] = await Promise.all([
      TransactionModel.find(query)
        .sort({ createdAt: sortDirection })
        .skip(skip)
        .limit(filters.limit),
      TransactionModel.countDocuments(query),
    ]);

    return {
      transactions: docs.map(TransactionMapper.toDomain),
      total,
      page: filters.page,
      limit: filters.limit,
      totalPages: Math.ceil(total / filters.limit),
    };
  }
}
