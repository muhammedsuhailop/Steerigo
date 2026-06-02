"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RideRequestRepositoryImpl = void 0;
const inversify_1 = require("inversify");
const RideRequestStatus_1 = require("@domain/value-objects/RideRequestStatus");
const RideRequestModel_1 = require("../models/RideRequestModel");
const RideRequestMapper_1 = require("../mappers/RideRequestMapper");
const Logger_1 = require("@shared/utils/Logger");
const mongoose_1 = require("mongoose");
let RideRequestRepositoryImpl = class RideRequestRepositoryImpl {
    // Basic Repository Operations
    async findById(id) {
        try {
            const doc = await RideRequestModel_1.RideRequestModel.findById(id);
            return doc ? RideRequestMapper_1.RideRequestMapper.toDomain(doc) : null;
        }
        catch (error) {
            Logger_1.Logger.error("Error finding ride request by id", { id, error });
            throw error;
        }
    }
    async exists(id) {
        try {
            const count = await RideRequestModel_1.RideRequestModel.countDocuments({ _id: id });
            return count > 0;
        }
        catch (error) {
            Logger_1.Logger.error("Error checking ride request existence", { id, error });
            throw error;
        }
    }
    async save(request) {
        try {
            const requestData = RideRequestMapper_1.RideRequestMapper.toPersistence(request);
            const now = new Date();
            const defaultExpiresAt = new Date(Date.now() + 1.5 * 60 * 1000);
            let doc;
            if (!requestData._id) {
                doc = await RideRequestModel_1.RideRequestModel.create({
                    ...requestData,
                    createdAt: now,
                    expiresAt: defaultExpiresAt,
                });
            }
            else {
                doc = await RideRequestModel_1.RideRequestModel.findOneAndUpdate({ _id: requestData._id }, {
                    $set: requestData,
                }, {
                    new: true,
                });
            }
            if (!doc) {
                throw new Error("Failed to save ride request: document not found");
            }
            Logger_1.Logger.info("Ride request saved successfully", {
                id: doc._id.toString(),
                requestGroupId: doc.requestGroupId.toString(),
                driverId: request.getDriverId(),
            });
            return RideRequestMapper_1.RideRequestMapper.toDomain(doc);
        }
        catch (error) {
            Logger_1.Logger.error("Error saving ride request", {
                error,
            });
            throw error;
        }
    }
    async delete(id) {
        try {
            await RideRequestModel_1.RideRequestModel.findByIdAndDelete(id);
            Logger_1.Logger.info("Ride request deleted successfully", { id });
        }
        catch (error) {
            Logger_1.Logger.error("Error deleting ride request", { id, error });
            throw error;
        }
    }
    // Query Operations
    async findAll(options) {
        try {
            const query = RideRequestModel_1.RideRequestModel.find();
            if (options?.limit)
                query.limit(options.limit);
            if (options?.offset)
                query.skip(options.offset);
            if (options?.sortBy) {
                const sortOrder = options.sortOrder === "desc" ? -1 : 1;
                query.sort({ [options.sortBy]: sortOrder });
            }
            const docs = await query.exec();
            return docs.map(RideRequestMapper_1.RideRequestMapper.toDomain);
        }
        catch (error) {
            Logger_1.Logger.error("Error finding all ride requests", { error });
            throw error;
        }
    }
    async count(filters) {
        try {
            const mongoFilter = this.buildFilterQuery(filters || {});
            return await RideRequestModel_1.RideRequestModel.countDocuments(mongoFilter);
        }
        catch (error) {
            Logger_1.Logger.error("Error counting ride requests", { error });
            throw error;
        }
    }
    async findPaginated(options) {
        const { page = 1, limit = 10, filters = {}, sortBy = "createdAt", sortOrder = "desc", } = options;
        const mongoFilter = this.buildFilterQuery(filters);
        const sortValue = {
            [sortBy]: sortOrder === "asc" ? 1 : -1,
        };
        const total = await RideRequestModel_1.RideRequestModel.countDocuments(mongoFilter);
        const totalPages = Math.ceil(total / limit);
        const skip = (page - 1) * limit;
        const docs = await RideRequestModel_1.RideRequestModel.find(mongoFilter)
            .sort(sortValue)
            .skip(skip)
            .limit(limit)
            .exec();
        const data = docs.map(RideRequestMapper_1.RideRequestMapper.toDomain);
        return { data, total, page, limit, totalPages };
    }
    // Driver-specific queries
    async findByDriverId(driverId, options) {
        try {
            const query = RideRequestModel_1.RideRequestModel.find({
                driverId: new mongoose_1.Types.ObjectId(driverId),
            }).sort({ createdAt: -1 });
            if (options?.limit)
                query.limit(options.limit);
            if (options?.offset)
                query.skip(options.offset);
            const docs = await query.exec();
            return docs.map(RideRequestMapper_1.RideRequestMapper.toDomain);
        }
        catch (error) {
            Logger_1.Logger.error("Error finding ride requests by driver ID", {
                driverId,
                error,
            });
            throw error;
        }
    }
    async findPendingByDriverId(driverId) {
        try {
            const docs = await RideRequestModel_1.RideRequestModel.find({
                driverId: new mongoose_1.Types.ObjectId(driverId),
                status: RideRequestStatus_1.RideRequestStatus.PENDING,
            }).sort({ createdAt: -1 });
            return docs.map(RideRequestMapper_1.RideRequestMapper.toDomain);
        }
        catch (error) {
            Logger_1.Logger.error("Error finding pending requests by driver ID", {
                driverId,
                error,
            });
            throw error;
        }
    }
    async countPendingByDriverId(driverId) {
        try {
            return await RideRequestModel_1.RideRequestModel.countDocuments({
                driverId: new mongoose_1.Types.ObjectId(driverId),
                status: RideRequestStatus_1.RideRequestStatus.PENDING,
            });
        }
        catch (error) {
            Logger_1.Logger.error("Error counting pending requests by driver ID", {
                driverId,
                error,
            });
            throw error;
        }
    }
    // Rider-specific queries
    async findByRiderId(riderId, options) {
        try {
            const query = RideRequestModel_1.RideRequestModel.find({
                riderId: new mongoose_1.Types.ObjectId(riderId),
            }).sort({ createdAt: -1 });
            if (options?.limit)
                query.limit(options.limit);
            if (options?.offset)
                query.skip(options.offset);
            const docs = await query.exec();
            return docs.map(RideRequestMapper_1.RideRequestMapper.toDomain);
        }
        catch (error) {
            Logger_1.Logger.error("Error finding ride requests by rider ID", {
                riderId,
                error,
            });
            throw error;
        }
    }
    async findPendingByRiderId(riderId) {
        try {
            const docs = await RideRequestModel_1.RideRequestModel.find({
                riderId: new mongoose_1.Types.ObjectId(riderId),
                status: RideRequestStatus_1.RideRequestStatus.PENDING,
            }).sort({ createdAt: -1 });
            return docs.map(RideRequestMapper_1.RideRequestMapper.toDomain);
        }
        catch (error) {
            Logger_1.Logger.error("Error finding pending requests by rider ID", {
                riderId,
                error,
            });
            throw error;
        }
    }
    // Status-based queries
    async findByStatus(status, options) {
        try {
            const query = RideRequestModel_1.RideRequestModel.find({ status });
            if (options?.limit)
                query.limit(options.limit);
            if (options?.offset)
                query.skip(options.offset);
            if (options?.sortBy) {
                const sortOrder = options.sortOrder === "desc" ? -1 : 1;
                query.sort({ [options.sortBy]: sortOrder });
            }
            const docs = await query.exec();
            return docs.map(RideRequestMapper_1.RideRequestMapper.toDomain);
        }
        catch (error) {
            Logger_1.Logger.error("Error finding ride requests by status", { status, error });
            throw error;
        }
    }
    async findExpiredRequests() {
        try {
            const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
            const docs = await RideRequestModel_1.RideRequestModel.find({
                status: RideRequestStatus_1.RideRequestStatus.PENDING,
                createdAt: { $lt: thirtyMinutesAgo },
            });
            return docs.map(RideRequestMapper_1.RideRequestMapper.toDomain);
        }
        catch (error) {
            Logger_1.Logger.error("Error finding expired requests", { error });
            throw error;
        }
    }
    // Specialized operations
    async findByRequestId(requestId) {
        try {
            const doc = await RideRequestModel_1.RideRequestModel.findById(requestId);
            return doc ? RideRequestMapper_1.RideRequestMapper.toDomain(doc) : null;
        }
        catch (error) {
            Logger_1.Logger.error("Error finding ride request by requestId", {
                requestId,
                error,
            });
            throw error;
        }
    }
    async expirePendingRequests(olderThanMinutes) {
        try {
            const cutoffTime = new Date(Date.now() - olderThanMinutes * 60 * 1000);
            const result = await RideRequestModel_1.RideRequestModel.updateMany({
                status: RideRequestStatus_1.RideRequestStatus.PENDING,
                createdAt: { $lt: cutoffTime },
            }, {
                $set: {
                    status: RideRequestStatus_1.RideRequestStatus.EXPIRED,
                    updatedAt: new Date(),
                },
            });
            Logger_1.Logger.info("Expired pending ride requests", {
                modifiedCount: result.modifiedCount,
            });
            return result.modifiedCount || 0;
        }
        catch (error) {
            Logger_1.Logger.error("Error expiring pending requests", { error });
            throw error;
        }
    }
    async deleteExpiredRequests() {
        try {
            const result = await RideRequestModel_1.RideRequestModel.deleteMany({
                status: RideRequestStatus_1.RideRequestStatus.EXPIRED,
            });
            Logger_1.Logger.info("Deleted expired ride requests", {
                deletedCount: result.deletedCount,
            });
            return result.deletedCount || 0;
        }
        catch (error) {
            Logger_1.Logger.error("Error deleting expired requests", { error });
            throw error;
        }
    }
    // Bulk operations
    async saveMany(requests) {
        try {
            const now = new Date();
            const defaultExpiresAt = new Date(Date.now() + 1.5 * 60 * 1000);
            const docsToInsert = requests.map((request) => {
                const data = RideRequestMapper_1.RideRequestMapper.toPersistence(request);
                return {
                    ...data,
                    createdAt: now,
                    expiresAt: defaultExpiresAt,
                };
            });
            const docs = (await RideRequestModel_1.RideRequestModel.insertMany(docsToInsert));
            Logger_1.Logger.info("Bulk saved ride requests", {
                count: docs.length,
            });
            return docs.map((doc) => RideRequestMapper_1.RideRequestMapper.toDomain(doc));
        }
        catch (error) {
            Logger_1.Logger.error("Error bulk saving ride requests", { error });
            throw error;
        }
    }
    async updateMany(filters, updates) {
        try {
            const mongoFilter = this.buildFilterQuery(filters);
            const updateData = {};
            const u = updates;
            if (typeof u === "object" &&
                u !== null &&
                typeof u.getStatus ===
                    "function") {
                updateData.status = u.getStatus();
            }
            updateData.updatedAt = new Date();
            const result = await RideRequestModel_1.RideRequestModel.updateMany(mongoFilter, {
                $set: updateData,
            });
            Logger_1.Logger.info("Multiple ride requests updated", {
                matchedCount: result.matchedCount,
                modifiedCount: result.modifiedCount,
            });
            return result.modifiedCount || 0;
        }
        catch (error) {
            Logger_1.Logger.error("Error updating multiple ride requests", { filters, error });
            throw error;
        }
    }
    async deleteMany(filters) {
        try {
            const mongoFilter = this.buildFilterQuery(filters);
            const result = await RideRequestModel_1.RideRequestModel.deleteMany(mongoFilter);
            Logger_1.Logger.info("Multiple ride requests deleted", {
                count: result.deletedCount,
            });
            return result.deletedCount ?? 0;
        }
        catch (error) {
            Logger_1.Logger.error("Error deleting multiple ride requests", { filters, error });
            throw error;
        }
    }
    // Base repository interface methods
    async existsByFilter(filters) {
        const mongoFilter = this.buildFilterQuery(filters);
        return (await RideRequestModel_1.RideRequestModel.countDocuments(mongoFilter)) > 0;
    }
    async findByIds(ids) {
        const docs = await RideRequestModel_1.RideRequestModel.find({ _id: { $in: ids } });
        return docs.map(RideRequestMapper_1.RideRequestMapper.toDomain);
    }
    async findByGroupAndDriver(requestGroupId, driverId) {
        try {
            const doc = await RideRequestModel_1.RideRequestModel.findOne({
                requestGroupId: requestGroupId,
                driverId: new mongoose_1.Types.ObjectId(driverId),
            });
            return doc ? RideRequestMapper_1.RideRequestMapper.toDomain(doc) : null;
        }
        catch (error) {
            Logger_1.Logger.error("Error finding ride request by group and driver", {
                requestGroupId,
                driverId,
                error,
            });
            throw error;
        }
    }
    async atomicAcceptRideRequest(requestId) {
        try {
            const doc = await RideRequestModel_1.RideRequestModel.findOneAndUpdate({
                _id: new mongoose_1.Types.ObjectId(requestId),
                status: RideRequestStatus_1.RideRequestStatus.PENDING, // only if still pending
            }, {
                $set: {
                    status: RideRequestStatus_1.RideRequestStatus.ACCEPTED,
                    updatedAt: new Date(),
                },
            }, {
                new: true,
            });
            if (!doc) {
                Logger_1.Logger.warn("Atomic accept failed - request not pending", {
                    requestId,
                });
                return null;
            }
            Logger_1.Logger.info("Ride request accepted atomically", {
                requestId,
            });
            return RideRequestMapper_1.RideRequestMapper.toDomain(doc);
        }
        catch (error) {
            Logger_1.Logger.error("Error in atomicAcceptRideRequest", { requestId, error });
            throw error;
        }
    }
    async cancelOtherPendingRequestsInGroup(requestGroupId, acceptedRequestId) {
        try {
            const result = await RideRequestModel_1.RideRequestModel.updateMany({
                requestGroupId,
                _id: { $ne: new mongoose_1.Types.ObjectId(acceptedRequestId) },
                status: RideRequestStatus_1.RideRequestStatus.PENDING,
            }, {
                $set: {
                    status: RideRequestStatus_1.RideRequestStatus.CANCELLED,
                    updatedAt: new Date(),
                },
            });
            Logger_1.Logger.info("Cancelled other pending requests in group", {
                requestGroupId,
                acceptedRequestId,
                cancelledCount: result.modifiedCount,
            });
            return result.modifiedCount || 0;
        }
        catch (error) {
            Logger_1.Logger.error("Error cancelling other pending requests", {
                requestGroupId,
                acceptedRequestId,
                error,
            });
            throw error;
        }
    }
    async existsAcceptedRequestInGroup(requestGroupId) {
        try {
            const count = await RideRequestModel_1.RideRequestModel.countDocuments({
                requestGroupId,
                status: RideRequestStatus_1.RideRequestStatus.ACCEPTED,
            });
            return count > 0;
        }
        catch (error) {
            Logger_1.Logger.error("Error checking accepted request in group", {
                requestGroupId,
                error,
            });
            throw error;
        }
    }
    async cancelPendingByGroupAndRider(requestGroupId, riderId) {
        try {
            const result = await RideRequestModel_1.RideRequestModel.updateMany({
                requestGroupId,
                riderId: new mongoose_1.Types.ObjectId(riderId),
                status: RideRequestStatus_1.RideRequestStatus.PENDING,
            }, {
                $set: {
                    status: RideRequestStatus_1.RideRequestStatus.CANCELLED,
                    updatedAt: new Date(),
                },
            });
            Logger_1.Logger.info("Cancelled pending ride requests by group and rider", {
                requestGroupId,
                riderId,
                cancelledCount: result.modifiedCount,
            });
            return result.modifiedCount || 0;
        }
        catch (error) {
            Logger_1.Logger.error("Error cancelling pending requests by group and rider", {
                requestGroupId,
                riderId,
                error,
            });
            throw error;
        }
    }
    async findLatestPendingByGroupId(requestGroupId) {
        try {
            const doc = await RideRequestModel_1.RideRequestModel.findOne({
                requestGroupId,
                status: RideRequestStatus_1.RideRequestStatus.PENDING,
            })
                .sort({ createdAt: -1 })
                .exec();
            return doc ? RideRequestMapper_1.RideRequestMapper.toDomain(doc) : null;
        }
        catch (error) {
            Logger_1.Logger.error("Error finding latest pending request by group", {
                requestGroupId,
                error,
            });
            throw error;
        }
    }
    async atomicExpireRideRequest(requestId) {
        try {
            const doc = await RideRequestModel_1.RideRequestModel.findOneAndUpdate({
                _id: new mongoose_1.Types.ObjectId(requestId),
                status: RideRequestStatus_1.RideRequestStatus.PENDING,
            }, {
                $set: {
                    status: RideRequestStatus_1.RideRequestStatus.EXPIRED,
                    updatedAt: new Date(),
                },
            }, { new: true }).exec();
            return doc ? RideRequestMapper_1.RideRequestMapper.toDomain(doc) : null;
        }
        catch (error) {
            Logger_1.Logger.error("Error atomically expiring ride request", {
                requestId,
                error,
            });
            throw error;
        }
    }
    // Helper methods
    buildFilterQuery(filters) {
        const query = {};
        if (filters.status) {
            query.status = filters.status;
        }
        if (filters.driverId) {
            query.driverId = new mongoose_1.Types.ObjectId(filters.driverId);
        }
        if (filters.riderId) {
            query.riderId = new mongoose_1.Types.ObjectId(filters.riderId);
        }
        if (filters.pickupTimeFrom || filters.pickupTimeTo) {
            const timeFilter = {};
            if (filters.pickupTimeFrom) {
                timeFilter.$gte = filters.pickupTimeFrom;
            }
            if (filters.pickupTimeTo) {
                timeFilter.$lte = filters.pickupTimeTo;
            }
            query.pickupTime = timeFilter;
        }
        if (filters.createdAfter || filters.createdBefore) {
            const createdFilter = {};
            if (filters.createdAfter) {
                createdFilter.$gte = filters.createdAfter;
            }
            if (filters.createdBefore) {
                createdFilter.$lte = filters.createdBefore;
            }
            query.createdAt = createdFilter;
        }
        return query;
    }
};
exports.RideRequestRepositoryImpl = RideRequestRepositoryImpl;
exports.RideRequestRepositoryImpl = RideRequestRepositoryImpl = __decorate([
    (0, inversify_1.injectable)()
], RideRequestRepositoryImpl);
//# sourceMappingURL=RideRequestRepositoryImpl.js.map