import { injectable } from "inversify";
import { Types } from "mongoose";
import {
  IAdminDriverRepository,
  DriverFilters,
  PaginationOptions,
  PaginatedResult,
  DriverWithStats,
} from "@domain/repositories/admin/IAdminDriverRepository";
import { UserModel } from "../../models/UserModel";
import { DriverModel } from "../../models/DriverModel";
import { Logger } from "@shared/utils/Logger";
import { PipelineStage } from "mongoose";

@injectable()
export class MongoAdminDriverRepository implements IAdminDriverRepository {
  async findDriversOnly(
    filters: DriverFilters,
    pagination: PaginationOptions
  ): Promise<PaginatedResult<DriverWithStats>> {
    try {
      const driverObjectIds: Types.ObjectId[] =
        await DriverModel.distinct("userId");

      const userQuery: any = {
        _id: { $in: driverObjectIds },
        role: "Driver",
      };

      if (filters.search) {
        userQuery.$or = [
          { name: { $regex: filters.search, $options: "i" } },
          { email: { $regex: filters.search, $options: "i" } },
          { mobile: { $regex: filters.search, $options: "i" } },
        ];
      }

      if (filters.dateFrom || filters.dateTo) {
        userQuery.createdAt = {};
        if (filters.dateFrom)
          userQuery.createdAt.$gte = new Date(filters.dateFrom);
        if (filters.dateTo) {
          const end = new Date(filters.dateTo);
          end.setHours(23, 59, 59, 999);
          userQuery.createdAt.$lte = end;
        }
      }

      const skip = (pagination.page - 1) * pagination.pageSize;

      //  Aggregation pipeline
      const pipeline: PipelineStage[] = [
        { $match: userQuery },

        // Join driver documents
        {
          $lookup: {
            from: "drivers",
            localField: "_id",
            foreignField: "userId",
            as: "driverData",
          },
        },
        { $unwind: "$driverData" },

        // Join booking stats
        {
          $lookup: {
            from: "bookings",
            localField: "_id",
            foreignField: "driverId",
            as: "rides",
          },
        },
        {
          $addFields: {
            totalRides: { $size: "$rides" },
            totalEarned: { $sum: "$rides.driverEarnings" },
            lastRide: { $max: "$rides.createdAt" },
          },
        },

        // Project final output
        {
          $project: {
            driverId: "$driverData._id",
            name: 1,
            email: 1,
            mobile: 1,
            status: "$driverData.status",
            kycStatus: "$driverData.kycStatus",
            totalRides: 1,
            totalEarned: { $ifNull: ["$totalEarned", 0] },
            lastRide: 1,
            joinedDate: "$createdAt",
            isVerified: 1,
            licenseNumber: "$driverData.licenseNumber",
            licenseExpiryDate: "$driverData.licenseExpiryDate",
            eligibleVehicleType: "$driverData.eligibleVehicleType",
            eligibleGearType: "$driverData.eligibleGearType",
            createdAt: 1,
          },
        },
      ];

      const postMatch: any = {};
      if (filters.status) postMatch.status = filters.status;
      if (filters.kycStatus) postMatch.kycStatus = filters.kycStatus;
      if (Object.keys(postMatch).length) pipeline.push({ $match: postMatch });

      // Sort, count, paginate
      const sortField = this.mapSortField(filters.sortBy || "createdAt");
      const sortOrder = filters.sortOrder === "desc" ? -1 : 1;
      pipeline.push({ $sort: { [sortField]: sortOrder } });

      const totalCountPipeline = [...pipeline, { $count: "total" }];
      const totalResult = await UserModel.aggregate(totalCountPipeline);
      const totalItems = totalResult[0]?.total || 0;

      const dataPipeline = [
        ...pipeline,
        { $skip: skip },
        { $limit: pagination.pageSize },
      ];
      const drivers = await UserModel.aggregate(dataPipeline);

      // Format lastRide
      const formatted = drivers.map((d) => ({
        ...d,
        lastRide: d.lastRide ? d.lastRide.toISOString().split("T")[0] : null,
      }));

      const totalPages = Math.ceil(totalItems / pagination.pageSize);

      Logger.info("Drivers fetched from database", {
        totalItems,
        page: pagination.page,
        pageSize: pagination.pageSize,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
        filters: {
          search: filters.search,
          status: filters.status,
          kycStatus: filters.kycStatus,
        },
      });

      return {
        data: formatted,
        pagination: {
          page: pagination.page,
          pageSize: pagination.pageSize,
          totalPages,
          totalItems,
        },
      };
    } catch (error) {
      Logger.error("Error fetching drivers from database", error);
      throw error;
    }
  }

  private mapSortField(sortBy: string): string {
    const map: Record<string, string> = {
      name: "name",
      email: "email",
      totalRides: "totalRides",
      totalEarned: "totalEarned",
      createdAt: "createdAt",
      lastRide: "lastRide",
      status: "status",
      kycStatus: "kycStatus",
    };
    return map[sortBy] || "createdAt";
  }

  async updateDriverStatus(
    driverId: string,
    status: string,
    reason?: string
  ): Promise<void> {
    try {
      const update: any = { status, updatedAt: new Date() };
      if (reason) {
        update.statusChangeReason = reason;
        update.statusChangedAt = new Date();
      }
      await DriverModel.findByIdAndUpdate(driverId, update);
      Logger.info("Driver status updated", { driverId, status, reason });
    } catch (err) {
      Logger.error("Error updating driver status", err);
      throw err;
    }
  }

  async getDriverStats(driverId: string): Promise<any> {
    try {
      const pipeline: PipelineStage[] = [
        { $match: { _id: new Types.ObjectId(driverId) } },
        {
          $lookup: {
            from: "bookings",
            localField: "_id",
            foreignField: "driverId",
            as: "rides",
          },
        },
        {
          $project: {
            totalRides: { $size: "$rides" },
            totalEarned: { $sum: "$rides.driverEarnings" },
            lastRideDate: { $max: "$rides.createdAt" },
          },
        },
      ];
      const result = await DriverModel.aggregate(pipeline);
      return result[0] || { totalRides: 0, totalEarned: 0, lastRideDate: null };
    } catch (err) {
      Logger.error("Error fetching driver stats", err);
      throw err;
    }
  }
}
