"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminUserRepositoryImpl = void 0;
const inversify_1 = require("inversify");
const UserModel_1 = require("../models/UserModel");
const UserDomainMapper_1 = require("../mappers/UserDomainMapper");
let AdminUserRepositoryImpl = class AdminUserRepositoryImpl {
    async findById(id) {
        const doc = await UserModel_1.UserModel.findById(id);
        return doc ? UserDomainMapper_1.UserDomainMapper.toDomain(doc) : null;
    }
    async exists(id) {
        return (await UserModel_1.UserModel.countDocuments({ _id: id })) > 0;
    }
    async findByIds(ids) {
        const docs = await UserModel_1.UserModel.find({ _id: { $in: ids } });
        return docs.map(UserDomainMapper_1.UserDomainMapper.toDomain);
    }
    async findAll(options) {
        const query = UserModel_1.UserModel.find();
        if (options?.limit)
            query.limit(options.limit);
        if (options?.offset)
            query.skip(options.offset);
        const docs = await query.exec();
        return docs.map(UserDomainMapper_1.UserDomainMapper.toDomain);
    }
    async count(filters) {
        const mongoFilter = this.buildFilterQuery(filters ?? {});
        return UserModel_1.UserModel.countDocuments(mongoFilter);
    }
    async existsByFilter(filters) {
        const mongoFilter = this.buildFilterQuery(filters);
        return (await UserModel_1.UserModel.countDocuments(mongoFilter)) > 0;
    }
    async findPaginated(options) {
        const { page = 1, limit = 10, filters = {}, sortBy = "createdAt", sortOrder = "desc", } = options;
        const mongoFilter = this.buildFilterQuery(filters);
        const sortValue = {
            [sortBy]: sortOrder === "asc" ? 1 : -1,
        };
        const total = await UserModel_1.UserModel.countDocuments(mongoFilter);
        const totalPages = Math.ceil(total / limit);
        const skip = (page - 1) * limit;
        const docs = await UserModel_1.UserModel.find(mongoFilter)
            .sort(sortValue)
            .skip(skip)
            .limit(limit)
            .exec();
        const data = docs.map(UserDomainMapper_1.UserDomainMapper.toDomain);
        return { data, total, page, limit, totalPages };
    }
    async findUsersWithSummary(filters, pagination, sortBy, sortOrder) {
        const mongoFilter = this.buildFilterQuery(filters);
        const totalItems = await UserModel_1.UserModel.countDocuments(mongoFilter);
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
        const results = await UserModel_1.UserModel.aggregate(pipeline);
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
    async updateUserStatus(userId, status, reason) {
        const update = {
            status,
            updatedAt: new Date(),
        };
        if (reason)
            update.statusReason = reason;
        const res = await UserModel_1.UserModel.updateOne({ _id: userId }, update);
        return res.modifiedCount > 0;
    }
    async getUserStats(userId) {
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
        const [r] = await UserModel_1.UserModel.aggregate(pipeline);
        return {
            totalBookings: r?.totalBookings ?? 0,
            totalSpent: r?.totalSpent ?? 0,
            lastBooked: r?.lastBooked,
        };
    }
    buildFilterQuery(filters) {
        const q = {};
        if ("status" in filters && typeof filters.status === "string") {
            q.status = filters.status;
        }
        if ("search" in filters &&
            typeof filters.search === "string" &&
            filters.search.trim() !== "") {
            const s = filters.search.trim();
            q.$or = [
                { name: { $regex: s, $options: "i" } },
                { email: { $regex: s, $options: "i" } },
                { mobile: { $regex: s, $options: "i" } },
            ];
        }
        if ("dateFrom" in filters || "dateTo" in filters) {
            const d = {};
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
    buildSortQuery(sortBy, sortOrder) {
        const order = sortOrder === "asc" ? 1 : -1;
        const field = sortBy ?? "createdAt";
        return { [field]: order };
    }
};
exports.AdminUserRepositoryImpl = AdminUserRepositoryImpl;
exports.AdminUserRepositoryImpl = AdminUserRepositoryImpl = __decorate([
    (0, inversify_1.injectable)()
], AdminUserRepositoryImpl);
//# sourceMappingURL=AdminUserRepositoryImpl.js.map