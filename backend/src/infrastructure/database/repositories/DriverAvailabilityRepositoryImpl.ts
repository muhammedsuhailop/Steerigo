import { injectable, inject } from "inversify";
import {
  DriverAvailabilityRepository,
  DriverAvailabilityFilters,
} from "@application/repositories/DriverAvailabilityRepository";
import { DriverAvailability } from "@domain/entities/DriverAvailability";
import { AvailabilityStatus } from "@domain/value-objects/AvailabilityStatus";
import {
  DriverAvailabilityModel,
  IDriverAvailabilityModel,
} from "../models/DriverAvailabilityModel";
import { DriverAvailabilityMapper } from "../mappers/DriverAvailabilityMapper";
import { QueryOptions, PaginatedResult } from "@shared/types/Repository";
import { Logger } from "@shared/utils/Logger";
import { SortOrder, Types } from "mongoose";

@injectable()
export class DriverAvailabilityRepositoryImpl
  implements DriverAvailabilityRepository
{
  // Basic Repository Operations
  async findById(id: string): Promise<DriverAvailability | null> {
    try {
      const doc = await DriverAvailabilityModel.findById(id);
      return doc ? DriverAvailabilityMapper.toDomain(doc) : null;
    } catch (error) {
      Logger.error("Error finding driver availability by id", { id, error });
      throw error;
    }
  }

  async exists(id: string): Promise<boolean> {
    try {
      const count = await DriverAvailabilityModel.countDocuments({ _id: id });
      return count > 0;
    } catch (error) {
      Logger.error("Error checking driver availability existence", {
        id,
        error,
      });
      throw error;
    }
  }

  async save(availability: DriverAvailability): Promise<DriverAvailability> {
    try {
      const availabilityData =
        DriverAvailabilityMapper.toPersistence(availability);
      const availabilityId = availability.getId();

      const existingDoc =
        await DriverAvailabilityModel.findById(availabilityId);
      let savedDoc: IDriverAvailabilityModel;

      if (existingDoc) {
        savedDoc = (await DriverAvailabilityModel.findByIdAndUpdate(
          availabilityId,
          availabilityData,
          { new: true }
        )) as IDriverAvailabilityModel;
      } else {
        savedDoc = (await DriverAvailabilityModel.create({
          _id: availabilityId,
          ...availabilityData,
        })) as IDriverAvailabilityModel;
      }

      return DriverAvailabilityMapper.toDomain(savedDoc);
    } catch (error) {
      Logger.error("Error saving driver availability", {
        availabilityId: availability.getId(),
        error,
      });
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await DriverAvailabilityModel.findByIdAndDelete(id);
      Logger.info("Driver availability deleted successfully", { id });
    } catch (error) {
      Logger.error("Error deleting driver availability", { id, error });
      throw error;
    }
  }

  // Query Operations
  async findAll(options?: QueryOptions): Promise<DriverAvailability[]> {
    try {
      const query = DriverAvailabilityModel.find();

      if (options?.limit) query.limit(options.limit);
      if (options?.offset) query.skip(options.offset);
      if (options?.sortBy) {
        const sortOrder = options.sortOrder === "desc" ? -1 : 1;
        query.sort({ [options.sortBy]: sortOrder as SortOrder });
      }

      const docs = await query.exec();
      return docs.map(DriverAvailabilityMapper.toDomain);
    } catch (error) {
      Logger.error("Error finding all driver availabilities", { error });
      throw error;
    }
  }

  async count(filters?: DriverAvailabilityFilters): Promise<number> {
    try {
      const mongoFilter = this.buildFilterQuery(filters || {});
      return await DriverAvailabilityModel.countDocuments(mongoFilter);
    } catch (error) {
      Logger.error("Error counting driver availabilities", { error });
      throw error;
    }
  }

  async findPaginated(
    options: QueryOptions & { filters?: DriverAvailabilityFilters }
  ): Promise<PaginatedResult<DriverAvailability>> {
    const {
      page = 1,
      limit = 10,
      filters = {},
      sortBy = "createdAt",
      sortOrder = "desc",
    } = options;

    const mongoFilter = this.buildFilterQuery(filters);
    const sortValue = {
      [sortBy]: sortOrder === "asc" ? 1 : -1,
    } as const;

    const total = await DriverAvailabilityModel.countDocuments(mongoFilter);
    const totalPages = Math.ceil(total / limit);
    const skip = (page - 1) * limit;

    const docs = await DriverAvailabilityModel.find(mongoFilter)
      .sort(sortValue)
      .skip(skip)
      .limit(limit)
      .exec();

    const data = docs.map(DriverAvailabilityMapper.toDomain);
    return { data, total, page, limit, totalPages };
  }

  // Driver-specific queries
  async findByDriverId(driverId: string): Promise<DriverAvailability | null> {
    try {
      const doc = await DriverAvailabilityModel.findOne({
        driverId: new Types.ObjectId(driverId),
      }).sort({ createdAt: -1 });

      return doc ? DriverAvailabilityMapper.toDomain(doc) : null;
    } catch (error) {
      Logger.error("Error finding availability by driver ID", {
        driverId,
        error,
      });
      throw error;
    }
  }

  async findActiveByDriverId(
    driverId: string
  ): Promise<DriverAvailability | null> {
    try {
      const now = new Date();
      const doc = await DriverAvailabilityModel.findOne({
        driverId: new Types.ObjectId(driverId),
        availableTill: { $gte: now },
      });

      return doc ? DriverAvailabilityMapper.toDomain(doc) : null;
    } catch (error) {
      Logger.error("Error finding active availability by driver ID", {
        driverId,
        error,
      });
      throw error;
    }
  }

  async existsActiveForDriver(driverId: string): Promise<boolean> {
    try {
      const now = new Date();
      const count = await DriverAvailabilityModel.countDocuments({
        driverId: new Types.ObjectId(driverId),
        availableTill: { $gte: now },
      });
      return count > 0;
    } catch (error) {
      Logger.error("Error checking active availability for driver", {
        driverId,
        error,
      });
      throw error;
    }
  }

  // Status-based queries
  async findByStatus(
    status: AvailabilityStatus,
    options?: QueryOptions
  ): Promise<DriverAvailability[]> {
    try {
      const query = DriverAvailabilityModel.find({ status });

      if (options?.limit) query.limit(options.limit);
      if (options?.offset) query.skip(options.offset);
      if (options?.sortBy) {
        const sortOrder = options.sortOrder === "desc" ? -1 : 1;
        query.sort({ [options.sortBy]: sortOrder as SortOrder });
      }

      const docs = await query.exec();
      return docs.map(DriverAvailabilityMapper.toDomain);
    } catch (error) {
      Logger.error("Error finding availabilities by status", { status, error });
      throw error;
    }
  }

  async findAvailableDrivers(
    options?: QueryOptions
  ): Promise<DriverAvailability[]> {
    const now = new Date();

    try {
      const query = DriverAvailabilityModel.find({
        status: AvailabilityStatus.AVAILABLE,
        availableFrom: { $lte: now },
        availableTill: { $gte: now },
      });

      if (options?.limit) query.limit(options.limit);
      if (options?.offset) query.skip(options.offset);
      if (options?.sortBy) {
        const sortOrder = options.sortOrder === "desc" ? -1 : 1;
        query.sort({ [options.sortBy]: sortOrder as SortOrder });
      }

      const docs = await query.exec();
      return docs.map(DriverAvailabilityMapper.toDomain);
    } catch (error) {
      Logger.error("Error finding available drivers", { error });
      throw error;
    }
  }

  // Location-based queries
  async findNearLocation(
    latitude: number,
    longitude: number,
    radiusKm: number,
    options?: QueryOptions
  ): Promise<DriverAvailability[]> {
    try {
      const radiusInRadians = radiusKm / 6371; // Earth's radius in km

      const query = DriverAvailabilityModel.find({
        "currentLocation.latitude": {
          $gte: latitude - (radiusInRadians * 180) / Math.PI,
          $lte: latitude + (radiusInRadians * 180) / Math.PI,
        },
        "currentLocation.longitude": {
          $gte: longitude - (radiusInRadians * 180) / Math.PI,
          $lte: longitude + (radiusInRadians * 180) / Math.PI,
        },
        status: AvailabilityStatus.AVAILABLE,
      });

      if (options?.limit) query.limit(options.limit);
      if (options?.offset) query.skip(options.offset);

      const docs = await query.exec();
      return docs.map(DriverAvailabilityMapper.toDomain);
    } catch (error) {
      Logger.error("Error finding drivers near location", {
        latitude,
        longitude,
        radiusKm,
        error,
      });
      throw error;
    }
  }

  // Time-based queries
  async findExpiredAvailabilities(): Promise<DriverAvailability[]> {
    try {
      const now = new Date();
      const docs = await DriverAvailabilityModel.find({
        availableTill: { $lt: now },
      });

      return docs.map(DriverAvailabilityMapper.toDomain);
    } catch (error) {
      Logger.error("Error finding expired availabilities", { error });
      throw error;
    }
  }

  async cleanupExpiredRecords(): Promise<number> {
    try {
      const now = new Date();
      const result = await DriverAvailabilityModel.deleteMany({
        availableTill: { $lt: now },
        status: { $ne: AvailabilityStatus.BUSY },
      });

      Logger.info("Cleaned up expired availability records", {
        deletedCount: result.deletedCount,
      });
      return result.deletedCount || 0;
    } catch (error) {
      Logger.error("Error cleaning up expired records", { error });
      throw error;
    }
  }

  // Specialized operations
  async deactivateExpiredAvailabilities(): Promise<number> {
    try {
      const now = new Date();
      const result = await DriverAvailabilityModel.updateMany(
        {
          availableTill: { $lt: now },
          status: { $ne: AvailabilityStatus.OFFLINE },
        },
        {
          $set: {
            status: AvailabilityStatus.OFFLINE,
            updatedAt: now,
          },
        }
      );

      Logger.info("Deactivated expired availabilities", {
        modifiedCount: result.modifiedCount,
      });
      return result.modifiedCount || 0;
    } catch (error) {
      Logger.error("Error deactivating expired availabilities", { error });
      throw error;
    }
  }

  async findConflictingSchedule(
    driverId: string,
    availableFrom: Date,
    availableTill: Date
  ): Promise<DriverAvailability | null> {
    try {
      const doc = await DriverAvailabilityModel.findOne({
        driverId: new Types.ObjectId(driverId),
        $or: [
          {
            availableFrom: { $lt: availableTill },
            availableTill: { $gt: availableFrom },
          },
        ],
        availableTill: { $gte: new Date() },
      });

      return doc ? DriverAvailabilityMapper.toDomain(doc) : null;
    } catch (error) {
      Logger.error("Error finding conflicting schedule", {
        driverId,
        availableFrom,
        availableTill,
        error,
      });
      throw error;
    }
  }

  // Batch Operations
  async updateMany(
    filters: DriverAvailabilityFilters,
    updates: Partial<DriverAvailability>
  ): Promise<number> {
    try {
      const mongoFilter = this.buildFilterQuery(filters);
      const updateData: any = {};

      // Map domain updates to database fields
      if (updates.getStatus) updateData.status = updates.getStatus();
      if (updates.getCurrentLocation) {
        const location = updates.getCurrentLocation();
        updateData.currentLocation = location.getCoordinates();
      }
      updateData.updatedAt = new Date();

      const result = await DriverAvailabilityModel.updateMany(mongoFilter, {
        $set: updateData,
      });

      Logger.info("Multiple driver availabilities updated", {
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount,
      });
      return result.modifiedCount || 0;
    } catch (error) {
      Logger.error("Error updating multiple driver availabilities", {
        filters,
        error,
      });
      throw error;
    }
  }

  async deleteMany(filters: DriverAvailabilityFilters): Promise<number> {
    try {
      const mongoFilter = this.buildFilterQuery(filters);
      const result = await DriverAvailabilityModel.deleteMany(mongoFilter);

      Logger.info("Multiple driver availabilities deleted", {
        count: result.deletedCount,
      });
      return result.deletedCount ?? 0;
    } catch (error) {
      Logger.error("Error deleting multiple driver availabilities", {
        filters,
        error,
      });
      throw error;
    }
  }

  // Helper methods
  private buildFilterQuery(
    filters: DriverAvailabilityFilters
  ): Record<string, any> {
    const query: Record<string, any> = {};

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.driverId) {
      query.driverId = new Types.ObjectId(filters.driverId);
    }

    if (filters.availableFrom || filters.availableTill) {
      const dateFilter: Record<string, any> = {};
      if (filters.availableFrom) {
        dateFilter.$gte = filters.availableFrom;
      }
      if (filters.availableTill) {
        dateFilter.$lte = filters.availableTill;
      }
      query.availableFrom = dateFilter;
    }

    if (filters.nearLocation) {
      const { latitude, longitude, radiusKm = 10 } = filters.nearLocation;
      const radiusInRadians = radiusKm / 6371;

      query["currentLocation.latitude"] = {
        $gte: latitude - (radiusInRadians * 180) / Math.PI,
        $lte: latitude + (radiusInRadians * 180) / Math.PI,
      };
      query["currentLocation.longitude"] = {
        $gte: longitude - (radiusInRadians * 180) / Math.PI,
        $lte: longitude + (radiusInRadians * 180) / Math.PI,
      };
    }

    return query;
  }

  // Base repository interface methods
  async existsByFilter(filters: DriverAvailabilityFilters): Promise<boolean> {
    const mongoFilter = this.buildFilterQuery(filters);
    return (await DriverAvailabilityModel.countDocuments(mongoFilter)) > 0;
  }

  async findByIds(ids: string[]): Promise<DriverAvailability[]> {
    const docs = await DriverAvailabilityModel.find({ _id: { $in: ids } });
    return docs.map(DriverAvailabilityMapper.toDomain);
  }
}
