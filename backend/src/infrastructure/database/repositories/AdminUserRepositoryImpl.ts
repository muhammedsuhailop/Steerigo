import { injectable } from "inversify";
import {
  IAdminUserRepository,
  IAdminUserSummary,
} from "@application/repositories/IAdminUserRepository";
import { User } from "@domain/entities/User";
import { UserModel } from "../models/UserModel";
import { UserDomainMapper } from "../mappers/UserDomainMapper";
import {
  QueryOptions,
  PaginatedResult,
  FilterOptions,
} from "@shared/types/Repository";

// Local union of generic filters + admin extras
type AdminFilterOptions = FilterOptions<User> & {
  status?: string;
  search?: string;
  dateFrom?: Date;
  dateTo?: Date;
};

@injectable()
export class AdminUserRepositoryImpl implements IAdminUserRepository {
  async findById(id: string): Promise<User | null> {
    const doc = await UserModel.findById(id);
    return doc ? UserDomainMapper.toDomain(doc) : null;
  }

  async exists(id: string): Promise<boolean> {
    return (await UserModel.countDocuments({ _id: id })) > 0;
  }

  async findByIds(ids: string[]): Promise<User[]> {
    const docs = await UserModel.find({ _id: { $in: ids } });
    return docs.map(UserDomainMapper.toDomain);
  }

  async findAll(options?: QueryOptions<User>): Promise<User[]> {
    const query = UserModel.find();
    if (options?.limit) query.limit(options.limit);
    if (options?.offset) query.skip(options.offset);
    const docs = await query.exec();
    return docs.map(UserDomainMapper.toDomain);
  }

  async count(filters?: AdminFilterOptions): Promise<number> {
    const mongoFilter = this.buildFilterQuery(filters ?? {});
    return UserModel.countDocuments(mongoFilter);
  }

  async existsByFilter(filters: AdminFilterOptions): Promise<boolean> {
    const mongoFilter = this.buildFilterQuery(filters);
    return (await UserModel.countDocuments(mongoFilter)) > 0;
  }

  async findPaginated(
    options: QueryOptions<User> & { filters?: AdminFilterOptions }
  ): Promise<PaginatedResult<User>> {
    const {
      page = 1,
      limit = 10,
      filters = {} as AdminFilterOptions,
      sortBy = "createdAt" as keyof User,
      sortOrder = "desc",
    } = options;

    const mongoFilter = this.buildFilterQuery(filters);
    const sortValue: Record<string, 1 | -1> = {
      [sortBy]: sortOrder === "asc" ? 1 : -1,
    };

    const total = await UserModel.countDocuments(mongoFilter);
    const totalPages = Math.ceil(total / limit);
    const skip = (page - 1) * limit;

    const docs = await UserModel.find(mongoFilter)
      .sort(sortValue)
      .skip(skip)
      .limit(limit)
      .exec();

    const data = docs.map(UserDomainMapper.toDomain);
    return { data, total, page, limit, totalPages };
  }

  async findUsersWithSummary(
    filters: AdminFilterOptions,
    pagination: { page: number; pageSize: number },
    sortBy?: string,
    sortOrder?: "asc" | "desc"
  ): Promise<{
    data: IAdminUserSummary[];
    pagination: {
      currentPage: number;
      pageSize: number;
      totalItems: number;
      totalPages: number;
    };
  }> {
    const mongoFilter = this.buildFilterQuery(filters);

    const totalItems = await UserModel.countDocuments(mongoFilter);
    const totalPages = Math.ceil(totalItems / pagination.pageSize);
    const skip = (pagination.page - 1) * pagination.pageSize;

    const pipeline = [
      { $match: mongoFilter },
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
              $map: { input: "$bookings", as: "b", in: "$$b.amount" },
            },
          },
          lastBooked: {
            $max: {
              $map: { input: "$bookings", as: "b", in: "$$b.createdAt" },
            },
          },
        },
      },
      {
        $project: {
          userId: "$_id",
          name: 1,
          email: 1,
          mobile: 1,
          status: 1,
          isVerified: 1,
          totalBookings: 1,
          totalSpent: 1,
          lastBooked: 1,
          createdAt: 1,
        },
      },
      {
        $sort: this.buildSortQuery(sortBy, sortOrder),
      },
      { $skip: skip },
      { $limit: pagination.pageSize },
    ];

    const results = await UserModel.aggregate(pipeline);
    return {
      data: results.map((r) => ({
        userId: r.userId.toString(),
        name: r.name,
        email: r.email,
        mobile: r.mobile,
        status: r.status,
        isVerified: r.isVerified,
        totalBookings: r.totalBookings ?? 0,
        totalSpent: r.totalSpent ?? 0,
        lastBooked: r.lastBooked ?? null,
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

  async updateUserStatus(
    userId: string,
    status: string,
    reason?: string
  ): Promise<boolean> {
    const update: Partial<Record<string, unknown>> = {
      status,
      updatedAt: new Date(),
    };
    if (reason) update.statusReason = reason;
    const res = await UserModel.updateOne({ _id: userId }, update);
    return res.modifiedCount > 0;
  }

  async getUserStats(userId: string): Promise<{
    totalBookings: number;
    totalSpent: number;
    lastBooked?: Date;
  }> {
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
          totalSpent: { $sum: "$bookings.amount" },
          lastBooked: { $max: "$bookings.createdAt" },
        },
      },
    ];
    const [r] = await UserModel.aggregate(pipeline);
    return {
      totalBookings: r?.totalBookings ?? 0,
      totalSpent: r?.totalSpent ?? 0,
      lastBooked: r?.lastBooked,
    };
  }

  private buildFilterQuery(
    filters: FilterOptions<User>
  ): Record<string, unknown> {
    const q: Record<string, unknown> = {};

    if ("status" in filters && typeof filters.status === "string") {
      q.status = filters.status;
    }

    if (
      "search" in filters &&
      typeof filters.search === "string" &&
      filters.search.trim() !== ""
    ) {
      const s = filters.search.trim();
      q.$or = [
        { name: { $regex: s, $options: "i" } },
        { email: { $regex: s, $options: "i" } },
        { mobile: { $regex: s, $options: "i" } },
      ];
    }

    if ("dateFrom" in filters || "dateTo" in filters) {
      const d: Record<string, Date> = {};
      if ("dateFrom" in filters && filters.dateFrom instanceof Date) {
        d.$gte = filters.dateFrom;
      }
      if ("dateTo" in filters && filters.dateTo instanceof Date) {
        d.$lte = filters.dateTo;
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
