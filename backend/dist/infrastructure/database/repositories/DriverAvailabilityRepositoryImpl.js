"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverAvailabilityRepositoryImpl = void 0;
const inversify_1 = require("inversify");
const AvailabilityStatus_1 = require("@domain/value-objects/AvailabilityStatus");
const DriverAvailabilityModel_1 = require("../models/DriverAvailabilityModel");
const DriverAvailabilityMapper_1 = require("../mappers/DriverAvailabilityMapper");
const Logger_1 = require("@shared/utils/Logger");
const mongoose_1 = require("mongoose");
const DriverStatus_1 = require("@domain/value-objects/DriverStatus");
const KYCStatus_1 = require("@domain/value-objects/KYCStatus");
const RideRequestGroupModel_1 = require("../models/RideRequestGroupModel");
const RideRequestGroupStatus_1 = require("@domain/value-objects/RideRequestGroupStatus");
let DriverAvailabilityRepositoryImpl = class DriverAvailabilityRepositoryImpl {
    constructor() {
        this.HAVERSINE_RADIUS_KM = 6371;
        this.AVERAGE_SPEED_KM_PER_HOUR = 30;
    }
    // Basic Repository Operations
    async findById(id) {
        try {
            const doc = await DriverAvailabilityModel_1.DriverAvailabilityModel.findById(id).exec();
            return doc ? DriverAvailabilityMapper_1.DriverAvailabilityMapper.toDomain(doc) : null;
        }
        catch (error) {
            Logger_1.Logger.error("Error finding driver availability by id", { id, error });
            throw error;
        }
    }
    async exists(id) {
        try {
            const count = await DriverAvailabilityModel_1.DriverAvailabilityModel.countDocuments({
                _id: id,
            }).exec();
            return count > 0;
        }
        catch (error) {
            Logger_1.Logger.error("Error checking driver availability existence", {
                id,
                error,
            });
            throw error;
        }
    }
    async save(availability) {
        try {
            const availabilityData = DriverAvailabilityMapper_1.DriverAvailabilityMapper.toPersistence(availability);
            const availabilityId = availability.getId();
            const savedDoc = await DriverAvailabilityModel_1.DriverAvailabilityModel.findByIdAndUpdate(availabilityId, availabilityData, {
                new: true,
                upsert: true,
                runValidators: true,
            }).exec();
            if (!savedDoc) {
                throw new Error(`Failed to save driver availability: ${availabilityId}`);
            }
            Logger_1.Logger.info("Driver availability saved successfully", {
                availabilityId,
                driverId: availability.getDriverId(),
            });
            return DriverAvailabilityMapper_1.DriverAvailabilityMapper.toDomain(savedDoc);
        }
        catch (error) {
            Logger_1.Logger.error("Error saving driver availability", {
                availabilityId: availability.getId(),
                error,
            });
            throw error;
        }
    }
    async delete(id) {
        try {
            await DriverAvailabilityModel_1.DriverAvailabilityModel.findByIdAndDelete(id).exec();
            Logger_1.Logger.info("Driver availability deleted successfully", { id });
        }
        catch (error) {
            Logger_1.Logger.error("Error deleting driver availability", { id, error });
            throw error;
        }
    }
    async existsByFilter(filters) {
        try {
            const mongoFilter = this.buildFilterQuery(filters);
            const count = await DriverAvailabilityModel_1.DriverAvailabilityModel.countDocuments(mongoFilter).exec();
            return count > 0;
        }
        catch (error) {
            Logger_1.Logger.error("Error checking existence by filter", {
                filters,
                error,
            });
            throw error;
        }
    }
    async findByIds(ids) {
        try {
            const objectIds = ids.map((id) => new mongoose_1.Types.ObjectId(id));
            const docs = await DriverAvailabilityModel_1.DriverAvailabilityModel.find({
                _id: { $in: objectIds },
            }).exec();
            return docs.map((doc) => DriverAvailabilityMapper_1.DriverAvailabilityMapper.toDomain(doc));
        }
        catch (error) {
            Logger_1.Logger.error("Error finding driver availabilities by IDs", {
                ids,
                error,
            });
            throw error;
        }
    }
    // Query Operations
    async findAll(options) {
        try {
            let query = DriverAvailabilityModel_1.DriverAvailabilityModel.find();
            if (options?.limit)
                query = query.limit(options.limit);
            if (options?.offset)
                query = query.skip(options.offset);
            if (options?.sortBy) {
                const sortOrder = options.sortOrder === "desc" ? -1 : 1;
                query = query.sort({
                    [options.sortBy]: sortOrder,
                });
            }
            const docs = await query.exec();
            return docs.map((doc) => DriverAvailabilityMapper_1.DriverAvailabilityMapper.toDomain(doc));
        }
        catch (error) {
            Logger_1.Logger.error("Error finding all driver availabilities", { error });
            throw error;
        }
    }
    async count(filters) {
        try {
            const mongoFilter = this.buildFilterQuery(filters || {});
            return await DriverAvailabilityModel_1.DriverAvailabilityModel.countDocuments(mongoFilter).exec();
        }
        catch (error) {
            Logger_1.Logger.error("Error counting driver availabilities", { error });
            throw error;
        }
    }
    async findPaginated(options) {
        const { page = 1, limit = 10, filters = {}, sortBy = "createdAt", sortOrder = "desc", } = options;
        try {
            const mongoFilter = this.buildFilterQuery(filters);
            const sortValue = {
                [sortBy]: sortOrder === "asc" ? 1 : -1,
            };
            const total = await DriverAvailabilityModel_1.DriverAvailabilityModel.countDocuments(mongoFilter).exec();
            const totalPages = Math.ceil(total / limit);
            const skip = (page - 1) * limit;
            const docs = await DriverAvailabilityModel_1.DriverAvailabilityModel.find(mongoFilter)
                .sort(sortValue)
                .skip(skip)
                .limit(limit)
                .exec();
            const data = docs.map((doc) => DriverAvailabilityMapper_1.DriverAvailabilityMapper.toDomain(doc));
            return { data, total, page, limit, totalPages };
        }
        catch (error) {
            Logger_1.Logger.error("Error finding paginated driver availabilities", {
                page,
                limit,
                error,
            });
            throw error;
        }
    }
    // Driver-Specific Queries
    async findByDriverId(driverId) {
        try {
            const driverIdObjectId = new mongoose_1.Types.ObjectId(driverId);
            const doc = await DriverAvailabilityModel_1.DriverAvailabilityModel.findOne({
                driverId: driverIdObjectId,
            })
                .sort({ createdAt: -1 })
                .exec();
            return doc ? DriverAvailabilityMapper_1.DriverAvailabilityMapper.toDomain(doc) : null;
        }
        catch (error) {
            Logger_1.Logger.error("Error finding availability by driver ID", {
                driverId,
                error,
            });
            throw error;
        }
    }
    async findActiveByDriverId(driverId) {
        try {
            const driverIdObjectId = new mongoose_1.Types.ObjectId(driverId);
            const doc = await DriverAvailabilityModel_1.DriverAvailabilityModel.findOne({
                driverId: driverIdObjectId,
                isActive: true,
            }).exec();
            if (!doc)
                return null;
            return DriverAvailabilityMapper_1.DriverAvailabilityMapper.toDomain(doc);
        }
        catch (error) {
            Logger_1.Logger.error("Error finding active driver availability", {
                driverId,
                error,
            });
            throw error;
        }
    }
    async existsActiveForDriver(driverId) {
        try {
            const driverIdObjectId = new mongoose_1.Types.ObjectId(driverId);
            const count = await DriverAvailabilityModel_1.DriverAvailabilityModel.countDocuments({
                driverId: driverIdObjectId,
                isActive: true,
            }).exec();
            return count > 0;
        }
        catch (error) {
            Logger_1.Logger.error("Error checking active availability for driver", {
                driverId,
                error,
            });
            throw error;
        }
    }
    // Exception Management
    async addException(driverId, exception) {
        try {
            const driverIdObjectId = new mongoose_1.Types.ObjectId(driverId);
            const updatedDoc = await DriverAvailabilityModel_1.DriverAvailabilityModel.findOneAndUpdate({ driverId: driverIdObjectId, isActive: true }, { $push: { exceptions: exception } }, { new: true }).exec();
            if (!updatedDoc) {
                Logger_1.Logger.warn("No active availability found to add exception", {
                    driverId,
                });
                return null;
            }
            Logger_1.Logger.info("Exception added to driver availability", {
                driverId,
            });
            return DriverAvailabilityMapper_1.DriverAvailabilityMapper.toDomain(updatedDoc);
        }
        catch (error) {
            Logger_1.Logger.error("Error adding exception to driver availability", {
                driverId,
                error,
            });
            throw error;
        }
    }
    async removeException(driverId, exceptionId) {
        try {
            const driverIdObjectId = new mongoose_1.Types.ObjectId(driverId);
            const updatedDoc = await DriverAvailabilityModel_1.DriverAvailabilityModel.findOneAndUpdate({ driverId: driverIdObjectId }, { $pull: { exceptions: { _id: exceptionId } } }, { new: true }).exec();
            if (!updatedDoc) {
                Logger_1.Logger.warn("No availability found to remove exception", { driverId });
                return null;
            }
            Logger_1.Logger.info("Exception removed from driver availability", {
                driverId,
                exceptionId,
            });
            return DriverAvailabilityMapper_1.DriverAvailabilityMapper.toDomain(updatedDoc);
        }
        catch (error) {
            Logger_1.Logger.error("Error removing exception from driver availability", {
                driverId,
                exceptionId,
                error,
            });
            throw error;
        }
    }
    async getExceptions(driverId) {
        const driverIdObjectId = new mongoose_1.Types.ObjectId(driverId);
        const doc = await DriverAvailabilityModel_1.DriverAvailabilityModel.findOne({
            driverId: driverIdObjectId,
        })
            .select("exceptions")
            .lean()
            .exec();
        if (!doc || !doc.exceptions) {
            return [];
        }
        return doc.exceptions.map((exception) => DriverAvailabilityMapper_1.DriverAvailabilityMapper.mapRawExceptionToDomain(exception));
    }
    // Status-Based Queries
    async findByStatus(status, options) {
        try {
            let query = DriverAvailabilityModel_1.DriverAvailabilityModel.find({ status });
            if (options?.limit)
                query = query.limit(options.limit);
            if (options?.offset)
                query = query.skip(options.offset);
            if (options?.sortBy) {
                const sortOrder = options.sortOrder === "desc" ? -1 : 1;
                query = query.sort({
                    [options.sortBy]: sortOrder,
                });
            }
            const docs = await query.exec();
            return docs.map((doc) => DriverAvailabilityMapper_1.DriverAvailabilityMapper.toDomain(doc));
        }
        catch (error) {
            Logger_1.Logger.error("Error finding availabilities by status", {
                status,
                error,
            });
            throw error;
        }
    }
    async findAvailableDrivers(options) {
        try {
            let query = DriverAvailabilityModel_1.DriverAvailabilityModel.find({
                status: AvailabilityStatus_1.AvailabilityStatus.AVAILABLE,
                isActive: true,
            });
            if (options?.limit)
                query = query.limit(options.limit);
            if (options?.offset)
                query = query.skip(options.offset);
            if (options?.sortBy) {
                const sortOrder = options.sortOrder === "desc" ? -1 : 1;
                query = query.sort({
                    [options.sortBy]: sortOrder,
                });
            }
            const docs = await query.exec();
            return docs.map((doc) => DriverAvailabilityMapper_1.DriverAvailabilityMapper.toDomain(doc));
        }
        catch (error) {
            Logger_1.Logger.error("Error finding available drivers", { error });
            throw error;
        }
    }
    // Location-Based Queries
    async findNearLocation(latitude, longitude, radiusKm, options) {
        try {
            const docs = await DriverAvailabilityModel_1.DriverAvailabilityModel.find({
                isActive: true,
            }).exec();
            // Calculate distances and filter by radius
            const driversWithDistance = docs
                .map((doc) => {
                const distance = this.calculateHaversineDistance(latitude, longitude, doc.currentLocation.latitude, doc.currentLocation.longitude);
                return { doc, distance };
            })
                .filter((item) => item.distance <= radiusKm)
                .sort((a, b) => a.distance - b.distance);
            // Apply pagination
            let filteredDrivers = driversWithDistance;
            if (options?.offset) {
                filteredDrivers = filteredDrivers.slice(options.offset);
            }
            if (options?.limit) {
                filteredDrivers = filteredDrivers.slice(0, options.limit);
            }
            return filteredDrivers.map((item) => DriverAvailabilityMapper_1.DriverAvailabilityMapper.toDomain(item.doc));
        }
        catch (error) {
            Logger_1.Logger.error("Error finding drivers near location", {
                latitude,
                longitude,
                radiusKm,
                error,
            });
            throw error;
        }
    }
    async findNearbyAvailableDrivers(latitude, longitude, searchDate, radiusKm = 10, timeRequiredMinutes = 60, limit = 20) {
        try {
            const rideStart = new Date(searchDate);
            const rideEnd = new Date(rideStart.getTime() + timeRequiredMinutes * 60 * 1000);
            Logger_1.Logger.debug("findNearbyAvailableDrivers called", {
                latitude,
                longitude,
                radiusKm,
                limit,
                searchDate: rideStart.toISOString(),
                timeRequiredMinutes,
            });
            const onTheClockDriverIds = await this.getDriversHandlingRideRequests();
            if (onTheClockDriverIds.length > 0) {
                Logger_1.Logger.debug("Excluding on-the-clock drivers", {
                    count: onTheClockDriverIds.length,
                    ids: onTheClockDriverIds,
                });
            }
            const pipeline = [
                {
                    $geoNear: {
                        near: {
                            type: "Point",
                            coordinates: [longitude, latitude],
                        },
                        distanceField: "distanceMeters",
                        maxDistance: radiusKm * 1000,
                        spherical: true,
                        key: "locationPoint",
                        query: {
                            isActive: true,
                            status: {
                                $in: [
                                    AvailabilityStatus_1.AvailabilityStatus.AVAILABLE,
                                    AvailabilityStatus_1.AvailabilityStatus.SCHEDULED,
                                ],
                            },
                            ...(onTheClockDriverIds.length > 0
                                ? {
                                    driverId: {
                                        $nin: onTheClockDriverIds,
                                    },
                                }
                                : {}),
                        },
                    },
                },
                {
                    $lookup: {
                        from: "drivers",
                        localField: "driverId",
                        foreignField: "_id",
                        as: "driverDoc",
                    },
                },
                {
                    $unwind: "$driverDoc",
                },
                {
                    $match: {
                        "driverDoc.status": DriverStatus_1.DriverStatus.ACTIVE,
                        "driverDoc.kycStatus": KYCStatus_1.KYCStatus.APPROVED,
                    },
                },
                {
                    $addFields: {
                        averageRating: {
                            $ifNull: ["$driverDoc.averageRating", 0],
                        },
                    },
                },
                {
                    $sort: {
                        distanceMeters: 1,
                        averageRating: -1,
                    },
                },
                {
                    $limit: limit,
                },
            ];
            const aggregatedDocs = await DriverAvailabilityModel_1.DriverAvailabilityModel.aggregate(pipeline).exec();
            Logger_1.Logger.debug("Database aggregation results", {
                count: aggregatedDocs.length,
                drivers: aggregatedDocs.map((d) => ({
                    id: d.driverId,
                    distance: d.distanceMeters,
                    status: d.status,
                })),
            });
            const rankedDrivers = aggregatedDocs
                .map((doc) => {
                const domainDriver = DriverAvailabilityMapper_1.DriverAvailabilityMapper.toDomain(this.toDriverAvailabilityDocument(doc));
                const distanceKm = this.roundToTwoDecimals(doc.distanceMeters / 1000);
                const etaMinutes = this.calculateEtaMinutes(distanceKm);
                return {
                    driver: domainDriver,
                    distanceKm,
                    etaMinutes,
                };
            })
                .filter((item) => {
                const isAvailable = this.isAvailableForRequestedDuration(item.driver, rideStart, rideEnd);
                if (!isAvailable) {
                    Logger_1.Logger.info("Driver filtered out by availability logic", {
                        driverId: item.driver.getDriverId(),
                        requestedStart: rideStart.toISOString(),
                        requestedEnd: rideEnd.toISOString(),
                        driverStatus: item.driver.getStatus(),
                    });
                }
                return isAvailable;
            });
            Logger_1.Logger.info("Filtered nearby available drivers", {
                totalFromDb: aggregatedDocs.length,
                finalNearbyCount: rankedDrivers.length,
                excludedOnTheClockCount: onTheClockDriverIds.length,
                filteredOutBySchedule: aggregatedDocs.length - rankedDrivers.length,
            });
            return rankedDrivers;
        }
        catch (error) {
            Logger_1.Logger.error("Error finding nearby available drivers", {
                latitude,
                longitude,
                radiusKm,
                error,
            });
            throw error;
        }
    }
    // Time-Based Queries
    async findExpiredAvailabilities() {
        try {
            const now = new Date();
            const docs = await DriverAvailabilityModel_1.DriverAvailabilityModel.find({
                "recurringSchedule.validity.endDate": { $lt: now },
                isActive: true,
            }).exec();
            Logger_1.Logger.info("Found expired availabilities", { count: docs.length });
            return docs.map((doc) => DriverAvailabilityMapper_1.DriverAvailabilityMapper.toDomain(doc));
        }
        catch (error) {
            Logger_1.Logger.error("Error finding expired availabilities", { error });
            throw error;
        }
    }
    async deactivateExpiredAvailabilities() {
        try {
            const now = new Date();
            const result = await DriverAvailabilityModel_1.DriverAvailabilityModel.updateMany({
                "recurringSchedule.validity.endDate": { $lt: now },
                isActive: true,
            }, {
                $set: {
                    isActive: false,
                    status: AvailabilityStatus_1.AvailabilityStatus.OFFLINE,
                    updatedAt: now,
                },
            }).exec();
            Logger_1.Logger.info("Deactivated expired availabilities", {
                modifiedCount: result.modifiedCount,
            });
            return result.modifiedCount ?? 0;
        }
        catch (error) {
            Logger_1.Logger.error("Error deactivating expired availabilities", { error });
            throw error;
        }
    }
    async cleanupExpiredRecords() {
        try {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            const result = await DriverAvailabilityModel_1.DriverAvailabilityModel.deleteMany({
                isActive: false,
                "recurringSchedule.validity.endDate": { $lt: thirtyDaysAgo },
            }).exec();
            Logger_1.Logger.info("Cleaned up expired records", {
                deletedCount: result.deletedCount,
            });
            return result.deletedCount ?? 0;
        }
        catch (error) {
            Logger_1.Logger.error("Error cleaning up expired records", { error });
            throw error;
        }
    }
    // Schedule Management
    async findConflictingSchedule(driverId, availableFrom, availableTill) {
        try {
            const driverIdObjectId = new mongoose_1.Types.ObjectId(driverId);
            const doc = await DriverAvailabilityModel_1.DriverAvailabilityModel.findOne({
                driverId: driverIdObjectId,
                isActive: true,
                status: { $ne: AvailabilityStatus_1.AvailabilityStatus.OFFLINE },
                "recurringSchedule.validity.startDate": { $lt: availableTill },
                "recurringSchedule.validity.endDate": { $gt: availableFrom },
            }).exec();
            return doc ? DriverAvailabilityMapper_1.DriverAvailabilityMapper.toDomain(doc) : null;
        }
        catch (error) {
            Logger_1.Logger.error("Error finding conflicting schedule", {
                driverId,
                availableFrom,
                availableTill,
                error,
            });
            throw error;
        }
    }
    async findNearbyAvailableDriversByBaseLocation(latitude, longitude, availableFrom, radiusKm, limit) {
        try {
            Logger_1.Logger.debug("findNearbyAvailableDriversByBaseLocation called", {
                latitude,
                longitude,
                radiusKm,
                limit,
                availableFrom: availableFrom.toISOString(),
            });
            const pipeline = [
                {
                    $geoNear: {
                        near: {
                            type: "Point",
                            coordinates: [longitude, latitude],
                        },
                        distanceField: "distanceMeters",
                        maxDistance: radiusKm * 1000,
                        spherical: true,
                        key: "baseLocationPoint",
                        query: {
                            isActive: true,
                            status: {
                                $ne: AvailabilityStatus_1.AvailabilityStatus.OFFLINE,
                            },
                        },
                    },
                },
                {
                    $match: {
                        "recurringSchedule.validity.startDate": { $lte: availableFrom },
                        "recurringSchedule.validity.endDate": { $gte: availableFrom },
                    },
                },
                {
                    $lookup: {
                        from: "drivers",
                        localField: "driverId",
                        foreignField: "_id",
                        as: "driverDoc",
                    },
                },
                {
                    $unwind: "$driverDoc",
                },
                {
                    $match: {
                        "driverDoc.status": DriverStatus_1.DriverStatus.ACTIVE,
                        "driverDoc.kycStatus": KYCStatus_1.KYCStatus.APPROVED,
                    },
                },
                {
                    $sort: {
                        distanceMeters: 1,
                    },
                },
                {
                    $limit: limit,
                },
            ];
            const aggregatedDocs = await DriverAvailabilityModel_1.DriverAvailabilityModel.aggregate(pipeline).exec();
            Logger_1.Logger.debug("findNearbyAvailableDriversByBaseLocation results", {
                count: aggregatedDocs.length,
                drivers: aggregatedDocs.map((d) => ({
                    id: d.driverId,
                    distanceMeters: d.distanceMeters,
                    status: d.status,
                })),
            });
            return aggregatedDocs.map((doc) => {
                const domainDriver = DriverAvailabilityMapper_1.DriverAvailabilityMapper.toDomain(this.toDriverAvailabilityDocument(doc));
                const distanceKm = this.roundToTwoDecimals(doc.distanceMeters / 1000);
                return {
                    driver: domainDriver,
                    driverUserId: doc.driverDoc.userId.toString(),
                    distanceKm,
                };
            });
        }
        catch (error) {
            Logger_1.Logger.error("Error finding nearby available drivers by base location", {
                latitude,
                longitude,
                radiusKm,
                availableFrom,
                error,
            });
            throw error;
        }
    }
    async getDriversHandlingRideRequests() {
        const groups = await RideRequestGroupModel_1.RideRequestGroupModel.find({
            status: RideRequestGroupStatus_1.RideRequestGroupStatus.SEARCHING,
        })
            .select("candidateDriverIds currentIndex")
            .lean()
            .exec();
        const activeDriverIds = [];
        for (const group of groups) {
            const currentDriverId = group.candidateDriverIds[group.currentIndex];
            if (currentDriverId) {
                activeDriverIds.push(currentDriverId);
            }
        }
        return activeDriverIds;
    }
    toDriverAvailabilityDocument(doc) {
        return new DriverAvailabilityModel_1.DriverAvailabilityModel({
            _id: doc._id,
            driverId: doc.driverId,
            status: doc.status,
            currentLocation: doc.currentLocation,
            locationPoint: doc.locationPoint,
            recurringSchedule: doc.recurringSchedule,
            exceptions: doc.exceptions ?? [],
            isActive: doc.isActive,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
        });
    }
    calculateEtaMinutes(distanceKm) {
        return Math.ceil((distanceKm / this.AVERAGE_SPEED_KM_PER_HOUR) * 60);
    }
    roundToTwoDecimals(value) {
        return Math.round(value * 100) / 100;
    }
    isAvailableForRequestedDuration(availability, rideStart, rideEnd) {
        return availability.isAvailableForTimeRange(rideStart, rideEnd);
    }
    calculateHaversineDistance(lat1, lon1, lat2, lon2) {
        const toRad = (value) => (value * Math.PI) / 180;
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) *
                Math.cos(toRad(lat2)) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return this.HAVERSINE_RADIUS_KM * c;
    }
    buildFilterQuery(filters) {
        const query = {};
        if (filters.status) {
            query.status = filters.status;
        }
        if (filters.driverId) {
            query.driverId = new mongoose_1.Types.ObjectId(filters.driverId);
        }
        if (filters.availableFrom && filters.availableTill) {
            query["recurringSchedule.validity.startDate"] = {
                $lt: filters.availableTill,
            };
            query["recurringSchedule.validity.endDate"] = {
                $gt: filters.availableFrom,
            };
        }
        return query;
    }
};
exports.DriverAvailabilityRepositoryImpl = DriverAvailabilityRepositoryImpl;
exports.DriverAvailabilityRepositoryImpl = DriverAvailabilityRepositoryImpl = __decorate([
    (0, inversify_1.injectable)()
], DriverAvailabilityRepositoryImpl);
//# sourceMappingURL=DriverAvailabilityRepositoryImpl.js.map