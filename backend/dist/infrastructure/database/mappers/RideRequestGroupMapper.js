"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RideRequestGroupMapper = void 0;
const mongoose_1 = require("mongoose");
const RideRequestGroup_1 = require("@domain/entities/RideRequestGroup");
const Location_1 = require("@domain/value-objects/Location");
const idHelper_1 = require("@shared/utils/idHelper");
const FareBreakdown_1 = require("@domain/value-objects/FareBreakdown");
const Money_1 = require("@domain/value-objects/Money");
class RideRequestGroupMapper {
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
        const fareBreakdown = FareBreakdown_1.FareBreakdown.create({
            baseFare: Money_1.Money.create(doc.fareBreakdown.baseFare.amount, doc.fareBreakdown.baseFare.currency),
            platformFee: Money_1.Money.create(doc.fareBreakdown.platformFee.amount, doc.fareBreakdown.platformFee.currency),
            fareTax: {
                name: doc.fareBreakdown.taxes.fare.name,
                rate: doc.fareBreakdown.taxes.fare.rate,
                amount: Money_1.Money.create(doc.fareBreakdown.taxes.fare.amount.amount, doc.fareBreakdown.taxes.fare.amount.currency),
            },
            platformFeeTax: {
                name: doc.fareBreakdown.taxes.platformFee.name,
                rate: doc.fareBreakdown.taxes.platformFee.rate,
                amount: Money_1.Money.create(doc.fareBreakdown.taxes.platformFee.amount.amount, doc.fareBreakdown.taxes.platformFee.amount.currency),
            },
            totalFare: Money_1.Money.create(doc.fareBreakdown.totalFare.amount, doc.fareBreakdown.totalFare.currency),
            durationHours: doc.fareBreakdown.durationHours,
            calculatedAt: doc.fareBreakdown.calculatedAt,
        });
        return RideRequestGroup_1.RideRequestGroup.fromData({
            id: doc._id.toString(),
            riderId: doc.riderId.toString(),
            pickup,
            drop,
            timeRequired: doc.timeRequired,
            rideType: doc.rideType,
            fareBreakdown,
            candidateDriverIds: doc.candidateDriverIds.map((id) => id.toString()),
            currentIndex: doc.currentIndex,
            status: doc.status,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
        });
    }
    static toPersistence(entity) {
        const pickup = entity.getPickup();
        const drop = entity.getDrop();
        const candidateDriverIds = entity
            .getCandidateDriverIds()
            .map((id) => (0, idHelper_1.toObjectId)(id));
        return {
            _id: entity.getId() ? new mongoose_1.Types.ObjectId(entity.getId()) : undefined,
            riderId: (0, idHelper_1.toObjectId)(entity.getRiderId()),
            pickup: {
                latitude: pickup.getLatitude(),
                longitude: pickup.getLongitude(),
                address: pickup.getAddress(),
            },
            drop: {
                latitude: drop.getLatitude(),
                longitude: drop.getLongitude(),
                address: drop.getAddress(),
            },
            timeRequired: entity.getTimeRequired(),
            rideType: entity.getRideType(),
            fareBreakdown: {
                baseFare: entity.getFareBreakdown().getBaseFare().toJSON(),
                platformFee: entity.getFareBreakdown().getPlatformFee().toJSON(),
                taxes: {
                    fare: {
                        name: entity.getFareBreakdown().getFareTax().name,
                        rate: entity.getFareBreakdown().getFareTax().rate,
                        amount: entity.getFareBreakdown().getFareTax().amount.toJSON(),
                    },
                    platformFee: {
                        name: entity.getFareBreakdown().getPlatformFeeTax().name,
                        rate: entity.getFareBreakdown().getPlatformFeeTax().rate,
                        amount: entity
                            .getFareBreakdown()
                            .getPlatformFeeTax()
                            .amount.toJSON(),
                    },
                },
                totalFare: entity.getFareBreakdown().getTotalFare().toJSON(),
                durationHours: entity.getFareBreakdown().getDurationHours(),
                calculatedAt: entity.getFareBreakdown().getCalculatedAt(),
            },
            candidateDriverIds,
            currentIndex: entity.getCurrentIndex(),
            status: entity.getStatus(),
        };
    }
}
exports.RideRequestGroupMapper = RideRequestGroupMapper;
//# sourceMappingURL=RideRequestGroupMapper.js.map