import { Ride } from "@domain/entities/Ride";
import { Location } from "@domain/value-objects/Location";
import { RideStatus } from "@domain/value-objects/RideStatus";
import { RideType } from "@domain/value-objects/RideType";
import { RideTimeline } from "@domain/value-objects/RideTimeline";
import {
  FareBreakdown,
  TaxBreakdown,
} from "@domain/value-objects/FareBreakdown";
import { Money } from "@domain/value-objects/Money";
import { IRideDocument } from "../models/RideModel";
import { toObjectId } from "@shared/utils/idHelper";
import { PaymentStatus } from "@domain/value-objects/PaymentStatus";

export class RideMapper {
  static toDomain(doc: IRideDocument): Ride {
    const pickup = Location.create({
      latitude: doc.pickup.latitude,
      longitude: doc.pickup.longitude,
      address: doc.pickup.address,
    });

    const drop = Location.create({
      latitude: doc.drop.latitude,
      longitude: doc.drop.longitude,
      address: doc.drop.address,
    });

    const cur = doc.currency;
    const baseFare = Money.create(doc.fareBreakdown.baseFare, cur);
    const platformFee = Money.create(doc.fareBreakdown.platformFee ?? 0, cur);

    const combinedTax = doc.fareBreakdown.tax;

    const totalFareAmount =
      doc.fareBreakdown.baseFare +
      (doc.fareBreakdown.platformFee ?? 0) +
      combinedTax -
      (doc.couponDiscountAmount ?? 0);

    const fareTax: TaxBreakdown = {
      name: "GST on Fare",
      rate: 0,
      amount: Money.create(combinedTax, cur),
    };

    const platformFeeTax: TaxBreakdown = {
      name: "GST on Platform Fee",
      rate: 0,
      amount: Money.zero(cur),
    };

    const totalFare = Money.create(totalFareAmount, cur);

    const fareBreakdown = FareBreakdown.create({
      baseFare,
      platformFee,
      fareTax,
      platformFeeTax,
      totalFare,
      durationHours: 0,
    });

    const timeline = RideTimeline.fromData({
      requestedAt: doc.timeline.requestedAt,
      acceptedAt: doc.timeline.acceptedAt,
      arrivedAt: doc.timeline.arrivedAt,
      startedAt: doc.timeline.startedAt,
      completedAt: doc.timeline.completedAt,
      cancelledAt: doc.timeline.cancelledAt,
      rejectedAt: doc.timeline.rejectedAt,
      paymentInitiatedAt: doc.timeline.paymentInitiatedAt,
      paymentCompletedAt: doc.timeline.paymentCompletedAt,
    });

    const couponDetails = doc.couponName
      ? { code: doc.couponName, discountAmount: doc.couponDiscountAmount || 0 }
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
      rideType: doc.rideType as RideType,
      fareBreakdown,
      currency: cur,
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
      rideType: entity.getRideType(),
      fareBreakdown: {
        baseFare: fareBreakdown.getBaseFare().getAmount(),
        timeFare: 0,
        platformFee: fareBreakdown.getPlatformFee().getAmount(),
        tax: combinedTax,
        surgeMultiplier: 1,
      },
      couponName: coupon?.code,
      couponDiscountAmount: coupon?.discountAmount,
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
      },
      updatedAt: entity.getUpdatedAt(),
    };
  }
}
