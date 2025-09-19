import { injectable } from "inversify";
import {
  IAdminUserRepository,
  UserFilters,
  PaginationOptions,
  PaginatedResult,
  UserWithStats,
} from "@domain/repositories/admin/IAdminUserRepository";
import { UserModel } from "../../models/UserModel";
import { DriverModel } from "../../models/DriverModel";
import { Logger } from "@shared/utils/Logger";
import { PipelineStage } from "mongoose";

@injectable()
export class MongoAdminUserRepository implements IAdminUserRepository {
  async findUsersOnly(
    filters: UserFilters,
    pagination: PaginationOptions
  ): Promise<PaginatedResult<UserWithStats>> {
    try {
      const driverUserIds = await DriverModel.distinct("userId");

      const query: any = {
        _id: { $nin: driverUserIds },
        role: { $ne: "Admin" },
      };

      if (filters.status) {
        query.status = filters.status;
      }

      if (filters.search) {
        query.$or = [
          { name: { $regex: filters.search, $options: "i" } },
          { email: { $regex: filters.search, $options: "i" } },
        ];
      }

      if (filters.dateFrom || filters.dateTo) {
        query.createdAt = {};
        if (filters.dateFrom) query.createdAt.$gte = filters.dateFrom;
        if (filters.dateTo) query.createdAt.$lte = filters.dateTo;
      }

      const skip = (pagination.page - 1) * pagination.pageSize;

      const pipeline: PipelineStage[] = [
        { $match: query },
        {
          $lookup: {
            from: "bookings",
            localField: "_id",
            foreignField: "userId",
            as: "bookings",
          },
        },
        {
          $addFields: {
            totalBookings: { $size: "$bookings" },
            totalSpent: {
              $sum: {
                $map: {
                  input: "$bookings",
                  as: "booking",
                  in: "$$booking.totalAmount",
                },
              },
            },
            lastBooked: { $max: "$bookings.createdAt" },
          },
        },
        {
          $project: {
            userId: { $toString: "$_id" },
            name: 1,
            email: 1,
            status: 1,
            totalBookings: 1,
            totalSpent: { $ifNull: ["$totalSpent", 0] },
            lastBooked: 1,
            joinedDate: "$createdAt",
            isVerified: 1,
          },
        },
        { $sort: { createdAt: -1 } },
      ];

      const totalPipeline = [...pipeline, { $count: "total" }];
      const totalResult = await UserModel.aggregate(totalPipeline);
      const totalItems = totalResult[0]?.total || 0;

      const dataPipeline = [
        ...pipeline,
        { $skip: skip },
        { $limit: pagination.pageSize },
      ];

      const users = await UserModel.aggregate(dataPipeline);

      const formattedUsers = users.map((user) => ({
        ...user,
        lastBooked: user.lastBooked
          ? user.lastBooked.toISOString().split("T")[0]
          : null,
      }));

      const totalPages = Math.ceil(totalItems / pagination.pageSize);

      Logger.info("Users fetched from database", {
        totalItems,
        page: pagination.page,
        pageSize: pagination.pageSize,
      });

      return {
        data: formattedUsers,
        pagination: {
          page: pagination.page,
          pageSize: pagination.pageSize,
          totalPages,
          totalItems,
        },
      };
    } catch (error) {
      Logger.error("Error fetching users from database", error);
      throw error;
    }
  }

  async updateUserStatus(
    userId: string,
    status: string,
    reason?: string
  ): Promise<void> {
    try {
      const updateData: any = {
        status,
        updatedAt: new Date(),
      };

      if (reason) {
        updateData.statusChangeReason = reason;
        updateData.statusChangedAt = new Date();
      }

      await UserModel.findByIdAndUpdate(userId, updateData);

      Logger.info("User status updated in database", {
        userId,
        status,
        reason,
      });
    } catch (error) {
      Logger.error("Error updating user status in database", error);
      throw error;
    }
  }

  async getUserStats(userId: string): Promise<any> {
    try {
      const pipeline = [
        { $match: { _id: userId } },
        {
          $lookup: {
            from: "bookings",
            localField: "_id",
            foreignField: "userId",
            as: "bookings",
          },
        },
        {
          $project: {
            totalBookings: { $size: "$bookings" },
            totalSpent: { $sum: "$bookings.totalAmount" },
            lastBookingDate: { $max: "$bookings.createdAt" },
          },
        },
      ];

      const result = await UserModel.aggregate(pipeline);
      return (
        result[0] || { totalBookings: 0, totalSpent: 0, lastBookingDate: null }
      );
    } catch (error) {
      Logger.error("Error fetching user stats", error);
      throw error;
    }
  }
}
