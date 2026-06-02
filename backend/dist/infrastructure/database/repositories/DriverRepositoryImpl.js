"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverRepositoryImpl = void 0;
const inversify_1 = require("inversify");
const DriverModel_1 = require("../models/DriverModel");
const DriverMapper_1 = require("../mappers/DriverMapper");
const DriverStatus_1 = require("@domain/value-objects/DriverStatus");
const Logger_1 = require("@shared/utils/Logger");
const mongoose_1 = require("mongoose");
let DriverRepositoryImpl = class DriverRepositoryImpl {
    //  Basic Repository Operations
    async findById(id) {
        try {
            const driverDoc = await DriverModel_1.DriverModel.findById(id);
            return driverDoc ? DriverMapper_1.DriverMapper.toDomain(driverDoc) : null;
        }
        catch (error) {
            Logger_1.Logger.error("Error finding driver by id", { id, error });
            throw error;
        }
    }
    async exists(id) {
        try {
            const count = await DriverModel_1.DriverModel.countDocuments({ _id: id });
            return count > 0;
        }
        catch (error) {
            Logger_1.Logger.error("Error checking driver existence", { id, error });
            throw error;
        }
    }
    async save(driver) {
        try {
            const driverData = DriverMapper_1.DriverMapper.toPersistence(driver);
            const driverId = driver.getId();
            const existingDriver = await DriverModel_1.DriverModel.findById(driverId);
            let savedDoc;
            if (existingDriver) {
                savedDoc = (await DriverModel_1.DriverModel.findByIdAndUpdate(driverId, driverData, {
                    new: true,
                }));
            }
            else {
                savedDoc = await DriverModel_1.DriverModel.create({
                    _id: driverId,
                    ...driverData,
                });
            }
            return DriverMapper_1.DriverMapper.toDomain(savedDoc);
        }
        catch (error) {
            Logger_1.Logger.error("Error saving driver", { driverId: driver.getId(), error });
            throw error;
        }
    }
    async delete(id) {
        try {
            await DriverModel_1.DriverModel.findByIdAndDelete(id);
            Logger_1.Logger.info("Driver deleted successfully", { id });
        }
        catch (error) {
            Logger_1.Logger.error("Error deleting driver", { id, error });
            throw error;
        }
    }
    //  Query Operations
    async findAll(options) {
        try {
            const query = DriverModel_1.DriverModel.find();
            if (options?.limit)
                query.limit(options.limit);
            if (options?.offset)
                query.skip(options.offset);
            if (options?.sortBy) {
                const sortOrder = options.sortOrder === "desc" ? -1 : 1;
                query.sort({ [options.sortBy]: sortOrder });
            }
            const drivers = await query.exec();
            return drivers.map(DriverMapper_1.DriverMapper.toDomain);
        }
        catch (error) {
            Logger_1.Logger.error("Error finding all drivers", { error });
            throw error;
        }
    }
    async count(filters) {
        try {
            const mongoFilter = this.buildFilterQuery(filters ?? {});
            return await DriverModel_1.DriverModel.countDocuments(mongoFilter);
        }
        catch (error) {
            Logger_1.Logger.error("Error counting drivers", { error });
            throw error;
        }
    }
    async existsByFilter(filters) {
        const mongoFilter = this.buildFilterQuery(filters);
        return (await DriverModel_1.DriverModel.countDocuments(mongoFilter)) > 0;
    }
    async findByIds(ids) {
        const docs = await DriverModel_1.DriverModel.find({ _id: { $in: ids } });
        return docs.map(DriverMapper_1.DriverMapper.toDomain);
    }
    async findPaginated(options) {
        const { page = 1, limit = 10, filters = {}, sortBy = "createdAt", sortOrder = "desc", } = options;
        const mongoFilter = this.buildFilterQuery(filters);
        const sortValue = {
            [sortBy]: sortOrder === "asc" ? 1 : -1,
        };
        const total = await DriverModel_1.DriverModel.countDocuments(mongoFilter);
        const totalPages = Math.ceil(total / limit);
        const skip = (page - 1) * limit;
        const docs = await DriverModel_1.DriverModel.find(mongoFilter)
            .sort(sortValue)
            .skip(skip)
            .limit(limit)
            .exec();
        const data = docs.map(DriverMapper_1.DriverMapper.toDomain);
        return { data, total, page, limit, totalPages };
    }
    //  Batch Operations
    async updateMany(filters, updates) {
        function hasGetEligibleGearTypes(u) {
            return (typeof u === "object" &&
                u !== null &&
                typeof u.getEligibleGearTypes ===
                    "function");
        }
        function hasGetEligibleBodyTypes(u) {
            return (typeof u === "object" &&
                u !== null &&
                typeof u.getEligibleBodyTypes ===
                    "function");
        }
        function hasGetLicenceCategory(u) {
            return (typeof u === "object" &&
                u !== null &&
                typeof u.getLicenceCategory === "function");
        }
        function hasGetLicenseIssueDate(u) {
            return (typeof u === "object" &&
                u !== null &&
                typeof u.getLicenseIssueDate === "function");
        }
        function hasGetLicenseExpiryDate(u) {
            return (typeof u === "object" &&
                u !== null &&
                typeof u.getLicenseExpiryDate ===
                    "function");
        }
        function hasGetKycStatus(u) {
            return (typeof u === "object" &&
                u !== null &&
                typeof u.getKycStatus === "function");
        }
        function hasGetStatus(u) {
            return (typeof u === "object" &&
                u !== null &&
                typeof u.getStatus === "function");
        }
        try {
            const updateData = {};
            const u = updates;
            if (hasGetEligibleGearTypes(u)) {
                updateData.eligibleGearTypes = u.getEligibleGearTypes();
            }
            if (hasGetEligibleBodyTypes(u)) {
                updateData.eligibleBodyTypes = u.getEligibleBodyTypes();
            }
            if (hasGetLicenceCategory(u)) {
                updateData.licenceCategory = u.getLicenceCategory();
            }
            if (hasGetLicenseIssueDate(u)) {
                updateData.licenseIssueDate = u.getLicenseIssueDate();
            }
            if (hasGetLicenseExpiryDate(u)) {
                updateData.licenseExpiryDate = u.getLicenseExpiryDate();
            }
            if (hasGetKycStatus(u)) {
                updateData.kycStatus = u.getKycStatus();
            }
            if (hasGetStatus(u)) {
                updateData.status = u.getStatus();
            }
            updateData.updatedAt = new Date();
            const result = await DriverModel_1.DriverModel.updateMany(filters, {
                $set: updateData,
            });
            Logger_1.Logger.info("Multiple drivers updated", {
                matchedCount: result.matchedCount,
                modifiedCount: result.modifiedCount,
            });
            return result.modifiedCount || 0;
        }
        catch (error) {
            Logger_1.Logger.error("Error updating multiple drivers", {
                filters,
                updates,
                error,
            });
            throw error;
        }
    }
    async deleteMany(filters) {
        try {
            const result = await DriverModel_1.DriverModel.deleteMany(filters);
            Logger_1.Logger.info("Multiple drivers deleted", { count: result.deletedCount });
            return result.deletedCount ?? 0;
        }
        catch (error) {
            Logger_1.Logger.error("Error deleting multiple drivers", { filters, error });
            throw error;
        }
    }
    //  Driver-Specific Operations
    async findByUserId(userId) {
        try {
            const driverDoc = await DriverModel_1.DriverModel.findOne({ userId });
            return driverDoc ? DriverMapper_1.DriverMapper.toDomain(driverDoc) : null;
        }
        catch (error) {
            Logger_1.Logger.error("Error finding driver by userId", { userId, error });
            throw error;
        }
    }
    async existsByUserId(userId) {
        try {
            const count = await DriverModel_1.DriverModel.countDocuments({ userId });
            return count > 0;
        }
        catch (error) {
            Logger_1.Logger.error("Error checking driver existence by userId", {
                userId,
                error,
            });
            throw error;
        }
    }
    async findByStatus(status, options) {
        try {
            const query = DriverModel_1.DriverModel.find({ status });
            if (options?.limit)
                query.limit(options.limit);
            if (options?.offset)
                query.skip(options.offset);
            if (options?.sortBy) {
                const sortOrder = options.sortOrder === "desc" ? -1 : 1;
                query.sort({ [options.sortBy]: sortOrder });
            }
            const drivers = await query.exec();
            return drivers.map(DriverMapper_1.DriverMapper.toDomain);
        }
        catch (error) {
            Logger_1.Logger.error("Error finding drivers by status", { status, error });
            throw error;
        }
    }
    async findByKycStatus(kycStatus, options) {
        try {
            const query = DriverModel_1.DriverModel.find({ kycStatus });
            if (options?.limit)
                query.limit(options.limit);
            if (options?.offset)
                query.skip(options.offset);
            if (options?.sortBy) {
                const sortOrder = options.sortOrder === "desc" ? -1 : 1;
                query.sort({ [options.sortBy]: sortOrder });
            }
            const drivers = await query.exec();
            return drivers.map(DriverMapper_1.DriverMapper.toDomain);
        }
        catch (error) {
            Logger_1.Logger.error("Error finding drivers by KYC status", { kycStatus, error });
            throw error;
        }
    }
    async findByLicenseCategory(category, options) {
        try {
            const query = DriverModel_1.DriverModel.find({ licenceCategory: category });
            if (options?.limit)
                query.limit(options.limit);
            if (options?.offset)
                query.skip(options.offset);
            if (options?.sortBy) {
                const sortOrder = options.sortOrder === "desc" ? -1 : 1;
                query.sort({ [options.sortBy]: sortOrder });
            }
            const drivers = await query.exec();
            return drivers.map(DriverMapper_1.DriverMapper.toDomain);
        }
        catch (error) {
            Logger_1.Logger.error("Error finding drivers by license category", {
                category,
                error,
            });
            throw error;
        }
    }
    async findActiveDrivers(options) {
        return this.findByStatus(DriverStatus_1.DriverStatus.ACTIVE, options);
    }
    async countByStatus(status) {
        try {
            return await DriverModel_1.DriverModel.countDocuments({ status });
        }
        catch (error) {
            Logger_1.Logger.error("Error counting drivers by status", { status, error });
            throw error;
        }
    }
    async countByKycStatus(kycStatus) {
        try {
            return await DriverModel_1.DriverModel.countDocuments({ kycStatus });
        }
        catch (error) {
            Logger_1.Logger.error("Error counting drivers by KYC status", {
                kycStatus,
                error,
            });
            throw error;
        }
    }
    // Admin-Specific Operations
    async findDriversWithSummary(filters, pagination, sortBy, sortOrder) {
        const mongoFilter = this.buildFilterQuery(filters);
        const totalItems = await DriverModel_1.DriverModel.countDocuments(mongoFilter);
        const totalPages = Math.ceil(totalItems / pagination.pageSize);
        const skip = (pagination.page - 1) * pagination.pageSize;
        const pipeline = [
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
        const results = await DriverModel_1.DriverModel.aggregate(pipeline);
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
    async updateDriverStatus(driverId, status, reason) {
        const update = {
            status,
            updatedAt: new Date(),
        };
        if (reason)
            update.statusReason = reason;
        const res = await DriverModel_1.DriverModel.updateOne({ _id: driverId }, update);
        return res.modifiedCount > 0;
    }
    async getDriverStats(driverId) {
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
        const [r] = await DriverModel_1.DriverModel.aggregate(pipeline);
        return {
            totalRides: r?.totalRides ?? 0,
            totalEarnings: r?.totalEarnings ?? 0,
            rating: r?.rating ?? 0,
            lastRideDate: r?.lastRideDate,
        };
    }
    async findDriverProfile(driverId) {
        const objectId = new mongoose_1.Types.ObjectId(driverId);
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
        const [result] = await DriverModel_1.DriverModel.aggregate(pipeline);
        if (!result)
            return null;
        const driver = DriverMapper_1.DriverMapper.toDomain(result);
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
    async countNewDrivers(filter) {
        return DriverModel_1.DriverModel.countDocuments({
            createdAt: {
                $gte: filter.fromDate,
                $lte: filter.toDate,
            },
        });
    }
    //  Private Helper Methods
    buildFilterQuery(filters) {
        const q = {};
        if (typeof filters.status === "string") {
            q.status = filters.status;
        }
        if (typeof filters.kycStatus === "string") {
            q.kycStatus = filters.kycStatus;
        }
        if (typeof filters.licenceCategory === "string") {
            q.licenceCategory =
                filters.licenceCategory;
        }
        if (typeof filters.search === "string" && filters.search.trim() !== "") {
            const s = filters.search.trim();
            q.userId = {
                $regex: s,
                $options: "i",
            };
        }
        if ("dateFrom" in filters || "dateTo" in filters) {
            const d = {};
            if (filters.dateFrom instanceof Date) {
                d.$gte = filters.dateFrom;
            }
            if (filters.dateTo instanceof Date) {
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
exports.DriverRepositoryImpl = DriverRepositoryImpl;
exports.DriverRepositoryImpl = DriverRepositoryImpl = __decorate([
    (0, inversify_1.injectable)()
], DriverRepositoryImpl);
//# sourceMappingURL=DriverRepositoryImpl.js.map