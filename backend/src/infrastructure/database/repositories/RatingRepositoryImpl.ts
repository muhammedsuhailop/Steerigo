import { injectable } from "inversify";
import {
  IRatingRepository,
  IRatingStatsResult,
  PaginatedRatings,
  RatingFilters,
  RatingQueryOptions,
} from "@domain/repositories/IRatingRepository";
import { Rating } from "@domain/entities/Rating";
import { IRatingDocument, RatingModel } from "../models/RatingModel";
import { RatingMapper } from "../mappers/RatingMapper";
import { Logger } from "@shared/utils/Logger";
import { FilterQuery, SortOrder, Types } from "mongoose";
import { toObjectId } from "@shared/utils/idHelper";

@injectable()
export class RatingRepositoryImpl implements IRatingRepository {
  async findById(id: string): Promise<Rating | null> {
    try {
      const doc = await RatingModel.findById(id);
      return doc ? RatingMapper.toDomain(doc) : null;
    } catch (error) {
      Logger.error("Error finding rating by id", { id, error });
      throw error;
    }
  }

  async exists(id: string): Promise<boolean> {
    try {
      const count = await RatingModel.countDocuments({ _id: id });
      return count > 0;
    } catch (error) {
      Logger.error("Error checking rating existence", { id, error });
      throw error;
    }
  }

  async existsByRideAndReviewer(
    rideId: string,
    reviewerId: string,
  ): Promise<boolean> {
    try {
      const count = await RatingModel.countDocuments({
        rideId: rideId,
        reviewerId: new Types.ObjectId(reviewerId),
      });
      return count > 0;
    } catch (error) {
      Logger.error("Error checking rating existence by ride and reviewer", {
        rideId,
        reviewerId,
        error,
      });
      throw error;
    }
  }

  async save(rating: Rating): Promise<Rating> {
    try {
      const data = RatingMapper.toPersistence(rating);

      const doc = await RatingModel.findOneAndUpdate(
        {
          rideId: data.rideId,
          reviewerId: data.reviewerId,
        },
        {
          ...data,
          updatedAt: new Date(),
        },
        {
          new: true,
          upsert: true,
          runValidators: true,
        },
      );

      if (!doc) {
        throw new Error("Failed to save rating");
      }

      Logger.info("Rating saved successfully", {
        id: doc._id.toString(),
        rideId: doc.rideId.toString(),
        reviewType: doc.reviewType,
      });

      return RatingMapper.toDomain(doc);
    } catch (error) {
      Logger.error("Error saving rating", {
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await RatingModel.findByIdAndDelete(id);
    } catch (error) {
      Logger.error("Error deleting rating", { id, error });
      throw error;
    }
  }

  async findAllByRideId(rideId: string): Promise<Rating[]> {
    try {
      const docs = await RatingModel.find({
        rideId: rideId,
      });

      return docs.map(RatingMapper.toDomain);
    } catch (error) {
      Logger.error("Error finding ratings by rideId", { rideId, error });
      throw error;
    }
  }

  async findByRevieweeId(revieweeId: string): Promise<Rating[]> {
    try {
      const docs = await RatingModel.find({
        revieweeId: new Types.ObjectId(revieweeId),
      }).sort({ createdAt: -1 });

      return docs.map(RatingMapper.toDomain);
    } catch (error) {
      Logger.error("Error finding ratings by revieweeId", {
        revieweeId,
        error,
      });
      throw error;
    }
  }

  async findAll(options: RatingQueryOptions): Promise<PaginatedRatings> {
    try {
      const { filters, sortBy, sortOrder, page, limit } = options;

      const query: FilterQuery<typeof RatingModel> = {};

      if (filters.reviewType) {
        query["reviewType"] = filters.reviewType;
      }

      if (filters.reviewerId) {
        query["reviewerId"] = filters.reviewerId;
      }

      if (filters.revieweeId) {
        query["revieweeId"] = filters.revieweeId;
      }

      if (filters.rideId) {
        query["rideId"] = filters.rideId;
      }

      if (filters.minRating !== undefined || filters.maxRating !== undefined) {
        query["overallRating"] = {};
        if (filters.minRating !== undefined) {
          (query["overallRating"] as Record<string, number>)["$gte"] =
            filters.minRating;
        }
        if (filters.maxRating !== undefined) {
          (query["overallRating"] as Record<string, number>)["$lte"] =
            filters.maxRating;
        }
      }

      if (filters.fromDate || filters.toDate) {
        query["createdAt"] = {};
        if (filters.fromDate) {
          (query["createdAt"] as Record<string, Date>)["$gte"] =
            filters.fromDate;
        }
        if (filters.toDate) {
          (query["createdAt"] as Record<string, Date>)["$lte"] = filters.toDate;
        }
      }

      const mongoSortOrder: SortOrder = sortOrder === "asc" ? 1 : -1;
      const skip = (page - 1) * limit;

      const [docs, total] = await Promise.all([
        RatingModel.find(query)
          .sort({ [sortBy]: mongoSortOrder })
          .skip(skip)
          .limit(limit),
        RatingModel.countDocuments(query),
      ]);

      const ratings = docs.map((doc) => RatingMapper.toDomain(doc));

      return {
        ratings,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      Logger.error("Error finding all ratings", {
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  async getRatingStats(params: {
    reviewerId?: string;
    revieweeId?: string;
    filters: RatingFilters;
  }): Promise<IRatingStatsResult> {
    const { reviewerId, revieweeId, filters } = params;

    const query: FilterQuery<IRatingDocument> = {};

    if (reviewerId) query.reviewerId = toObjectId(reviewerId);
    if (revieweeId) query.revieweeId = toObjectId(revieweeId);

    if (filters.reviewType) query.reviewType = filters.reviewType;

    if (filters.fromDate ?? filters.toDate) {
      query.createdAt = {};
      if (filters.fromDate) query.createdAt.$gte = filters.fromDate;
      if (filters.toDate) query.createdAt.$lte = filters.toDate;
    }

    const agg = await RatingModel.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalRatings: { $sum: 1 },
          averageRating: { $avg: "$overallRating" },

          zeroToOne: {
            $sum: { $cond: [{ $lt: ["$overallRating", 1] }, 1, 0] },
          },
          oneToTwo: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $gte: ["$overallRating", 1] },
                    { $lt: ["$overallRating", 2] },
                  ],
                },
                1,
                0,
              ],
            },
          },
          twoToThree: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $gte: ["$overallRating", 2] },
                    { $lt: ["$overallRating", 3] },
                  ],
                },
                1,
                0,
              ],
            },
          },
          threeToFour: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $gte: ["$overallRating", 3] },
                    { $lt: ["$overallRating", 4] },
                  ],
                },
                1,
                0,
              ],
            },
          },
          fourToFive: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $gte: ["$overallRating", 4] },
                    { $lte: ["$overallRating", 5] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
    ]);

    const result = agg[0];

    return {
      totalRatings: result?.totalRatings ?? 0,
      averageRating: result?.averageRating
        ? parseFloat(result.averageRating.toFixed(2))
        : 0,
      distribution: {
        zeroToOne: result?.zeroToOne ?? 0,
        oneToTwo: result?.oneToTwo ?? 0,
        twoToThree: result?.twoToThree ?? 0,
        threeToFour: result?.threeToFour ?? 0,
        fourToFive: result?.fourToFive ?? 0,
      },
    };
  }
}
