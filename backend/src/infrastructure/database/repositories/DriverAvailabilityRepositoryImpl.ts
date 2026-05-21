import { injectable } from "inversify";
import {
  IDriverAvailabilityRepository,
  IDriverAvailabilityFilters,
} from "@domain/repositories/IDriverAvailabilityRepository";
import { DriverAvailability } from "@domain/entities/DriverAvailability";
import { AvailabilityStatus } from "@domain/value-objects/AvailabilityStatus";
import {
  DriverAvailabilityModel,
  IDriverAvailabilityModel,
} from "../models/DriverAvailabilityModel";
import { DriverAvailabilityMapper } from "../mappers/DriverAvailabilityMapper";
import { QueryOptions, PaginatedResult } from "@shared/types/Repository";
import { Logger } from "@shared/utils/Logger";
import {
  SortOrder,
  Types,
  FilterQuery,
  PipelineStage,
  HydratedDocument,
} from "mongoose";
import { AvailabilityException } from "@domain/entities/AvailabilityException";
import { DriverStatus } from "@domain/value-objects/DriverStatus";
import { KYCStatus } from "@domain/value-objects/KYCStatus";
import { RideRequestGroupModel } from "../models/RideRequestGroupModel";
import { RideRequestGroupStatus } from "@domain/value-objects/RideRequestGroupStatus";

type DriverLookupDocument = {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  eligibleGearTypes: string[];
  eligibleBodyTypes: string[];
  licenseNumber: string;
  licenceCategory: string;
  licenseIssueDate: Date;
  licenseExpiryDate: Date;
  kycStatus: string;
  status: string;
  averageRating: number;
  numberOfRatings: number;
  createdAt: Date;
  updatedAt: Date;
};

type NearbyAvailableDriverAggregationResult = {
  _id: Types.ObjectId;
  driverId: Types.ObjectId;
  status: string;
  currentLocation: {
    latitude: number;
    longitude: number;
    address?: string;
    updatedAt?: Date;
  };
  locationPoint: {
    type: "Point";
    coordinates: [number, number];
  };
  recurringSchedule?: IDriverAvailabilityModel["recurringSchedule"];
  exceptions?: IDriverAvailabilityModel["exceptions"];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  distanceMeters: number;
  averageRating: number;
  driverDoc: DriverLookupDocument;
};

type BaseLocationAggregationResult = {
  _id: Types.ObjectId;
  driverId: Types.ObjectId;
  status: string;
  currentLocation: {
    latitude: number;
    longitude: number;
    address?: string;
    updatedAt?: Date;
  };
  baseLocationPoint: {
    type: "Point";
    coordinates: [number, number];
  };
  locationPoint: {
    type: "Point";
    coordinates: [number, number];
  };
  recurringSchedule?: IDriverAvailabilityModel["recurringSchedule"];
  exceptions?: IDriverAvailabilityModel["exceptions"];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  distanceMeters: number;
  driverDoc: DriverLookupDocument;
};

@injectable()
export class DriverAvailabilityRepositoryImpl implements IDriverAvailabilityRepository {
  private readonly HAVERSINE_RADIUS_KM = 6371;
  private readonly AVERAGE_SPEED_KM_PER_HOUR = 30;

  // Basic Repository Operations

  async findById(id: string): Promise<DriverAvailability | null> {
    try {
      const doc = await DriverAvailabilityModel.findById(id).exec();
      return doc ? DriverAvailabilityMapper.toDomain(doc) : null;
    } catch (error) {
      Logger.error("Error finding driver availability by id", { id, error });
      throw error;
    }
  }

  async exists(id: string): Promise<boolean> {
    try {
      const count = await DriverAvailabilityModel.countDocuments({
        _id: id,
      }).exec();
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
        },
      ).exec();

      if (!savedDoc) {
        throw new Error(
          `Failed to save driver availability: ${availabilityId}`,
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
      await DriverAvailabilityModel.findByIdAndDelete(id).exec();
      Logger.info("Driver availability deleted successfully", { id });
    } catch (error) {
      Logger.error("Error deleting driver availability", { id, error });
      throw error;
    }
  }

  async existsByFilter(filters: IDriverAvailabilityFilters): Promise<boolean> {
    try {
      const mongoFilter = this.buildFilterQuery(filters);
      const count =
        await DriverAvailabilityModel.countDocuments(mongoFilter).exec();
      return count > 0;
    } catch (error) {
      Logger.error("Error checking existence by filter", {
        filters,
        error,
      });
      throw error;
    }
  }

  async findByIds(ids: string[]): Promise<DriverAvailability[]> {
    try {
      const objectIds = ids.map((id) => new Types.ObjectId(id));

      const docs = await DriverAvailabilityModel.find({
        _id: { $in: objectIds },
      }).exec();

      return docs.map((doc) => DriverAvailabilityMapper.toDomain(doc));
    } catch (error) {
      Logger.error("Error finding driver availabilities by IDs", {
        ids,
        error,
      });
      throw error;
    }
  }

  // Query Operations

  async findAll(options?: QueryOptions): Promise<DriverAvailability[]> {
    try {
      let query = DriverAvailabilityModel.find();

      if (options?.limit) query = query.limit(options.limit);
      if (options?.offset) query = query.skip(options.offset);

      if (options?.sortBy) {
        const sortOrder = options.sortOrder === "desc" ? -1 : 1;
        query = query.sort({
          [options.sortBy]: sortOrder as SortOrder,
        });
      }

      const docs = await query.exec();
      return docs.map((doc) => DriverAvailabilityMapper.toDomain(doc));
    } catch (error) {
      Logger.error("Error finding all driver availabilities", { error });
      throw error;
    }
  }

  async count(filters?: IDriverAvailabilityFilters): Promise<number> {
    try {
      const mongoFilter = this.buildFilterQuery(filters || {});
      return await DriverAvailabilityModel.countDocuments(mongoFilter).exec();
    } catch (error) {
      Logger.error("Error counting driver availabilities", { error });
      throw error;
    }
  }

  async findPaginated(
    options: QueryOptions<DriverAvailability> & {
      filters?: IDriverAvailabilityFilters;
    },
  ): Promise<PaginatedResult<DriverAvailability>> {
    const {
      page = 1,
      limit = 10,
      filters = {},
      sortBy = "createdAt",
      sortOrder = "desc",
    } = options;

    try {
      const mongoFilter = this.buildFilterQuery(filters);

      const sortValue = {
        [sortBy]: sortOrder === "asc" ? 1 : -1,
      } as const;

      const total =
        await DriverAvailabilityModel.countDocuments(mongoFilter).exec();
      const totalPages = Math.ceil(total / limit);
      const skip = (page - 1) * limit;

      const docs = await DriverAvailabilityModel.find(mongoFilter)
        .sort(sortValue)
        .skip(skip)
        .limit(limit)
        .exec();

      const data = docs.map((doc) => DriverAvailabilityMapper.toDomain(doc));

      return { data, total, page, limit, totalPages };
    } catch (error) {
      Logger.error("Error finding paginated driver availabilities", {
        page,
        limit,
        error,
      });
      throw error;
    }
  }

  // Driver-Specific Queries

  async findByDriverId(driverId: string): Promise<DriverAvailability | null> {
    try {
      const driverIdObjectId = new Types.ObjectId(driverId);
      const doc = await DriverAvailabilityModel.findOne({
        driverId: driverIdObjectId,
      })
        .sort({ createdAt: -1 })
        .exec();

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
    driverId: string,
  ): Promise<DriverAvailability | null> {
    try {
      const driverIdObjectId = new Types.ObjectId(driverId);
      const doc = await DriverAvailabilityModel.findOne({
        driverId: driverIdObjectId,
        isActive: true,
      }).exec();

      if (!doc) return null;

      return DriverAvailabilityMapper.toDomain(doc as IDriverAvailabilityModel);
    } catch (error) {
      Logger.error("Error finding active driver availability", {
        driverId,
        error,
      });
      throw error;
    }
  }

  async existsActiveForDriver(driverId: string): Promise<boolean> {
    try {
      const driverIdObjectId = new Types.ObjectId(driverId);
      const count = await DriverAvailabilityModel.countDocuments({
        driverId: driverIdObjectId,
        isActive: true,
      }).exec();

      return count > 0;
    } catch (error) {
      Logger.error("Error checking active availability for driver", {
        driverId,
        error,
      });
      throw error;
    }
  }

  // Exception Management
  async addException(
    driverId: string,
    exception: AvailabilityException,
  ): Promise<DriverAvailability | null> {
    try {
      const driverIdObjectId = new Types.ObjectId(driverId);
      const updatedDoc = await DriverAvailabilityModel.findOneAndUpdate(
        { driverId: driverIdObjectId, isActive: true },
        { $push: { exceptions: exception } },
        { new: true },
      ).exec();

      if (!updatedDoc) {
        Logger.warn("No active availability found to add exception", {
          driverId,
        });
        return null;
      }

      Logger.info("Exception added to driver availability", {
        driverId,
      });

      return DriverAvailabilityMapper.toDomain(updatedDoc);
    } catch (error) {
      Logger.error("Error adding exception to driver availability", {
        driverId,
        error,
      });
      throw error;
    }
  }

  async removeException(
    driverId: string,
    exceptionId: string,
  ): Promise<DriverAvailability | null> {
    try {
      const driverIdObjectId = new Types.ObjectId(driverId);
      const updatedDoc = await DriverAvailabilityModel.findOneAndUpdate(
        { driverId: driverIdObjectId },
        { $pull: { exceptions: { _id: exceptionId } } },
        { new: true },
      ).exec();

      if (!updatedDoc) {
        Logger.warn("No availability found to remove exception", { driverId });
        return null;
      }

      Logger.info("Exception removed from driver availability", {
        driverId,
        exceptionId,
      });

      return DriverAvailabilityMapper.toDomain(updatedDoc);
    } catch (error) {
      Logger.error("Error removing exception from driver availability", {
        driverId,
        exceptionId,
        error,
      });
      throw error;
    }
  }

  async getExceptions(driverId: string): Promise<AvailabilityException[]> {
    const driverIdObjectId = new Types.ObjectId(driverId);

    const doc = await DriverAvailabilityModel.findOne({
      driverId: driverIdObjectId,
    })
      .select("exceptions")
      .lean()
      .exec();

    if (!doc || !doc.exceptions) {
      return [];
    }

    return doc.exceptions.map((exception) =>
      DriverAvailabilityMapper.mapRawExceptionToDomain(exception),
    );
  }

  // Status-Based Queries

  async findByStatus(
    status: AvailabilityStatus,
    options?: QueryOptions,
  ): Promise<DriverAvailability[]> {
    try {
      let query = DriverAvailabilityModel.find({ status });

      if (options?.limit) query = query.limit(options.limit);
      if (options?.offset) query = query.skip(options.offset);

      if (options?.sortBy) {
        const sortOrder = options.sortOrder === "desc" ? -1 : 1;
        query = query.sort({
          [options.sortBy]: sortOrder as SortOrder,
        });
      }

      const docs = await query.exec();
      return docs.map((doc) => DriverAvailabilityMapper.toDomain(doc));
    } catch (error) {
      Logger.error("Error finding availabilities by status", {
        status,
        error,
      });
      throw error;
    }
  }

  async findAvailableDrivers(
    options?: QueryOptions,
  ): Promise<DriverAvailability[]> {
    try {
      let query = DriverAvailabilityModel.find({
        status: AvailabilityStatus.AVAILABLE,
        isActive: true,
      });

      if (options?.limit) query = query.limit(options.limit);
      if (options?.offset) query = query.skip(options.offset);

      if (options?.sortBy) {
        const sortOrder = options.sortOrder === "desc" ? -1 : 1;
        query = query.sort({
          [options.sortBy]: sortOrder as SortOrder,
        });
      }

      const docs = await query.exec();
      return docs.map((doc) => DriverAvailabilityMapper.toDomain(doc));
    } catch (error) {
      Logger.error("Error finding available drivers", { error });
      throw error;
    }
  }

  // Location-Based Queries

  async findNearLocation(
    latitude: number,
    longitude: number,
    radiusKm: number,
    options?: QueryOptions,
  ): Promise<DriverAvailability[]> {
    try {
      const docs = await DriverAvailabilityModel.find({
        isActive: true,
      }).exec();

      // Calculate distances and filter by radius
      const driversWithDistance = docs
        .map((doc) => {
          const distance = this.calculateHaversineDistance(
            latitude,
            longitude,
            doc.currentLocation.latitude,
            doc.currentLocation.longitude,
          );

          return { doc, distance };
        })
        .filter((item) => item.distance <= radiusKm)
        .sort((a, b) => a.distance - b.distance);

      // Apply pagination
      let filteredDrivers = driversWithDistance;

      if (options?.offset) {
        filteredDrivers = filteredDrivers.slice(options.offset);
      }

      if (options?.limit) {
        filteredDrivers = filteredDrivers.slice(0, options.limit);
      }

      return filteredDrivers.map((item) =>
        DriverAvailabilityMapper.toDomain(item.doc),
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
    searchDate: Date,
    radiusKm: number = 10,
    timeRequiredMinutes: number = 60,
    limit: number = 20,
  ): Promise<
    Array<{
      driver: DriverAvailability;
      distanceKm: number;
      etaMinutes: number;
    }>
  > {
    try {
      const rideStart = new Date(searchDate);
      const rideEnd = new Date(
        rideStart.getTime() + timeRequiredMinutes * 60 * 1000,
      );

      Logger.debug("findNearbyAvailableDrivers called", {
        latitude,
        longitude,
        radiusKm,
        limit,
        searchDate: rideStart.toISOString(),
        timeRequiredMinutes,
      });

      const onTheClockDriverIds = await this.getDriversHandlingRideRequests();

      if (onTheClockDriverIds.length > 0) {
        Logger.debug("Excluding on-the-clock drivers", {
          count: onTheClockDriverIds.length,
          ids: onTheClockDriverIds,
        });
      }

      const pipeline: PipelineStage[] = [
        {
          $geoNear: {
            near: {
              type: "Point",
              coordinates: [longitude, latitude],
            },
            distanceField: "distanceMeters",
            maxDistance: radiusKm * 1000,
            spherical: true,
            key: "locationPoint",
            query: {
              isActive: true,
              status: {
                $in: [
                  AvailabilityStatus.AVAILABLE,
                  AvailabilityStatus.SCHEDULED,
                ],
              },
              ...(onTheClockDriverIds.length > 0
                ? {
                    driverId: {
                      $nin: onTheClockDriverIds,
                    },
                  }
                : {}),
            },
          },
        },
        {
          $lookup: {
            from: "drivers",
            localField: "driverId",
            foreignField: "_id",
            as: "driverDoc",
          },
        },
        {
          $unwind: "$driverDoc",
        },
        {
          $match: {
            "driverDoc.status": DriverStatus.ACTIVE,
            "driverDoc.kycStatus": KYCStatus.APPROVED,
          },
        },
        {
          $addFields: {
            averageRating: {
              $ifNull: ["$driverDoc.averageRating", 0],
            },
          },
        },
        {
          $sort: {
            distanceMeters: 1,
            averageRating: -1,
          },
        },
        {
          $limit: limit,
        },
      ];

      const aggregatedDocs =
        await DriverAvailabilityModel.aggregate<NearbyAvailableDriverAggregationResult>(
          pipeline,
        ).exec();

      Logger.debug("Database aggregation results", {
        count: aggregatedDocs.length,
        drivers: aggregatedDocs.map((d) => ({
          id: d.driverId,
          distance: d.distanceMeters,
          status: d.status,
        })),
      });

      const rankedDrivers = aggregatedDocs
        .map((doc) => {
          const domainDriver = DriverAvailabilityMapper.toDomain(
            this.toDriverAvailabilityDocument(doc),
          );

          const distanceKm = this.roundToTwoDecimals(doc.distanceMeters / 1000);
          const etaMinutes = this.calculateEtaMinutes(distanceKm);

          return {
            driver: domainDriver,
            distanceKm,
            etaMinutes,
          };
        })
        .filter((item) => {
          const isAvailable = this.isAvailableForRequestedDuration(
            item.driver,
            rideStart,
            rideEnd,
          );

          if (!isAvailable) {
            Logger.info("Driver filtered out by availability logic", {
              driverId: item.driver.getDriverId(),
              requestedStart: rideStart.toISOString(),
              requestedEnd: rideEnd.toISOString(),
              driverStatus: item.driver.getStatus(),
            });
          }

          return isAvailable;
        });

      Logger.info("Filtered nearby available drivers", {
        totalFromDb: aggregatedDocs.length,
        finalNearbyCount: rankedDrivers.length,
        excludedOnTheClockCount: onTheClockDriverIds.length,
        filteredOutBySchedule: aggregatedDocs.length - rankedDrivers.length,
      });

      return rankedDrivers;
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

  // Time-Based Queries

  async findExpiredAvailabilities(): Promise<DriverAvailability[]> {
    try {
      const now = new Date();
      const docs = await DriverAvailabilityModel.find({
        "recurringSchedule.validity.endDate": { $lt: now },
        isActive: true,
      }).exec();

      Logger.info("Found expired availabilities", { count: docs.length });

      return docs.map((doc) => DriverAvailabilityMapper.toDomain(doc));
    } catch (error) {
      Logger.error("Error finding expired availabilities", { error });
      throw error;
    }
  }

  async deactivateExpiredAvailabilities(): Promise<number> {
    try {
      const now = new Date();

      const result = await DriverAvailabilityModel.updateMany(
        {
          "recurringSchedule.validity.endDate": { $lt: now },
          isActive: true,
        },
        {
          $set: {
            isActive: false,
            status: AvailabilityStatus.OFFLINE,
            updatedAt: now,
          },
        },
      ).exec();

      Logger.info("Deactivated expired availabilities", {
        modifiedCount: result.modifiedCount,
      });

      return result.modifiedCount ?? 0;
    } catch (error) {
      Logger.error("Error deactivating expired availabilities", { error });
      throw error;
    }
  }

  async cleanupExpiredRecords(): Promise<number> {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const result = await DriverAvailabilityModel.deleteMany({
        isActive: false,
        "recurringSchedule.validity.endDate": { $lt: thirtyDaysAgo },
      }).exec();

      Logger.info("Cleaned up expired records", {
        deletedCount: result.deletedCount,
      });

      return result.deletedCount ?? 0;
    } catch (error) {
      Logger.error("Error cleaning up expired records", { error });
      throw error;
    }
  }

  // Schedule Management

  async findConflictingSchedule(
    driverId: string,
    availableFrom: Date,
    availableTill: Date,
  ): Promise<DriverAvailability | null> {
    try {
      const driverIdObjectId = new Types.ObjectId(driverId);

      const doc = await DriverAvailabilityModel.findOne({
        driverId: driverIdObjectId,
        isActive: true,

        status: { $ne: AvailabilityStatus.OFFLINE },

        "recurringSchedule.validity.startDate": { $lt: availableTill },
        "recurringSchedule.validity.endDate": { $gt: availableFrom },
      }).exec();

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

  async findNearbyAvailableDriversByBaseLocation(
    latitude: number,
    longitude: number,
    availableFrom: Date,
    radiusKm: number,
    limit: number,
  ): Promise<
    Array<{
      driver: DriverAvailability;
      driverUserId: string;
      distanceKm: number;
    }>
  > {
    try {
      Logger.debug("findNearbyAvailableDriversByBaseLocation called", {
        latitude,
        longitude,
        radiusKm,
        limit,
        availableFrom: availableFrom.toISOString(),
      });

      const pipeline: PipelineStage[] = [
        {
          $geoNear: {
            near: {
              type: "Point",
              coordinates: [longitude, latitude],
            },
            distanceField: "distanceMeters",
            maxDistance: radiusKm * 1000,
            spherical: true,
            key: "baseLocationPoint",
            query: {
              isActive: true,
              status: {
                $ne: AvailabilityStatus.OFFLINE,
              },
            },
          },
        },
        {
          $match: {
            "recurringSchedule.validity.startDate": { $lte: availableFrom },
            "recurringSchedule.validity.endDate": { $gte: availableFrom },
          },
        },
        {
          $lookup: {
            from: "drivers",
            localField: "driverId",
            foreignField: "_id",
            as: "driverDoc",
          },
        },
        {
          $unwind: "$driverDoc",
        },
        {
          $match: {
            "driverDoc.status": DriverStatus.ACTIVE,
            "driverDoc.kycStatus": KYCStatus.APPROVED,
          },
        },
        {
          $sort: {
            distanceMeters: 1,
          },
        },
        {
          $limit: limit,
        },
      ];

      const aggregatedDocs =
        await DriverAvailabilityModel.aggregate<BaseLocationAggregationResult>(
          pipeline,
        ).exec();

      Logger.debug("findNearbyAvailableDriversByBaseLocation results", {
        count: aggregatedDocs.length,
        drivers: aggregatedDocs.map((d) => ({
          id: d.driverId,
          distanceMeters: d.distanceMeters,
          status: d.status,
        })),
      });

      return aggregatedDocs.map((doc) => {
        const domainDriver = DriverAvailabilityMapper.toDomain(
          this.toDriverAvailabilityDocument(doc),
        );

        const distanceKm = this.roundToTwoDecimals(doc.distanceMeters / 1000);

        return {
          driver: domainDriver,
          driverUserId: doc.driverDoc.userId.toString(),
          distanceKm,
        };
      });
    } catch (error) {
      Logger.error("Error finding nearby available drivers by base location", {
        latitude,
        longitude,
        radiusKm,
        availableFrom,
        error,
      });
      throw error;
    }
  }

  private async getDriversHandlingRideRequests(): Promise<Types.ObjectId[]> {
    const groups = await RideRequestGroupModel.find({
      status: RideRequestGroupStatus.SEARCHING,
    })
      .select("candidateDriverIds currentIndex")
      .lean()
      .exec();

    const activeDriverIds: Types.ObjectId[] = [];

    for (const group of groups) {
      const currentDriverId = group.candidateDriverIds[group.currentIndex];

      if (currentDriverId) {
        activeDriverIds.push(currentDriverId);
      }
    }

    return activeDriverIds;
  }

  private toDriverAvailabilityDocument(
    doc: NearbyAvailableDriverAggregationResult | BaseLocationAggregationResult,
  ): HydratedDocument<IDriverAvailabilityModel> {
    return new DriverAvailabilityModel({
      _id: doc._id,
      driverId: doc.driverId,
      status: doc.status,
      currentLocation: doc.currentLocation,
      locationPoint: doc.locationPoint,
      recurringSchedule: doc.recurringSchedule,
      exceptions: doc.exceptions ?? [],
      isActive: doc.isActive,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  private calculateEtaMinutes(distanceKm: number): number {
    return Math.ceil((distanceKm / this.AVERAGE_SPEED_KM_PER_HOUR) * 60);
  }

  private roundToTwoDecimals(value: number): number {
    return Math.round(value * 100) / 100;
  }

  private isAvailableForRequestedDuration(
    availability: DriverAvailability,
    rideStart: Date,
    rideEnd: Date,
  ): boolean {
    return availability.isAvailableForTimeRange(rideStart, rideEnd);
  }

  private calculateHaversineDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const toRad = (value: number): number => (value * Math.PI) / 180;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return this.HAVERSINE_RADIUS_KM * c;
  }

  private buildFilterQuery(
    filters: IDriverAvailabilityFilters,
  ): FilterQuery<IDriverAvailabilityModel> {
    const query: FilterQuery<IDriverAvailabilityModel> = {};

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.driverId) {
      query.driverId = new Types.ObjectId(filters.driverId);
    }

    if (filters.availableFrom && filters.availableTill) {
      query["recurringSchedule.validity.startDate"] = {
        $lt: filters.availableTill,
      };
      query["recurringSchedule.validity.endDate"] = {
        $gt: filters.availableFrom,
      };
    }

    return query;
  }
}
