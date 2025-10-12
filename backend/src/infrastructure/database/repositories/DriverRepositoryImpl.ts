import { injectable } from "inversify";
import { DriverRepository } from "@application/repositories/DriverRepository";
import { Driver } from "@domain/entities/Driver";
import { DriverModel, IDriverModel } from "../models/DriverModel";
import { DriverMapper } from "../mappers/DriverMapper";
import { FilterOptions, PaginatedResult, QueryOptions } from "@shared/types/Repository";
import { DriverStatus } from "@domain/value-objects/DriverStatus";
import { KYCStatus } from "@domain/value-objects/KYCStatus";
import { LicenseCategory } from "@domain/value-objects/LicenseCategory";
import { Logger } from "@shared/utils/Logger";
import { SortOrder } from "mongoose";
import { DriverFilters } from "@domain/repositories/admin/IAdminDriverRepository";

@injectable()
export class DriverRepositoryImpl implements DriverRepository {
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
        // Update existing driver
        savedDoc = await DriverModel.findByIdAndUpdate(driverId, driverData, {
          new: true,
        });
      } else {
        // Create new driver
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

  async count(): Promise<number> {
    try {
      return await DriverModel.countDocuments();
    } catch (error) {
      Logger.error("Error counting drivers", { error });
      throw error;
    }
  }

  async saveMany(drivers: Driver[]): Promise<Driver[]> {
    try {
      const driverDocs = drivers.map(DriverMapper.toPersistence);
      const operations = driverDocs.map((doc) => ({
        updateOne: {
          filter: { _id: doc._id },
          update: doc,
          upsert: true,
        },
      }));

      await DriverModel.bulkWrite(operations);

      const ids = drivers.map((d) => d.getId());
      const savedDrivers = await DriverModel.find({ _id: { $in: ids } });

      return savedDrivers.map(DriverMapper.toDomain);
    } catch (error) {
      Logger.error("Error saving multiple drivers", { error });
      throw error;
    }
  }

  private buildFilterQuery(
    filters: FilterOptions<Driver>
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
      // Search will need to be handled via lookup
      // For now, search by userId only
      const s = (filters as any).search.trim();
      q.userId = { $regex: s, $options: "i" };
    }

    if ("dateFrom" in filters || "dateTo" in filters) {
      const d: Record<string, Date> = {};
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

  async existsByFilter(filters: FilterOptions<Driver>): Promise<boolean> {
    const mongoFilter = this.buildFilterQuery(filters);
    return (await DriverModel.countDocuments(mongoFilter)) > 0;
  }

  async findByIds(ids: string[]): Promise<Driver[]> {
    const docs = await DriverModel.find({ _id: { $in: ids } });
    return docs.map(DriverMapper.toDomain);
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

  async updateMany(
    filters: FilterOptions<Driver>,
    updates: Partial<Driver>
  ): Promise<number> {
    try {
      // Convert domain updates to persistence format if needed
      const updateData: any = {};

      // Map domain fields to database fields
      if (updates.getEligibleGearTypes)
        updateData.eligibleGearTypes = updates.getEligibleGearTypes;
      if (updates.getEligibleBodyTypes)
        updateData.eligibleBodyTypes = updates.getEligibleBodyTypes;
      if (updates.getLicenceCategory)
        updateData.licenceCategory = updates.getLicenceCategory;
      if (updates.getLicenseIssueDate)
        updateData.licenseIssueDate = updates.getLicenseIssueDate;
      if (updates.getLicenseExpiryDate)
        updateData.licenseExpiryDate = updates.getLicenseExpiryDate;
      if (updates.getKycStatus) updateData.kycStatus = updates.getKycStatus;
      if (updates.getStatus) updateData.status = updates.getStatus;

      // Always update the updatedAt field
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

  async findPaginated(
    options: QueryOptions & { filters?: FilterOptions<Driver> }
  ): Promise<PaginatedResult<Driver>> {
    const {
      page = 1,
      limit = 10,
      filters = {} as FilterOptions<Driver>,
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
  // Driver-specific methods
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
}
