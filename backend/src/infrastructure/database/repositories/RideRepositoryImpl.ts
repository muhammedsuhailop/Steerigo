import { injectable } from "inversify";
import {
  IAdminRidePaginationOptions,
  IDriverRideStatsResult,
  IRideFilters,
  IRidePaginationOptions,
  IRideRepository,
} from "@domain/repositories/IRideRepository";
import { Ride } from "@domain/entities/Ride";
import { RideStatus } from "@domain/value-objects/RideStatus";
import { RideModel, IRideDocument } from "../models/RideModel";
import { RideMapper } from "../mappers/RideMapper";
import { Logger } from "@shared/utils/Logger";
import { FilterQuery, SortOrder, Types } from "mongoose";
import { PaginatedResult } from "@shared/types/Repository";
import { RideErrors } from "@domain/errors/RideErrors";

@injectable()
export class RideRepositoryImpl implements IRideRepository {
  async findById(id: string): Promise<Ride | null> {
    try {
      const doc = await RideModel.findById(id);
      return doc ? RideMapper.toDomain(doc) : null;
    } catch (error) {
      Logger.error("Error finding ride by id", { id, error });
      throw error;
    }
  }

  async exists(id: string): Promise<boolean> {
    try {
      const count = await RideModel.countDocuments({ _id: id });
      return count > 0;
    } catch (error) {
      Logger.error("Error checking ride existence", { id, error });
      throw error;
    }
  }

  async save(ride: Ride): Promise<Ride> {
    try {
      const rideData = RideMapper.toPersistence(ride);

      const doc = await RideModel.findOneAndUpdate(
        { rideId: rideData.rideId },
        {
          ...rideData,
          updatedAt: new Date(),
        },
        {
          new: true,
          runValidators: true,
          upsert: true,
        },
      );

      if (!doc) {
        throw RideErrors.rideNotFound(ride.getRideId());
      }

      Logger.info("Ride updated successfully", {
        id: doc._id.toString(),
        rideId: doc.rideId,
        status: doc.status,
      });

      return RideMapper.toDomain(doc);
    } catch (error) {
      Logger.error("Error saving ride", {
        rideId: ride.getRideId(),
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const result = await RideModel.findByIdAndDelete(id);

      if (result) {
        Logger.info("Ride deleted successfully", {
          id,
          rideId: result.rideId,
        });
      } else {
        Logger.warn("Ride not found for deletion", { id });
      }
    } catch (error) {
      Logger.error("Error deleting ride", { id, error });
      throw error;
    }
  }

  async findByRideId(rideId: string): Promise<Ride | null> {
    try {
      const doc = await RideModel.findOne({ rideId });
      return doc ? RideMapper.toDomain(doc) : null;
    } catch (error) {
      Logger.error("Error finding ride by rideId", { rideId, error });
      throw error;
    }
  }

  async findActiveRideByDriverId(driverId: string): Promise<Ride | null> {
    try {
      const doc = await RideModel.findOne({
        driverId: new Types.ObjectId(driverId),
        status: {
          $in: [RideStatus.ACCEPTED, RideStatus.ARRIVED, RideStatus.STARTED],
        },
      }).sort({ createdAt: -1 });

      if (doc) {
        Logger.debug("Active ride found for driver", {
          driverId,
          rideId: doc.rideId,
          status: doc.status,
        });
      }

      return doc ? RideMapper.toDomain(doc) : null;
    } catch (error) {
      Logger.error("Error finding active ride by driver ID", {
        driverId,
        error,
      });
      throw error;
    }
  }

  async findActiveRideByRiderId(riderId: string): Promise<Ride | null> {
    try {
      const doc = await RideModel.findOne({
        riderId: new Types.ObjectId(riderId),
        status: { $in: [RideStatus.ACCEPTED, RideStatus.STARTED] },
      }).sort({ createdAt: -1 });

      if (doc) {
        Logger.debug("Active ride found for rider", {
          riderId,
          rideId: doc.rideId,
          status: doc.status,
        });
      }

      return doc ? RideMapper.toDomain(doc) : null;
    } catch (error) {
      Logger.error("Error finding active ride by rider ID", {
        riderId,
        error,
      });
      throw error;
    }
  }

  async findByDriverId(driverId: string, status?: RideStatus): Promise<Ride[]> {
    try {
      const query: any = {
        driverId: new Types.ObjectId(driverId),
      };

      if (status) {
        query.status = status;
      }

      const docs = await RideModel.find(query).sort({ createdAt: -1 });

      Logger.debug("Rides found for driver", {
        driverId,
        status,
        count: docs.length,
      });

      return docs.map(RideMapper.toDomain);
    } catch (error) {
      Logger.error("Error finding rides by driver ID", {
        driverId,
        status,
        error,
      });
      throw error;
    }
  }

  async findByRiderId(riderId: string, status?: RideStatus): Promise<Ride[]> {
    try {
      const query: any = {
        riderId: new Types.ObjectId(riderId),
      };

      if (status) {
        query.status = status;
      }

      const docs = await RideModel.find(query).sort({ createdAt: -1 });

      Logger.debug("Rides found for rider", {
        riderId,
        status,
        count: docs.length,
      });

      return docs.map(RideMapper.toDomain);
    } catch (error) {
      Logger.error("Error finding rides by rider ID", {
        riderId,
        status,
        error,
      });
      throw error;
    }
  }

  async findPaginatedByDriverId(
    driverId: string,
    options: IRidePaginationOptions,
  ): Promise<PaginatedResult<Ride>> {
    try {
      const { page, limit, sortBy, sortOrder, status, fromDate, toDate } =
        options;

      const query: FilterQuery<IRideDocument> = {
        driverId: new Types.ObjectId(driverId),
      };

      if (status) {
        query.status = status;
      }

      if (fromDate || toDate) {
        query.createdAt = {};
        if (fromDate) {
          query.createdAt.$gte = fromDate;
        }
        if (toDate) {
          query.createdAt.$lte = toDate;
        }
      }

      const sortValue: Record<string, SortOrder> = {
        [sortBy]: sortOrder === "asc" ? 1 : -1,
      };

      const total = await RideModel.countDocuments(query);
      const totalPages = Math.ceil(total / limit);
      const skip = (page - 1) * limit;

      const docs = await RideModel.find(query)
        .sort(sortValue)
        .skip(skip)
        .limit(limit)
        .exec();

      const data = docs.map(RideMapper.toDomain);

      Logger.debug("Paginated rides fetched for driver", {
        driverId,
        total,
        page,
        limit,
        status,
      });

      return {
        data,
        total,
        page,
        limit,
        totalPages,
      };
    } catch (error) {
      Logger.error("Error finding paginated rides by driver ID", {
        driverId,
        options,
        error,
      });
      throw error;
    }
  }

  async findPaginatedByRiderId(
    riderId: string,
    options: IRidePaginationOptions,
  ): Promise<PaginatedResult<Ride>> {
    try {
      const { page, limit, sortBy, sortOrder, status, fromDate, toDate } =
        options;

      const query: FilterQuery<IRideDocument> = {
        riderId: new Types.ObjectId(riderId),
      };

      if (status) {
        query.status = status;
      }

      if (fromDate ?? toDate) {
        query.createdAt = {};
        if (fromDate) {
          query.createdAt.$gte = fromDate;
        }
        if (toDate) {
          query.createdAt.$lte = toDate;
        }
      }

      const sortValue: Record<string, SortOrder> = {
        [sortBy]: sortOrder === "asc" ? 1 : -1,
      };

      const total = await RideModel.countDocuments(query);
      const totalPages = Math.ceil(total / limit);
      const skip = (page - 1) * limit;

      const docs = await RideModel.find(query)
        .sort(sortValue)
        .skip(skip)
        .limit(limit)
        .exec();

      const data = docs.map(RideMapper.toDomain);

      Logger.debug("Paginated rides fetched for rider", {
        riderId,
        total,
        page,
        limit,
        status,
      });

      return { data, total, page, limit, totalPages };
    } catch (error) {
      Logger.error("Error finding paginated rides by rider ID", {
        riderId,
        options,
        error,
      });
      throw error;
    }
  }

  async findPaginatedAll(
    options: IAdminRidePaginationOptions,
  ): Promise<PaginatedResult<Ride>> {
    try {
      const {
        page,
        limit,
        sortBy,
        sortOrder,
        status,
        fromDate,
        toDate,
        riderId,
        driverId,
      } = options;

      const query: FilterQuery<IRideDocument> = {};

      if (status) {
        query.status = status;
      }

      if (riderId) {
        query.riderId = new Types.ObjectId(riderId);
      }

      if (driverId) {
        query.driverId = new Types.ObjectId(driverId);
      }

      if (fromDate ?? toDate) {
        query.createdAt = {};
        if (fromDate) {
          query.createdAt.$gte = fromDate;
        }
        if (toDate) {
          query.createdAt.$lte = toDate;
        }
      }

      const sortValue: Record<string, SortOrder> = {
        [sortBy]: sortOrder === "asc" ? 1 : -1,
      };

      const total = await RideModel.countDocuments(query);
      const totalPages = Math.ceil(total / limit);
      const skip = (page - 1) * limit;

      const docs = await RideModel.find(query)
        .sort(sortValue)
        .skip(skip)
        .limit(limit)
        .exec();

      const data = docs.map(RideMapper.toDomain);

      Logger.debug("Admin paginated rides fetched", {
        total,
        page,
        limit,
        status,
        riderId,
        driverId,
      });

      return { data, total, page, limit, totalPages };
    } catch (error) {
      Logger.error("Error finding paginated rides for admin", {
        options,
        error,
      });
      throw error;
    }
  }

  async countByDriverStats(
    driverId: string,
    filters: IRideFilters,
  ): Promise<IDriverRideStatsResult> {
    const query: FilterQuery<IRideDocument> = { driverId };

    if (filters.fromDate ?? filters.toDate) {
      query.createdAt = {};
      if (filters.fromDate) query.createdAt.$gte = filters.fromDate;
      if (filters.toDate) query.createdAt.$lte = filters.toDate;
    }

    const [total, completed, cancelled, earningsAgg] = await Promise.all([
      RideModel.countDocuments(query),
      RideModel.countDocuments({ ...query, status: RideStatus.COMPLETED }),
      RideModel.countDocuments({ ...query, status: RideStatus.CANCELLED }),
      RideModel.aggregate<{ totalEarnings: number }>([
        { $match: { ...query, status: RideStatus.COMPLETED } },
        {
          $group: {
            _id: null,
            totalEarnings: { $sum: "$fareBreakdown.totalFare" },
          },
        },
      ]),
    ]);

    return {
      total,
      completed,
      cancelled,
      totalEarnings: earningsAgg[0]?.totalEarnings ?? 0,
    };
  }
}
