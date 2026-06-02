"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RideMapper = void 0;
const Ride_1 = require("../../../domain/entities/Ride");
const Location_1 = require("../../../domain/value-objects/Location");
const RideTimeline_1 = require("../../../domain/value-objects/RideTimeline");
const FareBreakdown_1 = require("../../../domain/value-objects/FareBreakdown");
const Money_1 = require("../../../domain/value-objects/Money");
const idHelper_1 = require("../../../shared/utils/idHelper");
const PaymentStatus_1 = require("../../../domain/value-objects/PaymentStatus");
class RideMapper {
    static toDomain(doc) {
        const pickup = Location_1.Location.create(doc.pickup);
        const drop = Location_1.Location.create(doc.drop);
        const currency = doc.currency;
        const baseFare = Money_1.Money.create(doc.fareBreakdown.baseFare, currency);
        const platformFee = Money_1.Money.create(doc.fareBreakdown.platformFee ?? 0, currency);
        const combinedTax = doc.fareBreakdown.tax;
        const totalFare = Money_1.Money.create(doc.fareBreakdown.totalFare ??
            doc.fareBreakdown.baseFare +
                (doc.fareBreakdown.timeFare ?? 0) +
                (doc.fareBreakdown.platformFee ?? 0) +
                combinedTax, currency);
        const fareBreakdown = FareBreakdown_1.FareBreakdown.create({
            baseFare,
            platformFee,
            fareTax: {
                name: "GST",
                rate: 0,
                amount: Money_1.Money.create(combinedTax, currency),
            },
            platformFeeTax: {
                name: "GST",
                rate: 0,
                amount: Money_1.Money.zero(currency),
            },
            totalFare,
            durationHours: 0,
        });
        const timeline = RideTimeline_1.RideTimeline.fromData(doc.timeline);
        const couponDetails = doc.coupon && doc.coupon.couponId && doc.coupon.code
            ? {
                couponId: doc.coupon.couponId.toString(),
                code: doc.coupon.code,
                discountAmount: doc.coupon.discountAmount ?? 0,
                discountType: doc.coupon.discountType,
            }
            : undefined;
        return Ride_1.Ride.fromData({
            id: doc._id.toString(),
            rideId: doc.rideId,
            driverId: doc.driverId.toString(),
            riderId: doc.riderId.toString(),
            status: doc.status,
            paymentStatus: doc.paymentStatus || PaymentStatus_1.PaymentStatus.PENDING,
            pickup,
            drop,
            requestedPickupTime: doc.requestedPickupTime,
            timeRequired: doc.timeRequired,
            rideType: doc.rideType,
            bookingType: doc.bookingType,
            fareBreakdown,
            currency,
            timeline,
            verificationCode: doc.verificationCode,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
            couponDetails,
        });
    }
    static toPersistence(entity) {
        const fareBreakdown = entity.getFareBreakdown();
        const timeline = entity.getTimeline();
        const coupon = entity.getCouponDetails();
        const combinedTax = fareBreakdown.getFareTax().amount.getAmount() +
            fareBreakdown.getPlatformFeeTax().amount.getAmount();
        return {
            rideId: entity.getRideId(),
            driverId: (0, idHelper_1.toObjectId)(entity.getDriverId()),
            riderId: (0, idHelper_1.toObjectId)(entity.getRiderId()),
            status: entity.getStatus(),
            paymentStatus: entity.getPaymentStatus(),
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
            requestedPickupTime: entity.getrequestedPickupTime(),
            timeRequired: entity.getTimeRequired(),
            rideType: entity.getRideType(),
            bookingType: entity.getBookingType(),
            fareBreakdown: {
                baseFare: fareBreakdown.getBaseFare().getAmount(),
                timeFare: 0,
                platformFee: fareBreakdown.getPlatformFee().getAmount(),
                tax: combinedTax,
                surgeMultiplier: 1,
                totalFare: fareBreakdown.getTotalFare().getAmount(),
            },
            coupon: coupon && coupon.couponId
                ? {
                    couponId: (0, idHelper_1.toObjectId)(coupon.couponId),
                    code: coupon.code,
                    discountAmount: coupon.discountAmount,
                    discountType: coupon.discountType,
                }
                : null,
            currency: entity.getCurrency(),
            timeline: {
                requestedAt: timeline.getRequestedAt(),
                acceptedAt: timeline.getAcceptedAt(),
                arrivedAt: timeline.getArrivedAt(),
                startedAt: timeline.getStartedAt(),
                completedAt: timeline.getCompletedAt(),
                cancelledAt: timeline.getCancelledAt(),
                rejectedAt: timeline.getRejectedAt(),
                paymentInitiatedAt: timeline.getPaymentInitiatedAt(),
                paymentCompletedAt: timeline.getPaymentCompletedAt(),
                paymentFailedAt: timeline.getPaymentFailedAt(),
                paymentRefundedAt: timeline.getPaymentRefundedAt(),
            },
            verificationCode: entity.getVerificationCode(),
            updatedAt: entity.getUpdatedAt(),
        };
    }
}
exports.RideMapper = RideMapper;
//# sourceMappingURL=RideMapper.js.map