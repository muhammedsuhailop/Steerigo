import { injectable } from "inversify";
import {
  IRideRequestRepository,
  IRideRequestFilters,
} from "@application/repositories/IRideRequestRepository";
import { RideRequest } from "@domain/entities/RideRequest";
import { RideRequestStatus } from "@domain/value-objects/RideRequestStatus";
import {
  RideRequestModel,
  IRideRequestDocument,
} from "../models/RideRequestModel";
import { RideRequestMapper } from "../mappers/RideRequestMapper";
import { QueryOptions, PaginatedResult } from "@shared/types/Repository";
import { Logger } from "@shared/utils/Logger";
import { SortOrder, Types, FilterQuery, UpdateQuery } from "mongoose";

@injectable()
export class RideRequestRepositoryImpl implements IRideRequestRepository {
  // Basic Repository Operations
  async findById(id: string): Promise<RideRequest | null> {
    try {
      const doc = await RideRequestModel.findById(id);
      return doc ? RideRequestMapper.toDomain(doc) : null;
    } catch (error) {
      Logger.error("Error finding ride request by id", { id, error });
      throw error;
    }
  }

  async exists(id: string): Promise<boolean> {
    try {
      const count = await RideRequestModel.countDocuments({ _id: id });
      return count > 0;
    } catch (error) {
      Logger.error("Error checking ride request existence", { id, error });
      throw error;
    }
  }

  async save(request: RideRequest): Promise<RideRequest> {
    try {
      const requestId = request.getId();
      const requestData = RideRequestMapper.toPersistence(request);

      const now = new Date();
      const defaultExpiresAt = new Date(Date.now() + 30 * 60 * 1000);

      const savedDoc = await RideRequestModel.findOneAndUpdate(
        { _id: requestId },
        {
          $set: requestData,
          $setOnInsert: { createdAt: now, expiresAt: defaultExpiresAt },
        },
        {
          new: true,
          upsert: true,
          runValidators: true,
        }
      );

      if (!savedDoc)
        throw new Error(`Failed to save ride request: ${requestId}`);
      Logger.info("Ride request saved successfully", {
        requestId: request.getRequestId(),
        driverId: request.getDriverId(),
      });
      return RideRequestMapper.toDomain(savedDoc);
    } catch (error) {
      Logger.error("Error saving ride request", {
        requestId: request.getId(),
        error,
      });
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await RideRequestModel.findByIdAndDelete(id);
      Logger.info("Ride request deleted successfully", { id });
    } catch (error) {
      Logger.error("Error deleting ride request", { id, error });
      throw error;
    }
  }

  // Query Operations
  async findAll(options?: QueryOptions): Promise<RideRequest[]> {
    try {
      const query = RideRequestModel.find();

      if (options?.limit) query.limit(options.limit);
      if (options?.offset) query.skip(options.offset);
      if (options?.sortBy) {
        const sortOrder = options.sortOrder === "desc" ? -1 : 1;
        query.sort({ [options.sortBy]: sortOrder as SortOrder });
      }

      const docs = await query.exec();
      return docs.map(RideRequestMapper.toDomain);
    } catch (error) {
      Logger.error("Error finding all ride requests", { error });
      throw error;
    }
  }

  async count(filters?: IRideRequestFilters): Promise<number> {
    try {
      const mongoFilter = this.buildFilterQuery(
        filters || ({} as IRideRequestFilters)
      );
      return await RideRequestModel.countDocuments(mongoFilter);
    } catch (error) {
      Logger.error("Error counting ride requests", { error });
      throw error;
    }
  }

  async findPaginated(
    options: QueryOptions<RideRequest> & { filters?: IRideRequestFilters }
  ): Promise<PaginatedResult<RideRequest>> {
    const {
      page = 1,
      limit = 10,
      filters = {} as IRideRequestFilters,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = options;

    const mongoFilter = this.buildFilterQuery(filters);
    const sortValue = {
      [sortBy]: sortOrder === "asc" ? 1 : -1,
    } as const;

    const total = await RideRequestModel.countDocuments(mongoFilter);
    const totalPages = Math.ceil(total / limit);
    const skip = (page - 1) * limit;

    const docs = await RideRequestModel.find(mongoFilter)
      .sort(sortValue)
      .skip(skip)
      .limit(limit)
      .exec();

    const data = docs.map(RideRequestMapper.toDomain);

    return { data, total, page, limit, totalPages };
  }

  // Driver-specific queries
  async findByDriverId(
    driverId: string,
    options?: QueryOptions
  ): Promise<RideRequest[]> {
    try {
      const query = RideRequestModel.find({
        driverId: new Types.ObjectId(driverId),
      }).sort({ createdAt: -1 });

      if (options?.limit) query.limit(options.limit);
      if (options?.offset) query.skip(options.offset);

      const docs = await query.exec();
      return docs.map(RideRequestMapper.toDomain);
    } catch (error) {
      Logger.error("Error finding ride requests by driver ID", {
        driverId,
        error,
      });
      throw error;
    }
  }

  async findPendingByDriverId(driverId: string): Promise<RideRequest[]> {
    try {
      const docs = await RideRequestModel.find({
        driverId: new Types.ObjectId(driverId),
        status: RideRequestStatus.PENDING,
      }).sort({ createdAt: -1 });

      return docs.map(RideRequestMapper.toDomain);
    } catch (error) {
      Logger.error("Error finding pending requests by driver ID", {
        driverId,
        error,
      });
      throw error;
    }
  }

  async countPendingByDriverId(driverId: string): Promise<number> {
    try {
      return await RideRequestModel.countDocuments({
        driverId: new Types.ObjectId(driverId),
        status: RideRequestStatus.PENDING,
      });
    } catch (error) {
      Logger.error("Error counting pending requests by driver ID", {
        driverId,
        error,
      });
      throw error;
    }
  }

  // Rider-specific queries
  async findByRiderId(
    riderId: string,
    options?: QueryOptions
  ): Promise<RideRequest[]> {
    try {
      const query = RideRequestModel.find({
        riderId: new Types.ObjectId(riderId),
      }).sort({ createdAt: -1 });

      if (options?.limit) query.limit(options.limit);
      if (options?.offset) query.skip(options.offset);

      const docs = await query.exec();
      return docs.map(RideRequestMapper.toDomain);
    } catch (error) {
      Logger.error("Error finding ride requests by rider ID", {
        riderId,
        error,
      });
      throw error;
    }
  }

  async findPendingByRiderId(riderId: string): Promise<RideRequest[]> {
    try {
      const docs = await RideRequestModel.find({
        riderId: new Types.ObjectId(riderId),
        status: RideRequestStatus.PENDING,
      }).sort({ createdAt: -1 });

      return docs.map(RideRequestMapper.toDomain);
    } catch (error) {
      Logger.error("Error finding pending requests by rider ID", {
        riderId,
        error,
      });
      throw error;
    }
  }

  // Status-based queries
  async findByStatus(
    status: RideRequestStatus,
    options?: QueryOptions
  ): Promise<RideRequest[]> {
    try {
      const query = RideRequestModel.find({ status });

      if (options?.limit) query.limit(options.limit);
      if (options?.offset) query.skip(options.offset);
      if (options?.sortBy) {
        const sortOrder = options.sortOrder === "desc" ? -1 : 1;
        query.sort({ [options.sortBy]: sortOrder as SortOrder });
      }

      const docs = await query.exec();
      return docs.map(RideRequestMapper.toDomain);
    } catch (error) {
      Logger.error("Error finding ride requests by status", { status, error });
      throw error;
    }
  }

  async findExpiredRequests(): Promise<RideRequest[]> {
    try {
      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

      const docs = await RideRequestModel.find({
        status: RideRequestStatus.PENDING,
        createdAt: { $lt: thirtyMinutesAgo },
      });

      return docs.map(RideRequestMapper.toDomain);
    } catch (error) {
      Logger.error("Error finding expired requests", { error });
      throw error;
    }
  }

  // Specialized operations
  async findByRequestId(requestId: string): Promise<RideRequest | null> {
    try {
      const doc = await RideRequestModel.findById(requestId);
      return doc ? RideRequestMapper.toDomain(doc) : null;
    } catch (error) {
      Logger.error("Error finding ride request by requestId", {
        requestId,
        error,
      });
      throw error;
    }
  }

  async expirePendingRequests(olderThanMinutes: number): Promise<number> {
    try {
      const cutoffTime = new Date(Date.now() - olderThanMinutes * 60 * 1000);

      const result = await RideRequestModel.updateMany(
        {
          status: RideRequestStatus.PENDING,
          createdAt: { $lt: cutoffTime },
        },
        {
          $set: {
            status: RideRequestStatus.EXPIRED,
            updatedAt: new Date(),
          },
        }
      );

      Logger.info("Expired pending ride requests", {
        modifiedCount: result.modifiedCount,
      });

      return result.modifiedCount || 0;
    } catch (error) {
      Logger.error("Error expiring pending requests", { error });
      throw error;
    }
  }

  async deleteExpiredRequests(): Promise<number> {
    try {
      const result = await RideRequestModel.deleteMany({
        status: RideRequestStatus.EXPIRED,
      });

      Logger.info("Deleted expired ride requests", {
        deletedCount: result.deletedCount,
      });

      return result.deletedCount || 0;
    } catch (error) {
      Logger.error("Error deleting expired requests", { error });
      throw error;
    }
  }

  // Bulk operations
  async saveMany(requests: RideRequest[]): Promise<RideRequest[]> {
    try {
      const bulkOps = requests.map((request) => {
        const requestData = RideRequestMapper.toPersistence(request);
        return {
          updateOne: {
            filter: { _id: request.getId() },
            update: {
              $set: requestData,
              $setOnInsert: {
                expiresAt: new Date(Date.now() + 30 * 60 * 1000),
              },
            },
            upsert: true,
          },
        };
      });

      await RideRequestModel.bulkWrite(bulkOps);

      Logger.info("Bulk saved ride requests", { count: requests.length });

      // Fetch and return saved documents
      const ids = requests.map((r) => r.getId());
      const docs = await RideRequestModel.find({ _id: { $in: ids } });
      return docs.map(RideRequestMapper.toDomain);
    } catch (error) {
      Logger.error("Error bulk saving ride requests", { error });
      throw error;
    }
  }

  async updateMany(
    filters: IRideRequestFilters,
    updates: Partial<RideRequest>
  ): Promise<number> {
    try {
      const mongoFilter = this.buildFilterQuery(filters);
      const updateData: UpdateQuery<Partial<IRideRequestDocument>> = {};

      const u: unknown = updates;
      if (
        typeof u === "object" &&
        u !== null &&
        typeof (u as { getStatus?: () => RideRequestStatus }).getStatus ===
          "function"
      ) {
        updateData.status = (
          u as { getStatus: () => RideRequestStatus }
        ).getStatus();
      }

      updateData.updatedAt = new Date();

      const result = await RideRequestModel.updateMany(
        mongoFilter as FilterQuery<IRideRequestDocument>,
        {
          $set: updateData,
        }
      );

      Logger.info("Multiple ride requests updated", {
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount,
      });

      return result.modifiedCount || 0;
    } catch (error) {
      Logger.error("Error updating multiple ride requests", { filters, error });
      throw error;
    }
  }

  async deleteMany(filters: IRideRequestFilters): Promise<number> {
    try {
      const mongoFilter = this.buildFilterQuery(filters);
      const result = await RideRequestModel.deleteMany(mongoFilter);

      Logger.info("Multiple ride requests deleted", {
        count: result.deletedCount,
      });

      return result.deletedCount ?? 0;
    } catch (error) {
      Logger.error("Error deleting multiple ride requests", { filters, error });
      throw error;
    }
  }

  // Base repository interface methods
  async existsByFilter(filters: IRideRequestFilters): Promise<boolean> {
    const mongoFilter = this.buildFilterQuery(filters);
    return (await RideRequestModel.countDocuments(mongoFilter)) > 0;
  }

  async findByIds(ids: string[]): Promise<RideRequest[]> {
    const docs = await RideRequestModel.find({ _id: { $in: ids } });
    return docs.map(RideRequestMapper.toDomain);
  }

  // Helper methods
  private buildFilterQuery(
    filters: IRideRequestFilters
  ): FilterQuery<IRideRequestDocument> {
    const query: FilterQuery<IRideRequestDocument> = {};

    if (filters.status) {
      query.status = filters.status as IRideRequestDocument["status"];
    }

    if (filters.driverId) {
      query.driverId = new Types.ObjectId(
        filters.driverId
      ) as unknown as IRideRequestDocument["driverId"];
    }

    if (filters.riderId) {
      query.riderId = new Types.ObjectId(
        filters.riderId
      ) as unknown as IRideRequestDocument["riderId"];
    }

    if (filters.pickupTimeFrom || filters.pickupTimeTo) {
      const timeFilter: { $gte?: Date; $lte?: Date } = {};
      if (filters.pickupTimeFrom) {
        timeFilter.$gte = filters.pickupTimeFrom;
      }
      if (filters.pickupTimeTo) {
        timeFilter.$lte = filters.pickupTimeTo;
      }
      query.pickupTime = timeFilter;
    }

    if (filters.createdAfter || filters.createdBefore) {
      const createdFilter: { $gte?: Date; $lte?: Date } = {};
      if (filters.createdAfter) {
        createdFilter.$gte = filters.createdAfter;
      }
      if (filters.createdBefore) {
        createdFilter.$lte = filters.createdBefore;
      }
      query.createdAt = createdFilter;
    }

    return query;
  }
}
