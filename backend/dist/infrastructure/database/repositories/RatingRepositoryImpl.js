"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RatingRepositoryImpl = void 0;
const inversify_1 = require("inversify");
const RatingModel_1 = require("../models/RatingModel");
const RatingMapper_1 = require("../mappers/RatingMapper");
const Logger_1 = require("../../../shared/utils/Logger");
const mongoose_1 = require("mongoose");
const idHelper_1 = require("../../../shared/utils/idHelper");
let RatingRepositoryImpl = class RatingRepositoryImpl {
    async findById(id) {
        try {
            const doc = await RatingModel_1.RatingModel.findById(id);
            return doc ? RatingMapper_1.RatingMapper.toDomain(doc) : null;
        }
        catch (error) {
            Logger_1.Logger.error("Error finding rating by id", { id, error });
            throw error;
        }
    }
    async exists(id) {
        try {
            const count = await RatingModel_1.RatingModel.countDocuments({ _id: id });
            return count > 0;
        }
        catch (error) {
            Logger_1.Logger.error("Error checking rating existence", { id, error });
            throw error;
        }
    }
    async existsByRideAndReviewer(rideId, reviewerId) {
        try {
            const count = await RatingModel_1.RatingModel.countDocuments({
                rideId: rideId,
                reviewerId: new mongoose_1.Types.ObjectId(reviewerId),
            });
            return count > 0;
        }
        catch (error) {
            Logger_1.Logger.error("Error checking rating existence by ride and reviewer", {
                rideId,
                reviewerId,
                error,
            });
            throw error;
        }
    }
    async save(rating) {
        try {
            const data = RatingMapper_1.RatingMapper.toPersistence(rating);
            const doc = await RatingModel_1.RatingModel.findOneAndUpdate({
                rideId: data.rideId,
                reviewerId: data.reviewerId,
            }, {
                ...data,
                updatedAt: new Date(),
            }, {
                new: true,
                upsert: true,
                runValidators: true,
            });
            if (!doc) {
                throw new Error("Failed to save rating");
            }
            Logger_1.Logger.info("Rating saved successfully", {
                id: doc._id.toString(),
                rideId: doc.rideId.toString(),
                reviewType: doc.reviewType,
            });
            return RatingMapper_1.RatingMapper.toDomain(doc);
        }
        catch (error) {
            Logger_1.Logger.error("Error saving rating", {
                error: error instanceof Error ? error.message : String(error),
            });
            throw error;
        }
    }
    async delete(id) {
        try {
            await RatingModel_1.RatingModel.findByIdAndDelete(id);
        }
        catch (error) {
            Logger_1.Logger.error("Error deleting rating", { id, error });
            throw error;
        }
    }
    async findAllByRideId(rideId) {
        try {
            const docs = await RatingModel_1.RatingModel.find({
                rideId: rideId,
            });
            return docs.map(RatingMapper_1.RatingMapper.toDomain);
        }
        catch (error) {
            Logger_1.Logger.error("Error finding ratings by rideId", { rideId, error });
            throw error;
        }
    }
    async findByRevieweeId(revieweeId) {
        try {
            const docs = await RatingModel_1.RatingModel.find({
                revieweeId: new mongoose_1.Types.ObjectId(revieweeId),
            }).sort({ createdAt: -1 });
            return docs.map(RatingMapper_1.RatingMapper.toDomain);
        }
        catch (error) {
            Logger_1.Logger.error("Error finding ratings by revieweeId", {
                revieweeId,
                error,
            });
            throw error;
        }
    }
    async findAll(options) {
        try {
            const { filters, sortBy, sortOrder, page, limit } = options;
            const query = {};
            if (filters.reviewType) {
                query["reviewType"] = filters.reviewType;
            }
            if (filters.reviewerId) {
                query["reviewerId"] = filters.reviewerId;
            }
            if (filters.revieweeId) {
                query["revieweeId"] = filters.revieweeId;
            }
            if (filters.rideId) {
                query["rideId"] = filters.rideId;
            }
            if (filters.minRating !== undefined || filters.maxRating !== undefined) {
                query["overallRating"] = {};
                if (filters.minRating !== undefined) {
                    query["overallRating"]["$gte"] =
                        filters.minRating;
                }
                if (filters.maxRating !== undefined) {
                    query["overallRating"]["$lte"] =
                        filters.maxRating;
                }
            }
            if (filters.fromDate || filters.toDate) {
                query["createdAt"] = {};
                if (filters.fromDate) {
                    query["createdAt"]["$gte"] =
                        filters.fromDate;
                }
                if (filters.toDate) {
                    query["createdAt"]["$lte"] = filters.toDate;
                }
            }
            const mongoSortOrder = sortOrder === "asc" ? 1 : -1;
            const skip = (page - 1) * limit;
            const [docs, total] = await Promise.all([
                RatingModel_1.RatingModel.find(query)
                    .sort({ [sortBy]: mongoSortOrder })
                    .skip(skip)
                    .limit(limit),
                RatingModel_1.RatingModel.countDocuments(query),
            ]);
            const ratings = docs.map((doc) => RatingMapper_1.RatingMapper.toDomain(doc));
            return {
                ratings,
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            };
        }
        catch (error) {
            Logger_1.Logger.error("Error finding all ratings", {
                error: error instanceof Error ? error.message : String(error),
            });
            throw error;
        }
    }
    async getRatingStats(params) {
        const { reviewerId, revieweeId, filters } = params;
        const query = {};
        if (reviewerId)
            query.reviewerId = (0, idHelper_1.toObjectId)(reviewerId);
        if (revieweeId)
            query.revieweeId = (0, idHelper_1.toObjectId)(revieweeId);
        if (filters.reviewType)
            query.reviewType = filters.reviewType;
        if (filters.fromDate ?? filters.toDate) {
            query.createdAt = {};
            if (filters.fromDate)
                query.createdAt.$gte = filters.fromDate;
            if (filters.toDate)
                query.createdAt.$lte = filters.toDate;
        }
        const agg = await RatingModel_1.RatingModel.aggregate([
            { $match: query },
            {
                $group: {
                    _id: null,
                    totalRatings: { $sum: 1 },
                    averageRating: { $avg: "$overallRating" },
                    zeroToOne: {
                        $sum: { $cond: [{ $lt: ["$overallRating", 1] }, 1, 0] },
                    },
                    oneToTwo: {
                        $sum: {
                            $cond: [
                                {
                                    $and: [
                                        { $gte: ["$overallRating", 1] },
                                        { $lt: ["$overallRating", 2] },
                                    ],
                                },
                                1,
                                0,
                            ],
                        },
                    },
                    twoToThree: {
                        $sum: {
                            $cond: [
                                {
                                    $and: [
                                        { $gte: ["$overallRating", 2] },
                                        { $lt: ["$overallRating", 3] },
                                    ],
                                },
                                1,
                                0,
                            ],
                        },
                    },
                    threeToFour: {
                        $sum: {
                            $cond: [
                                {
                                    $and: [
                                        { $gte: ["$overallRating", 3] },
                                        { $lt: ["$overallRating", 4] },
                                    ],
                                },
                                1,
                                0,
                            ],
                        },
                    },
                    fourToFive: {
                        $sum: {
                            $cond: [
                                {
                                    $and: [
                                        { $gte: ["$overallRating", 4] },
                                        { $lte: ["$overallRating", 5] },
                                    ],
                                },
                                1,
                                0,
                            ],
                        },
                    },
                },
            },
        ]);
        const result = agg[0];
        return {
            totalRatings: result?.totalRatings ?? 0,
            averageRating: result?.averageRating
                ? parseFloat(result.averageRating.toFixed(2))
                : 0,
            distribution: {
                zeroToOne: result?.zeroToOne ?? 0,
                oneToTwo: result?.oneToTwo ?? 0,
                twoToThree: result?.twoToThree ?? 0,
                threeToFour: result?.threeToFour ?? 0,
                fourToFive: result?.fourToFive ?? 0,
            },
        };
    }
};
exports.RatingRepositoryImpl = RatingRepositoryImpl;
exports.RatingRepositoryImpl = RatingRepositoryImpl = __decorate([
    (0, inversify_1.injectable)()
], RatingRepositoryImpl);
//# sourceMappingURL=RatingRepositoryImpl.js.map