"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverDashboardRepositoryImpl = void 0;
const inversify_1 = require("inversify");
const Logger_1 = require("@shared/utils/Logger");
const mongoose_1 = require("mongoose");
const RideModel_1 = require("../../models/RideModel");
const RideRequestModel_1 = require("../../models/RideRequestModel");
const Ride_1 = require("@domain/entities/Ride");
const RideRequest_1 = require("@domain/entities/RideRequest");
const Location_1 = require("@domain/value-objects/Location");
const DriverDashboardStatistics_1 = require("@domain/value-objects/DriverDashboardStatistics");
const DriverDashboardPerformance_1 = require("@domain/value-objects/DriverDashboardPerformance");
const RideStatus_1 = require("@domain/value-objects/RideStatus");
const RideRequestStatus_1 = require("@domain/value-objects/RideRequestStatus");
const FareBreakdown_1 = require("@domain/value-objects/FareBreakdown");
const Money_1 = require("@domain/value-objects/Money");
const RideTimeline_1 = require("@domain/value-objects/RideTimeline");
const RideType_1 = require("@domain/value-objects/RideType");
let DriverDashboardRepositoryImpl = class DriverDashboardRepositoryImpl {
    parseRideType(rideTypeValue) {
        const normalizedValue = rideTypeValue?.trim().toLowerCase() ?? "";
        if (normalizedValue === "one way" || normalizedValue === "oneway") {
            return RideType_1.RideType.ONEWAY;
        }
        else if (normalizedValue === "round trip" ||
            normalizedValue === "roundtrip") {
            return RideType_1.RideType.ROUNDTRIP;
        }
        else {
            Logger_1.Logger.warn("Invalid ride type value, defaulting to ONEWAY", {
                rideTypeValue,
            });
            return RideType_1.RideType.ONEWAY;
        }
    }
    async getDashboardData(driverId) {
        try {
            const objectId = new mongoose_1.Types.ObjectId(driverId);
            const [statistics, performance, currentRide, pendingRequests, scheduledRidesCount,] = await Promise.all([
                this.getStatistics(objectId),
                this.getPerformance(objectId),
                this.getCurrentRide(objectId),
                this.getPendingRequests(objectId),
                this.getScheduledRidesCount(objectId),
            ]);
            return {
                currentRide,
                pendingRequests,
                statistics,
                performance,
                scheduledRidesCount,
            };
        }
        catch (error) {
            Logger_1.Logger.error("Error fetching dashboard data", { driverId, error });
            throw error;
        }
    }
    async getStatistics(driverId) {
        try {
            const [completedStats, cancelledCount] = await Promise.all([
                RideModel_1.RideModel.aggregate([
                    {
                        $match: {
                            driverId,
                            status: RideStatus_1.RideStatus.COMPLETED,
                        },
                    },
                    {
                        $group: {
                            _id: null,
                            count: { $sum: 1 },
                            totalEarnings: { $sum: "$fare" },
                        },
                    },
                ]),
                RideModel_1.RideModel.countDocuments({
                    driverId,
                    status: RideStatus_1.RideStatus.CANCELLED,
                }),
            ]);
            const completedData = completedStats[0] || { count: 0, totalEarnings: 0 };
            return DriverDashboardStatistics_1.DriverDashboardStatistics.create(completedData.count, cancelledCount, completedData.totalEarnings);
        }
        catch (error) {
            Logger_1.Logger.error("Error getting statistics", { error });
            throw error;
        }
    }
    async getPerformance(driverId) {
        try {
            const [totalAssigned, totalAccepted, totalCancelled, ratingData] = await Promise.all([
                RideModel_1.RideModel.countDocuments({ driverId }),
                RideModel_1.RideModel.countDocuments({
                    driverId,
                    status: {
                        $in: [
                            RideStatus_1.RideStatus.ACCEPTED,
                            RideStatus_1.RideStatus.STARTED,
                            RideStatus_1.RideStatus.COMPLETED,
                        ],
                    },
                }),
                RideModel_1.RideModel.countDocuments({ driverId, status: RideStatus_1.RideStatus.CANCELLED }),
                RideModel_1.RideModel.aggregate([
                    {
                        $match: {
                            driverId,
                            status: RideStatus_1.RideStatus.COMPLETED,
                            rating: { $exists: true },
                        },
                    },
                    {
                        $group: {
                            _id: null,
                            avgRating: { $avg: "$rating" },
                        },
                    },
                ]),
            ]);
            const acceptanceRate = totalAssigned > 0
                ? Math.round((totalAccepted / totalAssigned) * 100)
                : 0;
            const cancellationRate = totalAssigned > 0
                ? Math.round((totalCancelled / totalAssigned) * 100)
                : 0;
            const averageRating = ratingData[0]?.avgRating
                ? Number(ratingData[0].avgRating.toFixed(1))
                : 0;
            return DriverDashboardPerformance_1.DriverDashboardPerformance.create(acceptanceRate, cancellationRate, averageRating);
        }
        catch (error) {
            Logger_1.Logger.error("Error getting performance metrics", { error });
            throw error;
        }
    }
    async getCurrentRide(driverId) {
        try {
            const rideDoc = await RideModel_1.RideModel.findOne({
                driverId,
                status: RideStatus_1.RideStatus.STARTED,
            })
                .populate("riderId", "name mobile")
                .exec();
            if (!rideDoc) {
                return null;
            }
            return this.mapDocumentToRide(rideDoc);
        }
        catch (error) {
            Logger_1.Logger.error("Error getting current ride", { error });
            throw error;
        }
    }
    async getPendingRequests(driverId) {
        try {
            const requestDocs = await RideRequestModel_1.RideRequestModel.find({
                driverId,
                status: RideRequestStatus_1.RideRequestStatus.PENDING,
            })
                .sort({ pickupTime: 1 })
                .exec();
            return requestDocs.map((doc) => this.mapDocumentToRideRequest(doc));
        }
        catch (error) {
            Logger_1.Logger.error("Error getting pending requests", { error });
            throw error;
        }
    }
    async getScheduledRidesCount(driverId) {
        try {
            const count = await RideModel_1.RideModel.countDocuments({
                driverId,
                status: RideStatus_1.RideStatus.ACCEPTED,
            });
            return count;
        }
        catch (error) {
            Logger_1.Logger.error("Error getting scheduled rides count", { error });
            throw error;
        }
    }
    mapDocumentToRide(doc) {
        const pickup = Location_1.Location.create({
            latitude: doc.pickup.latitude,
            longitude: doc.pickup.longitude,
            address: doc.pickup.address,
        });
        const drop = Location_1.Location.create({
            latitude: doc.drop.latitude,
            longitude: doc.drop.longitude,
            address: doc.drop.address,
        });
        let fareBreakdown;
        try {
            // Calculate total fare from components
            const baseFare = doc.fareBreakdown?.baseFare || 0;
            const timeFare = doc.fareBreakdown?.timeFare || 0;
            const taxAmount = doc.fareBreakdown?.tax || 0;
            const platformFeeAmount = baseFare * 0.02;
            fareBreakdown = FareBreakdown_1.FareBreakdown.create({
                baseFare: Money_1.Money.create(baseFare + timeFare),
                platformFee: Money_1.Money.create(platformFeeAmount),
                fareTax: {
                    name: "GST on Fare",
                    rate: 5,
                    amount: Money_1.Money.create(taxAmount),
                },
                platformFeeTax: {
                    name: "GST on Platform Fee",
                    rate: 18,
                    amount: Money_1.Money.create(platformFeeAmount * 0.18),
                },
                totalFare: Money_1.Money.create(baseFare +
                    timeFare +
                    taxAmount +
                    platformFeeAmount +
                    platformFeeAmount * 0.18),
                durationHours: 1,
            });
        }
        catch (error) {
            Logger_1.Logger.warn("Failed to create FareBreakdown, using default values", {
                documentId: doc.id,
                error,
            });
            // Fallback: create minimal fare breakdown
            const totalFare = doc.fareBreakdown?.baseFare || 0;
            fareBreakdown = FareBreakdown_1.FareBreakdown.create({
                baseFare: Money_1.Money.create(totalFare),
                platformFee: Money_1.Money.create(0),
                fareTax: {
                    name: "GST on Fare",
                    rate: 5,
                    amount: Money_1.Money.create(0),
                },
                platformFeeTax: {
                    name: "GST on Platform Fee",
                    rate: 18,
                    amount: Money_1.Money.create(0),
                },
                totalFare: Money_1.Money.create(totalFare),
                durationHours: 1,
            });
        }
        // Reconstruct RideTimeline from document
        const timeline = RideTimeline_1.RideTimeline.fromData({
            startedAt: doc.timeline.startedAt || undefined,
            completedAt: doc.timeline.completedAt || undefined,
            cancelledAt: doc.timeline.cancelledAt || undefined,
        });
        const rideTypeValue = this.parseRideType(doc.rideType);
        return Ride_1.Ride.fromData({
            id: doc.id.toString(),
            rideId: doc.rideId,
            driverId: doc.driverId.toString(),
            riderId: doc.riderId.toString(),
            status: doc.status,
            paymentStatus: doc.paymentStatus,
            pickup,
            drop,
            requestedPickupTime: doc.requestedPickupTime,
            timeRequired: doc.timeRequired,
            rideType: rideTypeValue,
            bookingType: doc.bookingType,
            fareBreakdown,
            currency: doc.currency,
            timeline,
            verificationCode: doc.verificationCode,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
        });
    }
    mapDocumentToRideRequest(doc) {
        const pickup = Location_1.Location.create({
            latitude: doc.pickup.latitude,
            longitude: doc.pickup.longitude,
            address: doc.pickup.address,
        });
        const drop = Location_1.Location.create({
            latitude: doc.drop.latitude,
            longitude: doc.drop.longitude,
            address: doc.drop.address,
        });
        const rideTypeValue = this.parseRideType(doc.rideType);
        let fareBreakdown;
        try {
            const baseFare = Money_1.Money.create(doc.fareBreakdown.baseFare.amount, doc.fareBreakdown.baseFare.currency);
            const platformFee = Money_1.Money.create(doc.fareBreakdown.platformFee.amount, doc.fareBreakdown.platformFee.currency);
            const fareTax = {
                name: doc.fareBreakdown.taxes.fare.name,
                rate: doc.fareBreakdown.taxes.fare.rate,
                amount: Money_1.Money.create(doc.fareBreakdown.taxes.fare.amount.amount, doc.fareBreakdown.taxes.fare.amount.currency),
            };
            const platformFeeTax = {
                name: doc.fareBreakdown.taxes.platformFee.name,
                rate: doc.fareBreakdown.taxes.platformFee.rate,
                amount: Money_1.Money.create(doc.fareBreakdown.taxes.platformFee.amount.amount, doc.fareBreakdown.taxes.platformFee.amount.currency),
            };
            const totalFare = Money_1.Money.create(doc.fareBreakdown.totalFare.amount, doc.fareBreakdown.totalFare.currency);
            fareBreakdown = FareBreakdown_1.FareBreakdown.create({
                baseFare,
                platformFee,
                fareTax,
                platformFeeTax,
                totalFare,
                durationHours: doc.fareBreakdown.durationHours,
            });
        }
        catch (error) {
            Logger_1.Logger.warn("Failed to create FareBreakdown from RideRequest, using default values", {
                documentId: doc._id,
                error,
            });
            // Fallback: create minimal fare breakdown
            fareBreakdown = FareBreakdown_1.FareBreakdown.create({
                baseFare: Money_1.Money.create(0),
                platformFee: Money_1.Money.create(0),
                fareTax: {
                    name: "GST on Fare",
                    rate: 5,
                    amount: Money_1.Money.create(0),
                },
                platformFeeTax: {
                    name: "GST on Platform Fee",
                    rate: 18,
                    amount: Money_1.Money.create(0),
                },
                totalFare: Money_1.Money.create(0),
                durationHours: 0,
            });
        }
        return RideRequest_1.RideRequest.fromData({
            id: doc._id.toString(),
            driverId: doc.driverId.toString(),
            driverUserId: doc.driverUserId.toString(),
            requestGroupId: doc.requestGroupId.toString(),
            riderId: doc.riderId.toString(),
            pickup,
            drop,
            timeRequired: doc.timeRequired,
            pickupTime: doc.pickupTime,
            rideType: rideTypeValue,
            fareBreakdown,
            status: doc.status,
            pickupETA: doc.pickupETA,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
        });
    }
};
exports.DriverDashboardRepositoryImpl = DriverDashboardRepositoryImpl;
exports.DriverDashboardRepositoryImpl = DriverDashboardRepositoryImpl = __decorate([
    (0, inversify_1.injectable)()
], DriverDashboardRepositoryImpl);
//# sourceMappingURL=DriverDashboardRepositoryImpl.js.map