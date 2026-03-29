import { injectable } from "inversify";
import { IRatingRepository } from "@domain/repositories/IRatingRepository";
import { Rating } from "@domain/entities/Rating";
import { RatingModel } from "../models/RatingModel";
import { RatingMapper } from "../mappers/RatingMapper";
import { Logger } from "@shared/utils/Logger";
import { Types } from "mongoose";

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
}
