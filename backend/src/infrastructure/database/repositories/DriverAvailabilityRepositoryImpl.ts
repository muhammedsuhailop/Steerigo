import { injectable } from "inversify";
import {
  IDriverAvailabilityRepository,
  IDriverAvailabilityFilters,
} from "@application/repositories/IDriverAvailabilityRepository";
import { DriverAvailability } from "@domain/entities/DriverAvailability";
import { AvailabilityStatus } from "@domain/value-objects/AvailabilityStatus";
import {
  DriverAvailabilityModel,
  IDriverAvailabilityModel,
} from "../models/DriverAvailabilityModel";
import { DriverAvailabilityMapper } from "../mappers/DriverAvailabilityMapper";
import { QueryOptions, PaginatedResult } from "@shared/types/Repository";
import { Logger } from "@shared/utils/Logger";
import { SortOrder, Types, FilterQuery, UpdateQuery } from "mongoose";

@injectable()
export class DriverAvailabilityRepositoryImpl
  implements IDriverAvailabilityRepository
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

      const savedDoc = await DriverAvailabilityModel.findByIdAndUpdate(
        availabilityId,
        availabilityData,
        {
          new: true,
          upsert: true,
          runValidators: true,
        }
      );

      if (!savedDoc) {
        throw new Error(
          `Failed to save driver availability: ${availabilityId}`
        );
      }

      Logger.info("Driver availability saved successfully", {
        availabilityId,
        driverId: availability.getDriverId(),
      });

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

  async count(filters?: IDriverAvailabilityFilters): Promise<number> {
    try {
      const mongoFilter = this.buildFilterQuery(filters || {});
      return await DriverAvailabilityModel.countDocuments(mongoFilter);
    } catch (error) {
      Logger.error("Error counting driver availabilities", { error });
      throw error;
    }
  }

  async findPaginated(
    options: QueryOptions<DriverAvailability> & { filters?: IDriverAvailabilityFilters }
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

  // Enhanced location-based queries with Haversine distance calculation
  async findNearLocation(
    latitude: number,
    longitude: number,
    radiusKm: number,
    options?: QueryOptions
  ): Promise<DriverAvailability[]> {
    try {
      const now = new Date();

      // Get all available drivers with their locations
      const query = DriverAvailabilityModel.find({
        status: AvailabilityStatus.AVAILABLE,
        availableFrom: { $lte: now },
        availableTill: { $gte: now },
      });

      const docs = await query.exec();

      // Calculate distances using Haversine formula and filter
      const driversWithDistance = docs
        .map((doc) => {
          const distance = this.calculateHaversineDistance(
            latitude,
            longitude,
            doc.currentLocation.latitude,
            doc.currentLocation.longitude
          );

          return {
            doc,
            distance,
          };
        })
        .filter((item) => item.distance <= radiusKm)
        .sort((a, b) => a.distance - b.distance);

      // Apply pagination if needed
      let filteredDrivers = driversWithDistance;
      if (options?.offset) {
        filteredDrivers = filteredDrivers.slice(options.offset);
      }
      if (options?.limit) {
        filteredDrivers = filteredDrivers.slice(0, options.limit);
      }

      return filteredDrivers.map((item) =>
        DriverAvailabilityMapper.toDomain(item.doc)
      );
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

  async findNearbyAvailableDrivers(
    latitude: number,
    longitude: number,
    searchDate?: Date,
    radiusKm: number = 10,
    timeRequiredMinutes: number = 60,
    limit: number = 20
  ): Promise<
    Array<{
      driver: DriverAvailability;
      distanceKm: number;
      etaMinutes: number;
    }>
  > {
    try {
      const rideStart = searchDate ? new Date(searchDate) : new Date();
      const rideEnd = new Date(
        rideStart.getTime() + timeRequiredMinutes * 60 * 1000
      );

      Logger.debug("findNearbyAvailableDrivers called", {
        latitude,
        longitude,
        radiusKm,
        limit,
        searchDate: rideStart.toISOString(),
        timeRequiredMinutes,
      });

      // Get all available drivers
      const docs = await DriverAvailabilityModel.find({
        status: AvailabilityStatus.AVAILABLE,
        availableFrom: { $lte: rideStart },
        availableTill: { $gte: rideEnd },
      }).exec();

      Logger.info("Found drivers to check proximity", { count: docs.length });

      // Calculate distances and ETAs
      const driversWithDetails = docs
        .map((doc) => {
          const distanceKm = this.calculateHaversineDistance(
            latitude,
            longitude,
            doc.currentLocation.latitude,
            doc.currentLocation.longitude
          );

          // Calculate ETA (assuming average speed of 30 km/h )
          const etaMinutes = Math.ceil((distanceKm / 30) * 60);

          return {
            driver: DriverAvailabilityMapper.toDomain(doc),
            distanceKm: Math.round(distanceKm * 100) / 100, // Round to 2 decimal places
            etaMinutes,
          };
        })
        .filter((item) => item.distanceKm <= radiusKm)
        .sort((a, b) => a.distanceKm - b.distanceKm)
        .slice(0, limit);

      Logger.info("Filtered nearby available drivers", {
        totalFound: docs.length,
        withinRadius: driversWithDetails.length,
        radiusKm,
      });

      return driversWithDetails;
    } catch (error) {
      Logger.error("Error finding nearby available drivers", {
        latitude,
        longitude,
        radiusKm,
        error,
      });
      throw error;
    }
  }

  // Calculate distance between two coordinates using Haversine formula
  // Returns distance in kilometers

  private calculateHaversineDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) *
        Math.cos(this.toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
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
    filters: IDriverAvailabilityFilters,
    updates:
      | Partial<DriverAvailability>
      | Partial<{
          status?: AvailabilityStatus;
          currentLocation?: IDriverAvailabilityModel["currentLocation"];
        }>
  ): Promise<number> {
    try {
      const mongoFilter = this.buildFilterQuery(filters);

      const updateData: UpdateQuery<IDriverAvailabilityModel> = {};

      const maybeStatus = (updates as { status?: AvailabilityStatus }).status;
      if (maybeStatus !== undefined) {
        updateData.status = maybeStatus;
      }

      const maybeCurrentLocation = (
        updates as {
          currentLocation?: IDriverAvailabilityModel["currentLocation"];
        }
      ).currentLocation;
      if (maybeCurrentLocation !== undefined) {
        updateData.currentLocation = maybeCurrentLocation;
      }

      if (hasGetStatus(updates)) {
        updateData.status = updates.getStatus();
      }

      if (hasGetCurrentLocation(updates)) {
        const locObj = updates.getCurrentLocation();
        const coords = (
          locObj as {
            getCoordinates?: () => IDriverAvailabilityModel["currentLocation"];
          }
        ).getCoordinates?.();
        if (coords) updateData.currentLocation = coords;
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

  async deleteMany(filters: IDriverAvailabilityFilters): Promise<number> {
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
    filters: IDriverAvailabilityFilters
  ): FilterQuery<IDriverAvailabilityModel> {
    const query: FilterQuery<IDriverAvailabilityModel> = {};

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.driverId) {
      query.driverId = new Types.ObjectId(filters.driverId);
    }

    if (filters.availableFrom || filters.availableTill) {
      const dateFilter: Partial<{ $gte: Date; $lte: Date }> = {};
      if (filters.availableFrom) {
        dateFilter.$gte = filters.availableFrom;
      }
      if (filters.availableTill) {
        dateFilter.$lte = filters.availableTill;
      }
      query.availableFrom = dateFilter;
    }

    return query;
  }

  // Base repository interface methods
  async existsByFilter(filters: IDriverAvailabilityFilters): Promise<boolean> {
    const mongoFilter = this.buildFilterQuery(filters);
    return (await DriverAvailabilityModel.countDocuments(mongoFilter)) > 0;
  }

  async findByIds(ids: string[]): Promise<DriverAvailability[]> {
    const docs = await DriverAvailabilityModel.find({ _id: { $in: ids } });
    return docs.map(DriverAvailabilityMapper.toDomain);
  }
}

// helper type guards
function hasGetStatus(
  u: unknown
): u is { getStatus: () => AvailabilityStatus } {
  if (typeof u !== "object" || u === null) return false;
  const obj = u as Record<string, unknown>;
  return typeof obj.getStatus === "function";
}

function hasGetCurrentLocation(u: unknown): u is {
  getCurrentLocation: () => {
    getCoordinates: () => IDriverAvailabilityModel["currentLocation"];
  };
} {
  if (typeof u !== "object" || u === null) return false;
  const obj = u as Record<string, unknown>;
  return typeof obj.getCurrentLocation === "function";
}
