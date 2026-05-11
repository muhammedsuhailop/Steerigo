import { Ride } from "@domain/entities/Ride";
import { Location } from "@domain/value-objects/Location";
import { RideStatus } from "@domain/value-objects/RideStatus";
import { RideType } from "@domain/value-objects/RideType";
import { RideTimeline } from "@domain/value-objects/RideTimeline";
import { FareBreakdown } from "@domain/value-objects/FareBreakdown";
import { Money } from "@domain/value-objects/Money";
import { IRideDocument } from "../models/RideModel";
import { toObjectId } from "@shared/utils/idHelper";
import { PaymentStatus } from "@domain/value-objects/PaymentStatus";

export class RideMapper {
  static toDomain(doc: IRideDocument): Ride {
    const pickup = Location.create(doc.pickup);
    const drop = Location.create(doc.drop);

    const currency = doc.currency;

    const baseFare = Money.create(doc.fareBreakdown.baseFare, currency);
    const platformFee = Money.create(
      doc.fareBreakdown.platformFee ?? 0,
      currency,
    );

    const combinedTax = doc.fareBreakdown.tax;

    const totalFare = Money.create(
      doc.fareBreakdown.totalFare ??
        doc.fareBreakdown.baseFare +
          (doc.fareBreakdown.timeFare ?? 0) +
          (doc.fareBreakdown.platformFee ?? 0) +
          combinedTax,
      currency,
    );

    const fareBreakdown = FareBreakdown.create({
      baseFare,
      platformFee,
      fareTax: {
        name: "GST",
        rate: 0,
        amount: Money.create(combinedTax, currency),
      },
      platformFeeTax: {
        name: "GST",
        rate: 0,
        amount: Money.zero(currency),
      },
      totalFare,
      durationHours: 0,
    });

    const timeline = RideTimeline.fromData(doc.timeline);

    const couponDetails =
      doc.coupon && doc.coupon.couponId && doc.coupon.code
        ? {
            couponId: doc.coupon.couponId.toString(),
            code: doc.coupon.code,
            discountAmount: doc.coupon.discountAmount ?? 0,
            discountType: doc.coupon.discountType,
          }
        : undefined;

    return Ride.fromData({
      id: doc._id.toString(),
      rideId: doc.rideId,
      driverId: doc.driverId.toString(),
      riderId: doc.riderId.toString(),
      status: doc.status as RideStatus,
      paymentStatus:
        (doc.paymentStatus as PaymentStatus) || PaymentStatus.PENDING,
      pickup,
      drop,
      timeRequired:doc.timeRequired,
      rideType: doc.rideType as RideType,
      fareBreakdown,
      currency,
      timeline,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      couponDetails,
    });
  }

  static toPersistence(entity: Ride): Partial<IRideDocument> {
    const fareBreakdown = entity.getFareBreakdown();
    const timeline = entity.getTimeline();
    const coupon = entity.getCouponDetails();

    const combinedTax =
      fareBreakdown.getFareTax().amount.getAmount() +
      fareBreakdown.getPlatformFeeTax().amount.getAmount();

    return {
      rideId: entity.getRideId(),
      driverId: toObjectId(entity.getDriverId()),
      riderId: toObjectId(entity.getRiderId()),
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

      timeRequired:entity.getTimeRequired(),
      rideType: entity.getRideType(),

      fareBreakdown: {
        baseFare: fareBreakdown.getBaseFare().getAmount(),
        timeFare: 0,
        platformFee: fareBreakdown.getPlatformFee().getAmount(),
        tax: combinedTax,
        surgeMultiplier: 1,
        totalFare: fareBreakdown.getTotalFare().getAmount(),
      },

      coupon:
        coupon && coupon.couponId
          ? {
              couponId: toObjectId(coupon.couponId),
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

      updatedAt: entity.getUpdatedAt(),
    };
  }
}
