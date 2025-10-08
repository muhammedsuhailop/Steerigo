import { injectable } from "inversify";
import {
  AdminDriverRepository,
  AdminDriverSummary,
} from "@application/repositories/AdminDriverRepository";
import { Driver } from "@domain/entities/Driver";
import { DriverModel } from "../models/DriverModel";
import { DriverDomainMapper } from "../mappers/DriverDomainMapper";
import {
  QueryOptions,
  PaginatedResult,
  FilterOptions,
} from "@shared/types/Repository";

// Local union of generic filters + admin extras
type AdminDriverFilterOptions = FilterOptions<Driver> & {
  status?: string;
  search?: string;
  dateFrom?: Date;
  dateTo?: Date;
};

@injectable()
export class AdminDriverRepositoryImpl implements AdminDriverRepository {
  async findById(id: string): Promise<Driver | null> {
    const doc = await DriverModel.findById(id);
    return doc ? DriverDomainMapper.toDomain(doc) : null;
  }

  async exists(id: string): Promise<boolean> {
    return (await DriverModel.countDocuments({ _id: id })) > 0;
  }

  async findByIds(ids: string[]): Promise<Driver[]> {
    const docs = await DriverModel.find({ _id: { $in: ids } });
    return docs.map(DriverDomainMapper.toDomain);
  }

  async findAll(options?: QueryOptions): Promise<Driver[]> {
    const query = DriverModel.find();
    if (options?.limit) query.limit(options.limit);
    if (options?.offset) query.skip(options.offset);
    const docs = await query.exec();
    return docs.map(DriverDomainMapper.toDomain);
  }

  async count(filters?: AdminDriverFilterOptions): Promise<number> {
    const mongoFilter = this.buildFilterQuery(filters ?? {});
    return DriverModel.countDocuments(mongoFilter);
  }

  async existsByFilter(filters: AdminDriverFilterOptions): Promise<boolean> {
    const mongoFilter = this.buildFilterQuery(filters);
    return (await DriverModel.countDocuments(mongoFilter)) > 0;
  }

  async findPaginated(
    options: QueryOptions & { filters?: AdminDriverFilterOptions }
  ): Promise<PaginatedResult<Driver>> {
    const {
      page = 1,
      limit = 10,
      filters = {} as AdminDriverFilterOptions,
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

    const data = docs.map(DriverDomainMapper.toDomain);
    return { data, total, page, limit, totalPages };
  }

  async findByUserId(userId: string): Promise<Driver | null> {
    const doc = await DriverModel.findOne({ userId });
    return doc ? DriverDomainMapper.toDomain(doc) : null;
  }

  async findDriversWithSummary(
    filters: AdminDriverFilterOptions,
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
    const mongoFilter = this.buildFilterQuery(filters);
    const totalItems = await DriverModel.countDocuments(mongoFilter);
    const totalPages = Math.ceil(totalItems / pagination.pageSize);
    const skip = (pagination.page - 1) * pagination.pageSize;

    const pipeline = [
      { $match: mongoFilter },
      {
        $lookup: {
          from: "rides",
          localField: "_id",
          foreignField: "driverId",
          as: "rides",
        },
      },
      {
        $lookup: {
          from: "kyc_requests",
          localField: "_id",
          foreignField: "driverId",
          as: "kycRequest",
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
          kycStatus: {
            $cond: {
              if: { $gt: [{ $size: "$kycRequest" }, 0] },
              then: { $arrayElemAt: ["$kycRequest.status", 0] },
              else: null,
            },
          },
        },
      },
      {
        $project: {
          driverId: "$_id",
          userId: 1,
          name: 1,
          email: 1,
          mobile: 1,
          status: 1,
          licenseNumber: 1,
          vehicleNumber: 1,
          profilePicture: 1,
          totalRides: 1,
          totalEarnings: 1,
          rating: { $ifNull: ["$rating", 0] },
          lastRideDate: 1,
          createdAt: 1,
          kycStatus: 1,
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
        name: r.name,
        email: r.email,
        mobile: r.mobile,
        status: r.status,
        licenseNumber: r.licenseNumber,
        vehicleNumber: r.vehicleNumber,
        profilePicture: r.profilePicture,
        totalRides: r.totalRides ?? 0,
        totalEarnings: r.totalEarnings ?? 0,
        rating: r.rating ?? 0,
        lastRideDate: r.lastRideDate ?? null,
        createdAt: r.createdAt,
        kycStatus: r.kycStatus,
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
    const update: Partial<any> = {
      status,
      updatedAt: new Date(),
    };
    if (reason) update.statusReason = reason;

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
    stats: {
      totalRides: number;
      totalEarnings: number;
      rating: number;
      lastRideDate?: Date;
    };
  } | null> {
    const driver = await this.findById(driverId);
    if (!driver) return null;

    const stats = await this.getDriverStats(driverId);
    return { driver, stats };
  }

  private buildFilterQuery(filters: FilterOptions<Driver>): Record<string, any> {
    const q: Record<string, any> = {};

    if ("status" in filters && typeof (filters as any).status === "string") {
      q.status = (filters as any).status;
    }

    if (
      "search" in filters &&
      typeof (filters as any).search === "string" &&
      (filters as any).search.trim() !== ""
    ) {
      const s = (filters as any).search.trim();
      q.$or = [
        { name: { $regex: s, $options: "i" } },
        { email: { $regex: s, $options: "i" } },
        { mobile: { $regex: s, $options: "i" } },
        { licenseNumber: { $regex: s, $options: "i" } },
        { vehicleNumber: { $regex: s, $options: "i" } },
      ];
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

  private buildSortQuery(
    sortBy?: string,
    sortOrder?: "asc" | "desc"
  ): Record<string, 1 | -1> {
    const order = sortOrder === "asc" ? 1 : -1;
    const field = sortBy ?? "createdAt";
    return { [field]: order };
  }
}
