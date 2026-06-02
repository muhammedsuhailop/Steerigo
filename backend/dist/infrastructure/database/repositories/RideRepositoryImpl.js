"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RideRepositoryImpl = void 0;
const inversify_1 = require("inversify");
const RideStatus_1 = require("@domain/value-objects/RideStatus");
const RideModel_1 = require("../models/RideModel");
const RideMapper_1 = require("../mappers/RideMapper");
const Logger_1 = require("@shared/utils/Logger");
const mongoose_1 = require("mongoose");
const RideErrors_1 = require("@domain/errors/RideErrors");
const idHelper_1 = require("@shared/utils/idHelper");
let RideRepositoryImpl = class RideRepositoryImpl {
    async findById(id) {
        try {
            const doc = await RideModel_1.RideModel.findById(id);
            return doc ? RideMapper_1.RideMapper.toDomain(doc) : null;
        }
        catch (error) {
            Logger_1.Logger.error("Error finding ride by id", { id, error });
            throw error;
        }
    }
    async exists(id) {
        try {
            const count = await RideModel_1.RideModel.countDocuments({ _id: id });
            return count > 0;
        }
        catch (error) {
            Logger_1.Logger.error("Error checking ride existence", { id, error });
            throw error;
        }
    }
    async save(ride) {
        try {
            const rideData = RideMapper_1.RideMapper.toPersistence(ride);
            const doc = await RideModel_1.RideModel.findOneAndUpdate({ rideId: rideData.rideId }, {
                ...rideData,
                updatedAt: new Date(),
            }, {
                new: true,
                runValidators: true,
                upsert: true,
            });
            if (!doc) {
                throw RideErrors_1.RideErrors.rideNotFound(ride.getRideId());
            }
            Logger_1.Logger.info("Ride updated successfully", {
                id: doc._id.toString(),
                rideId: doc.rideId,
                status: doc.status,
            });
            return RideMapper_1.RideMapper.toDomain(doc);
        }
        catch (error) {
            Logger_1.Logger.error("Error saving ride", {
                rideId: ride.getRideId(),
                error: error instanceof Error ? error.message : String(error),
            });
            throw error;
        }
    }
    async delete(id) {
        try {
            const result = await RideModel_1.RideModel.findByIdAndDelete(id);
            if (result) {
                Logger_1.Logger.info("Ride deleted successfully", {
                    id,
                    rideId: result.rideId,
                });
            }
            else {
                Logger_1.Logger.warn("Ride not found for deletion", { id });
            }
        }
        catch (error) {
            Logger_1.Logger.error("Error deleting ride", { id, error });
            throw error;
        }
    }
    async findByRideId(rideId) {
        try {
            const doc = await RideModel_1.RideModel.findOne({ rideId });
            return doc ? RideMapper_1.RideMapper.toDomain(doc) : null;
        }
        catch (error) {
            Logger_1.Logger.error("Error finding ride by rideId", { rideId, error });
            throw error;
        }
    }
    async findActiveRideByDriverId(driverId) {
        try {
            const doc = await RideModel_1.RideModel.findOne({
                driverId: new mongoose_1.Types.ObjectId(driverId),
                status: {
                    $in: [RideStatus_1.RideStatus.ACCEPTED, RideStatus_1.RideStatus.ARRIVED, RideStatus_1.RideStatus.STARTED],
                },
            }).sort({ createdAt: -1 });
            if (doc) {
                Logger_1.Logger.debug("Active ride found for driver", {
                    driverId,
                    rideId: doc.rideId,
                    status: doc.status,
                });
            }
            return doc ? RideMapper_1.RideMapper.toDomain(doc) : null;
        }
        catch (error) {
            Logger_1.Logger.error("Error finding active ride by driver ID", {
                driverId,
                error,
            });
            throw error;
        }
    }
    async findActiveRideByRiderId(riderId) {
        try {
            const doc = await RideModel_1.RideModel.findOne({
                riderId: new mongoose_1.Types.ObjectId(riderId),
                status: { $in: [RideStatus_1.RideStatus.ACCEPTED, RideStatus_1.RideStatus.STARTED] },
            }).sort({ createdAt: -1 });
            if (doc) {
                Logger_1.Logger.debug("Active ride found for rider", {
                    riderId,
                    rideId: doc.rideId,
                    status: doc.status,
                });
            }
            return doc ? RideMapper_1.RideMapper.toDomain(doc) : null;
        }
        catch (error) {
            Logger_1.Logger.error("Error finding active ride by rider ID", {
                riderId,
                error,
            });
            throw error;
        }
    }
    async findByDriverId(driverId, status) {
        try {
            const query = {
                driverId: new mongoose_1.Types.ObjectId(driverId),
            };
            if (status) {
                query.status = status;
            }
            const docs = await RideModel_1.RideModel.find(query).sort({ createdAt: -1 });
            Logger_1.Logger.debug("Rides found for driver", {
                driverId,
                status,
                count: docs.length,
            });
            return docs.map(RideMapper_1.RideMapper.toDomain);
        }
        catch (error) {
            Logger_1.Logger.error("Error finding rides by driver ID", {
                driverId,
                status,
                error,
            });
            throw error;
        }
    }
    async findByRiderId(riderId, status) {
        try {
            const query = {
                riderId: new mongoose_1.Types.ObjectId(riderId),
            };
            if (status) {
                query.status = status;
            }
            const docs = await RideModel_1.RideModel.find(query).sort({ createdAt: -1 });
            Logger_1.Logger.debug("Rides found for rider", {
                riderId,
                status,
                count: docs.length,
            });
            return docs.map(RideMapper_1.RideMapper.toDomain);
        }
        catch (error) {
            Logger_1.Logger.error("Error finding rides by rider ID", {
                riderId,
                status,
                error,
            });
            throw error;
        }
    }
    async findPaginatedByDriverId(driverId, options) {
        try {
            const { page, limit, sortBy, sortOrder, status, fromDate, toDate } = options;
            const query = {
                driverId: new mongoose_1.Types.ObjectId(driverId),
            };
            if (status) {
                query.status = status;
            }
            if (fromDate || toDate) {
                query.createdAt = {};
                if (fromDate) {
                    query.createdAt.$gte = fromDate;
                }
                if (toDate) {
                    query.createdAt.$lte = toDate;
                }
            }
            const sortValue = {
                [sortBy]: sortOrder === "asc" ? 1 : -1,
            };
            const total = await RideModel_1.RideModel.countDocuments(query);
            const totalPages = Math.ceil(total / limit);
            const skip = (page - 1) * limit;
            const docs = await RideModel_1.RideModel.find(query)
                .sort(sortValue)
                .skip(skip)
                .limit(limit)
                .exec();
            const data = docs.map(RideMapper_1.RideMapper.toDomain);
            Logger_1.Logger.debug("Paginated rides fetched for driver", {
                driverId,
                total,
                page,
                limit,
                status,
            });
            return {
                data,
                total,
                page,
                limit,
                totalPages,
            };
        }
        catch (error) {
            Logger_1.Logger.error("Error finding paginated rides by driver ID", {
                driverId,
                options,
                error,
            });
            throw error;
        }
    }
    async findPaginatedByRiderId(riderId, options) {
        try {
            const { page, limit, sortBy, sortOrder, status, fromDate, toDate } = options;
            const query = {
                riderId: new mongoose_1.Types.ObjectId(riderId),
            };
            if (status) {
                query.status = status;
            }
            if (fromDate ?? toDate) {
                query.createdAt = {};
                if (fromDate) {
                    query.createdAt.$gte = fromDate;
                }
                if (toDate) {
                    query.createdAt.$lte = toDate;
                }
            }
            const sortValue = {
                [sortBy]: sortOrder === "asc" ? 1 : -1,
            };
            const total = await RideModel_1.RideModel.countDocuments(query);
            const totalPages = Math.ceil(total / limit);
            const skip = (page - 1) * limit;
            const docs = await RideModel_1.RideModel.find(query)
                .sort(sortValue)
                .skip(skip)
                .limit(limit)
                .exec();
            const data = docs.map(RideMapper_1.RideMapper.toDomain);
            Logger_1.Logger.debug("Paginated rides fetched for rider", {
                riderId,
                total,
                page,
                limit,
                status,
            });
            return { data, total, page, limit, totalPages };
        }
        catch (error) {
            Logger_1.Logger.error("Error finding paginated rides by rider ID", {
                riderId,
                options,
                error,
            });
            throw error;
        }
    }
    async findPaginatedAll(options) {
        try {
            const { page, limit, sortBy, sortOrder, status, fromDate, toDate, riderId, driverId, } = options;
            const query = {};
            if (status) {
                query.status = status;
            }
            if (riderId) {
                query.riderId = new mongoose_1.Types.ObjectId(riderId);
            }
            if (driverId) {
                query.driverId = new mongoose_1.Types.ObjectId(driverId);
            }
            if (fromDate ?? toDate) {
                query.createdAt = {};
                if (fromDate) {
                    query.createdAt.$gte = fromDate;
                }
                if (toDate) {
                    query.createdAt.$lte = toDate;
                }
            }
            const sortValue = {
                [sortBy]: sortOrder === "asc" ? 1 : -1,
            };
            const total = await RideModel_1.RideModel.countDocuments(query);
            const totalPages = Math.ceil(total / limit);
            const skip = (page - 1) * limit;
            const docs = await RideModel_1.RideModel.find(query)
                .sort(sortValue)
                .skip(skip)
                .limit(limit)
                .exec();
            const data = docs.map(RideMapper_1.RideMapper.toDomain);
            Logger_1.Logger.debug("Admin paginated rides fetched", {
                total,
                page,
                limit,
                status,
                riderId,
                driverId,
            });
            return { data, total, page, limit, totalPages };
        }
        catch (error) {
            Logger_1.Logger.error("Error finding paginated rides for admin", {
                options,
                error,
            });
            throw error;
        }
    }
    async countRideStats(params) {
        const { driverId, riderId, filters } = params;
        const query = {};
        if (driverId) {
            query.driverId = (0, idHelper_1.toObjectId)(driverId);
        }
        if (riderId) {
            query.riderId = (0, idHelper_1.toObjectId)(riderId);
        }
        if (filters.fromDate ?? filters.toDate) {
            query.createdAt = {};
            if (filters.fromDate)
                query.createdAt.$gte = filters.fromDate;
            if (filters.toDate)
                query.createdAt.$lte = filters.toDate;
        }
        const result = await RideModel_1.RideModel.aggregate([
            { $match: query },
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                    completed: {
                        $sum: {
                            $cond: [{ $eq: ["$status", RideStatus_1.RideStatus.COMPLETED] }, 1, 0],
                        },
                    },
                    cancelled: {
                        $sum: {
                            $cond: [{ $eq: ["$status", RideStatus_1.RideStatus.CANCELLED] }, 1, 0],
                        },
                    },
                    totalAmount: {
                        $sum: {
                            $cond: [
                                { $eq: ["$status", RideStatus_1.RideStatus.COMPLETED] },
                                "$fareBreakdown.totalFare",
                                0,
                            ],
                        },
                    },
                },
            },
        ]);
        return {
            total: result[0]?.total ?? 0,
            completed: result[0]?.completed ?? 0,
            cancelled: result[0]?.cancelled ?? 0,
            totalAmount: result[0]?.totalAmount ?? 0,
        };
    }
    async countByDriverStats(driverId, filters) {
        const stats = await this.countRideStats({
            driverId,
            filters,
        });
        return {
            total: stats.total,
            completed: stats.completed,
            cancelled: stats.cancelled,
            totalEarnings: stats.totalAmount,
        };
    }
    async countByRiderStats(riderId, filters) {
        const stats = await this.countRideStats({
            riderId,
            filters,
        });
        return {
            total: stats.total,
            completed: stats.completed,
            cancelled: stats.cancelled,
            totalSpend: stats.totalAmount,
        };
    }
    async hasTimeSlotConflict(driverId, pickupTime, timeRequiredHours) {
        try {
            const BUFFER_HOURS = 1;
            const newRideStart = pickupTime;
            const newRideEnd = new Date(pickupTime.getTime() +
                (timeRequiredHours + BUFFER_HOURS) * 60 * 60 * 1000);
            const conflictingStatuses = [
                RideStatus_1.RideStatus.ARRIVED,
                RideStatus_1.RideStatus.ACCEPTED,
                RideStatus_1.RideStatus.STARTED,
            ];
            const result = await RideModel_1.RideModel.aggregate([
                {
                    $match: {
                        driverId: new mongoose_1.Types.ObjectId(driverId),
                        status: { $in: conflictingStatuses },
                    },
                },
                {
                    $addFields: {
                        existingEndMs: {
                            $add: [
                                { $toLong: "$requestedPickupTime" },
                                {
                                    $multiply: [
                                        { $add: ["$timeRequired", BUFFER_HOURS] },
                                        60 * 60 * 1000,
                                    ],
                                },
                            ],
                        },
                        newRideStartMs: newRideStart.getTime(),
                        newRideEndMs: newRideEnd.getTime(),
                    },
                },
                {
                    $match: {
                        $expr: {
                            $and: [
                                {
                                    $lt: [{ $toLong: "$requestedPickupTime" }, "$newRideEndMs"],
                                },
                                {
                                    $gt: ["$existingEndMs", "$newRideStartMs"],
                                },
                            ],
                        },
                    },
                },
                { $limit: 1 },
                { $count: "conflicts" },
            ]);
            const hasConflict = (result[0]?.conflicts ?? 0) > 0;
            Logger_1.Logger.debug("Time slot conflict check", {
                driverId,
                pickupTime,
                timeRequiredHours,
                newRideEnd,
                hasConflict,
            });
            return hasConflict;
        }
        catch (error) {
            Logger_1.Logger.error("Error checking time slot conflict", {
                driverId,
                pickupTime,
                error,
            });
            throw error;
        }
    }
    async findLatestByRiderId(riderId) {
        try {
            const doc = await RideModel_1.RideModel.findOne({
                riderId: new mongoose_1.Types.ObjectId(riderId),
            }).sort({ createdAt: -1 });
            if (doc) {
                Logger_1.Logger.debug("Latest ride entry found for rider context tracking", {
                    riderId,
                    rideId: doc.rideId,
                    createdAt: doc.createdAt,
                });
            }
            return doc ? RideMapper_1.RideMapper.toDomain(doc) : null;
        }
        catch (error) {
            Logger_1.Logger.error("Error finding latest ride profile by rider ID", {
                riderId,
                error: error instanceof Error ? error.message : String(error),
            });
            throw error;
        }
    }
};
exports.RideRepositoryImpl = RideRepositoryImpl;
exports.RideRepositoryImpl = RideRepositoryImpl = __decorate([
    (0, inversify_1.injectable)()
], RideRepositoryImpl);
//# sourceMappingURL=RideRepositoryImpl.js.map