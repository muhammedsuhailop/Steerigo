"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RideRequestMapper = void 0;
const RideRequest_1 = require("@domain/entities/RideRequest");
const Location_1 = require("@domain/value-objects/Location");
const FareBreakdown_1 = require("@domain/value-objects/FareBreakdown");
const Money_1 = require("@domain/value-objects/Money");
const idHelper_1 = require("@shared/utils/idHelper");
const mongoose_1 = require("mongoose");
class RideRequestMapper {
    static toDomain(doc) {
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
        const fareBreakdown = FareBreakdown_1.FareBreakdown.create({
            baseFare,
            platformFee,
            fareTax,
            platformFeeTax,
            totalFare,
            durationHours: doc.fareBreakdown.durationHours,
        });
        return RideRequest_1.RideRequest.fromData({
            id: doc._id.toString(),
            driverId: doc.driverId.toString(),
            driverUserId: doc.driverUserId.toString(),
            requestGroupId: doc.requestGroupId,
            riderId: doc.riderId.toString(),
            pickup,
            drop,
            pickupTime: doc.pickupTime,
            timeRequired: doc.timeRequired,
            rideType: doc.rideType,
            fareBreakdown,
            status: doc.status,
            pickupETA: doc.pickupETA,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
        });
    }
    static toPersistence(entity) {
        const fareBreakdown = entity.getFareBreakdown();
        return {
            _id: entity.getId() ? new mongoose_1.Types.ObjectId(entity.getId()) : undefined,
            driverId: (0, idHelper_1.toObjectId)(entity.getDriverId()),
            driverUserId: (0, idHelper_1.toObjectId)(entity.getDriverUserId()),
            requestGroupId: entity.getRequestGroupId(),
            riderId: (0, idHelper_1.toObjectId)(entity.getRiderId()),
            pickup: {
                latitude: entity.getPickup().getLatitude(),
                longitude: entity.getPickup().getLongitude(),
                address: entity.getPickup().getAddress(),
            },
            drop: {
                latitude: entity.getDrop().getLatitude(),
                longitude: entity.getDrop().getLongitude(),
                address: entity.getDrop().getAddress(),
            },
            pickupTime: entity.getPickupTime(),
            timeRequired: entity.getTimeRequired(),
            rideType: entity.getRideType(),
            fareBreakdown: {
                baseFare: {
                    amount: fareBreakdown.getBaseFare().getAmount(),
                    currency: fareBreakdown.getBaseFare().getCurrency(),
                },
                platformFee: {
                    amount: fareBreakdown.getPlatformFee().getAmount(),
                    currency: fareBreakdown.getPlatformFee().getCurrency(),
                },
                taxes: {
                    fare: {
                        name: fareBreakdown.getFareTax().name,
                        rate: fareBreakdown.getFareTax().rate,
                        amount: {
                            amount: fareBreakdown.getFareTax().amount.getAmount(),
                            currency: fareBreakdown.getFareTax().amount.getCurrency(),
                        },
                    },
                    platformFee: {
                        name: fareBreakdown.getPlatformFeeTax().name,
                        rate: fareBreakdown.getPlatformFeeTax().rate,
                        amount: {
                            amount: fareBreakdown.getPlatformFeeTax().amount.getAmount(),
                            currency: fareBreakdown.getPlatformFeeTax().amount.getCurrency(),
                        },
                    },
                },
                totalFare: {
                    amount: fareBreakdown.getTotalFare().getAmount(),
                    currency: fareBreakdown.getTotalFare().getCurrency(),
                },
                durationHours: fareBreakdown.getDurationHours(),
                calculatedAt: fareBreakdown.getCalculatedAt(),
            },
            status: entity.getStatus(),
            pickupETA: entity.getPickupETA(),
            updatedAt: entity.getUpdatedAt(),
        };
    }
}
exports.RideRequestMapper = RideRequestMapper;
//# sourceMappingURL=RideRequestMapper.js.map