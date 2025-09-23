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
        if (filters.dateFrom) {
          query.createdAt.$gte = new Date(filters.dateFrom);
        }
        if (filters.dateTo) {
          const endDate = new Date(filters.dateTo);
          endDate.setHours(23, 59, 59, 999);
          query.createdAt.$lte = endDate;
        }
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
            mobile: 1,
            totalBookings: 1,
            totalSpent: { $ifNull: ["$totalSpent", 0] },
            lastBooked: 1,
            joinedDate: "$createdAt",
            isVerified: 1,
            createdAt: 1,
          },
        },
      ];

      const sortField = this.mapSortField(filters.sortBy || "createdAt");
      const sortOrder = filters.sortOrder === "desc" ? -1 : 1;
      pipeline.push({ $sort: { [sortField]: sortOrder } });

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
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
        filters: {
          status: filters.status,
          search: filters.search,
          dateFrom: filters.dateFrom,
          dateTo: filters.dateTo,
        },
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

  private mapSortField(sortBy: string): string {
    const sortFieldMap: Record<string, string> = {
      name: "name",
      email: "email",
      totalBookings: "totalBookings",
      totalSpent: "totalSpent",
      createdAt: "createdAt",
      lastBooked: "lastBooked",
      status: "status",
    };
    return sortFieldMap[sortBy] || "createdAt";
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

  async getUserStats(userId: string): Promise<UserWithStats> {
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
