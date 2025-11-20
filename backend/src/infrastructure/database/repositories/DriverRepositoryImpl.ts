import { injectable } from "inversify";
import { DriverRepository } from "@application/repositories/DriverRepository";
import { AdminDriverRepository } from "@application/repositories/AdminDriverRepository";
import { Driver } from "@domain/entities/Driver";
import { DriverModel, IDriverModel } from "../models/DriverModel";
import { DriverMapper } from "../mappers/DriverMapper";
import {
  FilterOptions,
  PaginatedResult,
  QueryOptions,
} from "@shared/types/Repository";
import { DriverStatus } from "@domain/value-objects/DriverStatus";
import { KYCStatus } from "@domain/value-objects/KYCStatus";
import { LicenseCategory } from "@domain/value-objects/LicenseCategory";
import { Logger } from "@shared/utils/Logger";
import { PipelineStage, SortOrder, Types } from "mongoose";
import {
  AdminDriverQuery,
  AdminDriverSummary,
} from "@application/repositories/AdminDriverRepository";

type UnifiedDriverFilterOptions = FilterOptions<Driver> & AdminDriverQuery;

@injectable()
export class DriverRepositoryImpl
  implements DriverRepository, AdminDriverRepository
{
  //  Basic Repository Operations

  async findById(id: string): Promise<Driver | null> {
    try {
      const driverDoc = await DriverModel.findById(id);
      return driverDoc ? DriverMapper.toDomain(driverDoc) : null;
    } catch (error) {
      Logger.error("Error finding driver by id", { id, error });
      throw error;
    }
  }

  async exists(id: string): Promise<boolean> {
    try {
      const count = await DriverModel.countDocuments({ _id: id });
      return count > 0;
    } catch (error) {
      Logger.error("Error checking driver existence", { id, error });
      throw error;
    }
  }

  async save(driver: Driver): Promise<Driver> {
    try {
      const driverData = DriverMapper.toPersistence(driver);
      const driverId = driver.getId();
      const existingDriver = await DriverModel.findById(driverId);

      let savedDoc: any;
      if (existingDriver) {
        savedDoc = await DriverModel.findByIdAndUpdate(driverId, driverData, {
          new: true,
        });
      } else {
        savedDoc = await DriverModel.create({
          _id: driverId,
          ...driverData,
        });
      }

      return DriverMapper.toDomain(savedDoc);
    } catch (error) {
      Logger.error("Error saving driver", { driverId: driver.getId(), error });
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await DriverModel.findByIdAndDelete(id);
      Logger.info("Driver deleted successfully", { id });
    } catch (error) {
      Logger.error("Error deleting driver", { id, error });
      throw error;
    }
  }

  //  Query Operations

  async findAll(options?: QueryOptions): Promise<Driver[]> {
    try {
      const query = DriverModel.find();
      if (options?.limit) query.limit(options.limit);
      if (options?.offset) query.skip(options.offset);
      if (options?.sortBy) {
        const sortOrder = options.sortOrder === "desc" ? -1 : 1;
        query.sort({ [options.sortBy]: sortOrder as SortOrder });
      }

      const drivers = await query.exec();
      return drivers.map(DriverMapper.toDomain);
    } catch (error) {
      Logger.error("Error finding all drivers", { error });
      throw error;
    }
  }

  async count(filters?: UnifiedDriverFilterOptions): Promise<number> {
    try {
      const mongoFilter = this.buildFilterQuery(
        filters ?? ({} as UnifiedDriverFilterOptions)
      );
      return await DriverModel.countDocuments(mongoFilter);
    } catch (error) {
      Logger.error("Error counting drivers", { error });
      throw error;
    }
  }

  async existsByFilter(filters: UnifiedDriverFilterOptions): Promise<boolean> {
    const mongoFilter = this.buildFilterQuery(filters);
    return (await DriverModel.countDocuments(mongoFilter)) > 0;
  }

  async findByIds(ids: string[]): Promise<Driver[]> {
    const docs = await DriverModel.find({ _id: { $in: ids } });
    return docs.map(DriverMapper.toDomain);
  }

  async findPaginated(
    options: QueryOptions & { filters?: UnifiedDriverFilterOptions }
  ): Promise<PaginatedResult<Driver>> {
    const {
      page = 1,
      limit = 10,
      filters = {} as UnifiedDriverFilterOptions,
      sortBy = "createdAt" as keyof Driver,
      sortOrder = "desc",
    } = options;

    const mongoFilter = this.buildFilterQuery(filters);
    const sortValue = {
      [sortBy]: sortOrder === "asc" ? 1 : -1,
    } as const;

    const total = await DriverModel.countDocuments(mongoFilter);
    const totalPages = Math.ceil(total / limit);
    const skip = (page - 1) * limit;

    const docs = await DriverModel.find(mongoFilter)
      .sort(sortValue)
      .skip(skip)
      .limit(limit)
      .exec();

    const data = docs.map(DriverMapper.toDomain);
    return { data, total, page, limit, totalPages };
  }

  //  Batch Operations

  async updateMany(
    filters: FilterOptions<Driver>,
    updates: Partial<Driver>
  ): Promise<number> {
    try {
      const updateData: any = {};

      // Map domain fields to database fields
      if (updates.getEligibleGearTypes)
        updateData.eligibleGearTypes = updates.getEligibleGearTypes();
      if (updates.getEligibleBodyTypes)
        updateData.eligibleBodyTypes = updates.getEligibleBodyTypes();
      if (updates.getLicenceCategory)
        updateData.licenceCategory = updates.getLicenceCategory();
      if (updates.getLicenseIssueDate)
        updateData.licenseIssueDate = updates.getLicenseIssueDate();
      if (updates.getLicenseExpiryDate)
        updateData.licenseExpiryDate = updates.getLicenseExpiryDate();
      if (updates.getKycStatus) updateData.kycStatus = updates.getKycStatus();
      if (updates.getStatus) updateData.status = updates.getStatus();

      updateData.updatedAt = new Date();

      const result = await DriverModel.updateMany(filters, {
        $set: updateData,
      });

      Logger.info("Multiple drivers updated", {
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount,
      });

      return result.modifiedCount || 0;
    } catch (error) {
      Logger.error("Error updating multiple drivers", {
        filters,
        updates,
        error,
      });
      throw error;
    }
  }

  async deleteMany(filters: FilterOptions<Driver>): Promise<number> {
    try {
      const result = await DriverModel.deleteMany(filters);
      Logger.info("Multiple drivers deleted", { count: result.deletedCount });
      return result.deletedCount ?? 0;
    } catch (error) {
      Logger.error("Error deleting multiple drivers", { filters, error });
      throw error;
    }
  }

  //  Driver-Specific Operations

  async findByUserId(userId: string): Promise<Driver | null> {
    try {
      const driverDoc = await DriverModel.findOne({ userId });
      return driverDoc ? DriverMapper.toDomain(driverDoc) : null;
    } catch (error) {
      Logger.error("Error finding driver by userId", { userId, error });
      throw error;
    }
  }

  async existsByUserId(userId: string): Promise<boolean> {
    try {
      const count = await DriverModel.countDocuments({ userId });
      return count > 0;
    } catch (error) {
      Logger.error("Error checking driver existence by userId", {
        userId,
        error,
      });
      throw error;
    }
  }

  async findByStatus(
    status: DriverStatus,
    options?: QueryOptions
  ): Promise<Driver[]> {
    try {
      const query = DriverModel.find({ status });
      if (options?.limit) query.limit(options.limit);
      if (options?.offset) query.skip(options.offset);
      if (options?.sortBy) {
        const sortOrder = options.sortOrder === "desc" ? -1 : 1;
        query.sort({ [options.sortBy]: sortOrder as SortOrder });
      }

      const drivers = await query.exec();
      return drivers.map(DriverMapper.toDomain);
    } catch (error) {
      Logger.error("Error finding drivers by status", { status, error });
      throw error;
    }
  }

  async findByKycStatus(
    kycStatus: KYCStatus,
    options?: QueryOptions
  ): Promise<Driver[]> {
    try {
      const query = DriverModel.find({ kycStatus });
      if (options?.limit) query.limit(options.limit);
      if (options?.offset) query.skip(options.offset);
      if (options?.sortBy) {
        const sortOrder = options.sortOrder === "desc" ? -1 : 1;
        query.sort({ [options.sortBy]: sortOrder as SortOrder });
      }

      const drivers = await query.exec();
      return drivers.map(DriverMapper.toDomain);
    } catch (error) {
      Logger.error("Error finding drivers by KYC status", { kycStatus, error });
      throw error;
    }
  }

  async findByLicenseCategory(
    category: LicenseCategory,
    options?: QueryOptions
  ): Promise<Driver[]> {
    try {
      const query = DriverModel.find({ licenceCategory: category });
      if (options?.limit) query.limit(options.limit);
      if (options?.offset) query.skip(options.offset);
      if (options?.sortBy) {
        const sortOrder = options.sortOrder === "desc" ? -1 : 1;
        query.sort({ [options.sortBy]: sortOrder as SortOrder });
      }

      const drivers = await query.exec();
      return drivers.map(DriverMapper.toDomain);
    } catch (error) {
      Logger.error("Error finding drivers by license category", {
        category,
        error,
      });
      throw error;
    }
  }

  async findActiveDrivers(options?: QueryOptions): Promise<Driver[]> {
    return this.findByStatus(DriverStatus.ACTIVE, options);
  }

  async countByStatus(status: DriverStatus): Promise<number> {
    try {
      return await DriverModel.countDocuments({ status });
    } catch (error) {
      Logger.error("Error counting drivers by status", { status, error });
      throw error;
    }
  }

  async countByKycStatus(kycStatus: KYCStatus): Promise<number> {
    try {
      return await DriverModel.countDocuments({ kycStatus });
    } catch (error) {
      Logger.error("Error counting drivers by KYC status", {
        kycStatus,
        error,
      });
      throw error;
    }
  }

  // Admin-Specific Operations

  async findDriversWithSummary(
    filters: AdminDriverQuery,
    pagination: { page: number; pageSize: number },
    sortBy?: string,
    sortOrder?: "asc" | "desc"
  ): Promise<{
    data: AdminDriverSummary[];
    pagination: {
      currentPage: number;
      pageSize: number;
      totalItems: number;
      totalPages: number;
    };
  }> {
    const mongoFilter = this.buildFilterQuery(
      filters as UnifiedDriverFilterOptions
    );
    const totalItems = await DriverModel.countDocuments(mongoFilter);
    const totalPages = Math.ceil(totalItems / pagination.pageSize);
    const skip = (pagination.page - 1) * pagination.pageSize;

    const pipeline: PipelineStage[] = [
      { $match: mongoFilter },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $lookup: {
          from: "rides",
          localField: "_id",
          foreignField: "driverId",
          as: "rides",
        },
      },
      {
        $addFields: {
          totalRides: { $size: "$rides" },
          totalEarnings: {
            $sum: {
              $map: { input: "$rides", as: "r", in: "$$r.earnings" },
            },
          },
          rating: {
            $avg: {
              $map: { input: "$rides", as: "r", in: "$$r.rating" },
            },
          },
          lastRideDate: {
            $max: {
              $map: { input: "$rides", as: "r", in: "$$r.completedAt" },
            },
          },
        },
      },
      {
        $project: {
          driverId: "$_id",
          userId: 1,
          userName: "$user.name",
          userEmail: "$user.email",
          userMobile: "$user.mobile",
          status: 1,
          kycStatus: 1,
          licenceCategory: 1,
          eligibleGearTypes: 1,
          eligibleBodyTypes: 1,
          licenseIssueDate: 1,
          licenseExpiryDate: 1,
          totalRides: 1,
          totalEarnings: 1,
          rating: { $ifNull: ["$rating", 0] },
          lastRideDate: 1,
          createdAt: 1,
        },
      },
      {
        $sort: this.buildSortQuery(sortBy, sortOrder),
      },
      { $skip: skip },
      { $limit: pagination.pageSize },
    ];

    const results = await DriverModel.aggregate(pipeline);

    return {
      data: results.map((r) => ({
        driverId: r.driverId.toString(),
        userId: r.userId,
        userName: r.userName,
        userEmail: r.userEmail,
        userMobile: r.userMobile,
        status: r.status,
        kycStatus: r.kycStatus,
        licenceCategory: r.licenceCategory,
        eligibleGearTypes: r.eligibleGearTypes ?? [],
        eligibleBodyTypes: r.eligibleBodyTypes ?? [],
        licenseIssueDate: r.licenseIssueDate,
        licenseExpiryDate: r.licenseExpiryDate,
        totalRides: r.totalRides ?? 0,
        totalEarnings: r.totalEarnings ?? 0,
        rating: r.rating ?? 0,
        lastRideDate: r.lastRideDate ?? null,
        createdAt: r.createdAt,
      })),
      pagination: {
        currentPage: pagination.page,
        pageSize: pagination.pageSize,
        totalItems,
        totalPages,
      },
    };
  }

  async updateDriverStatus(
    driverId: string,
    status: string,
    reason?: string
  ): Promise<boolean> {
    const update: Partial<IDriverModel> = {
      status,
      updatedAt: new Date(),
    };
    if (reason) (update as any).statusReason = reason;

    const res = await DriverModel.updateOne({ _id: driverId }, update);
    return res.modifiedCount > 0;
  }

  async getDriverStats(driverId: string): Promise<{
    totalRides: number;
    totalEarnings: number;
    rating: number;
    lastRideDate?: Date;
  }> {
    const pipeline = [
      { $match: { _id: driverId } },
      {
        $lookup: {
          from: "rides",
          localField: "_id",
          foreignField: "driverId",
          as: "rides",
        },
      },
      {
        $project: {
          totalRides: { $size: "$rides" },
          totalEarnings: { $sum: "$rides.earnings" },
          rating: { $avg: "$rides.rating" },
          lastRideDate: { $max: "$rides.completedAt" },
        },
      },
    ];

    const [r] = await DriverModel.aggregate(pipeline);
    return {
      totalRides: r?.totalRides ?? 0,
      totalEarnings: r?.totalEarnings ?? 0,
      rating: r?.rating ?? 0,
      lastRideDate: r?.lastRideDate,
    };
  }

  async findDriverProfile(driverId: string): Promise<{
    driver: Driver;
    user: {
      id: string;
      name: string;
      email: string;
      mobile: string;
      profilePicture: string;
    };
    stats: {
      totalRides: number;
      totalEarnings: number;
      rating: number;
      lastRideDate?: Date;
    };
  } | null> {
    const objectId = new Types.ObjectId(driverId);
    const pipeline = [
      { $match: { _id: objectId } },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $lookup: {
          from: "rides",
          localField: "_id",
          foreignField: "driverId",
          as: "rides",
        },
      },
      {
        $addFields: {
          totalRides: { $size: "$rides" },
          totalEarnings: { $sum: "$rides.earnings" },
          rating: { $avg: "$rides.rating" },
          lastRideDate: { $max: "$rides.completedAt" },
        },
      },
    ];

    const [result] = await DriverModel.aggregate(pipeline);
    if (!result) return null;

    const driver = DriverMapper.toDomain(result);
    return {
      driver,
      user: {
        id: result.user._id.toString(),
        name: result.user.name,
        email: result.user.email,
        mobile: result.user.mobile,
        profilePicture: result.user.profilePicture ?? "",
      },
      stats: {
        totalRides: result.totalRides ?? 0,
        totalEarnings: result.totalEarnings ?? 0,
        rating: result.rating ?? 0,
        lastRideDate: result.lastRideDate,
      },
    };
  }

  //  Private Helper Methods

  private buildFilterQuery(
    filters: UnifiedDriverFilterOptions
  ): Record<string, any> {
    const q: Record<string, any> = {};

    if ("status" in filters && typeof (filters as any).status === "string") {
      q.status = (filters as any).status;
    }

    if (
      "kycStatus" in filters &&
      typeof (filters as any).kycStatus === "string"
    ) {
      q.kycStatus = (filters as any).kycStatus;
    }

    if (
      "licenceCategory" in filters &&
      typeof (filters as any).licenceCategory === "string"
    ) {
      q.licenceCategory = (filters as any).licenceCategory;
    }

    if (
      "search" in filters &&
      typeof (filters as any).search === "string" &&
      (filters as any).search.trim() !== ""
    ) {
      const s = (filters as any).search.trim();
      q.userId = { $regex: s, $options: "i" };
    }

    if ("dateFrom" in filters || "dateTo" in filters) {
      const d: Record<string, any> = {};
      if ("dateFrom" in filters && (filters as any).dateFrom instanceof Date) {
        d.$gte = (filters as any).dateFrom;
      }
      if ("dateTo" in filters && (filters as any).dateTo instanceof Date) {
        d.$lte = (filters as any).dateTo;
      }
      if (Object.keys(d).length) {
        q.createdAt = d;
      }
    }

    return q;
  }

  private buildSortQuery(
    sortBy?: string,
    sortOrder?: "asc" | "desc"
  ): Record<string, 1 | -1> {
    const order: 1 | -1 = sortOrder === "asc" ? 1 : -1;
    const field = sortBy ?? "createdAt";
    return { [field]: order };
  }
}
