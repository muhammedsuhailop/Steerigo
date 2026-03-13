import { injectable } from "inversify";
import { Payout } from "@domain/entities/Payout";
import {
  IPayoutRepository,
  PayoutQueryFilters,
  PayoutQueryResult,
} from "@domain/repositories/IPayoutRepository";
import { PayoutModel } from "../models/PayoutModel";
import { PayoutMapper } from "../mappers/PayoutMapper";
import { Logger } from "@shared/utils/Logger";
import { PayoutStatus } from "@domain/value-objects/PayoutStatus";

@injectable()
export class PayoutRepositoryImpl implements IPayoutRepository {
  async save(payout: Payout): Promise<Payout> {
    try {
      const persistence = PayoutMapper.toPersistence(payout);

      const doc = await PayoutModel.findOneAndUpdate(
        { payoutId: payout.getId() },
        persistence,
        {
          new: true,
          upsert: true,
          runValidators: true,
        },
      ).exec();

      if (!doc) {
        throw new Error("Failed to save payout");
      }

      Logger.info("Payout saved", {
        payoutId: doc.payoutId,
        driverId: doc.driverId,
        status: doc.status,
      });

      return PayoutMapper.toDomain(doc);
    } catch (error) {
      Logger.error("Error saving payout", {
        payoutId: payout.getId(),
        error,
      });
      throw error;
    }
  }

  async findById(id: string): Promise<Payout | null> {
    try {
      const doc = await PayoutModel.findOne({ payoutId: id }).exec();

      return doc ? PayoutMapper.toDomain(doc) : null;
    } catch (error) {
      Logger.error("Error finding payout", { id, error });
      throw error;
    }
  }

  async findByDriverId(driverId: string): Promise<Payout[]> {
    try {
      const docs = await PayoutModel.find({ driverId })
        .sort({ createdAt: -1 })
        .exec();

      return docs.map(PayoutMapper.toDomain);
    } catch (error) {
      Logger.error("Error finding driver payouts", {
        driverId,
        error,
      });
      throw error;
    }
  }

  async exists(id: string): Promise<boolean> {
    try {
      const count = await PayoutModel.countDocuments({
        payoutId: id,
      }).exec();

      return count > 0;
    } catch (error) {
      Logger.error("Error checking payout existence", { id, error });
      throw error;
    }
  }

  async findPendingByDriverId(driverId: string): Promise<Payout | null> {
    const doc = await PayoutModel.findOne({
      driverId,
      status: PayoutStatus.REQUESTED,
    });
    return doc ? PayoutMapper.toDomain(doc) : null;
  }

  async findAllWithFilters(
    filters: PayoutQueryFilters,
  ): Promise<PayoutQueryResult> {
    const query: Record<string, unknown> = {};

    if (filters.status) query["status"] = filters.status;
    if (filters.driverId) query["driverId"] = filters.driverId;

    const sortField =
      filters.sortBy === "amount" ? "amount.value" : "createdAt";
    const sortDirection = filters.sortOrder === "asc" ? 1 : -1;

    const skip = (filters.page - 1) * filters.limit;

    const [docs, total] = await Promise.all([
      PayoutModel.find(query)
        .sort({ [sortField]: sortDirection })
        .skip(skip)
        .limit(filters.limit),
      PayoutModel.countDocuments(query),
    ]);

    return {
      payouts: docs.map(PayoutMapper.toDomain),
      total,
      page: filters.page,
      limit: filters.limit,
    };
  }
}
