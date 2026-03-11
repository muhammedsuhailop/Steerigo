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

    const baseFare = Money.create(doc.fareBreakdown.baseFare, doc.currency);
    const platformFee = Money.create(0, doc.currency);

    const totalFareAmount =
      doc.fareBreakdown.baseFare +
      doc.fareBreakdown.distanceFare +
      doc.fareBreakdown.timeFare +
      doc.fareBreakdown.tax;

    const fareTax: TaxBreakdown = {
      name: "GST",
      rate: 18,
      amount: Money.create(doc.fareBreakdown.tax, doc.currency),
    };

    const platformFeeTax: TaxBreakdown = {
      name: "GST",
      rate: 18,
      amount: Money.create(0, doc.currency),
    };

    const totalFare = Money.create(totalFareAmount, doc.currency);

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

    return Ride.fromData({
      id: doc._id.toString(),
      rideId: doc.rideId,
      driverId: doc.driverId.toString(),
      riderId: doc.riderId.toString(),
      status: doc.status as RideStatus,
      pickup,
      drop,
      rideType: doc.rideType as RideType,
      fareBreakdown,
      currency: doc.currency,
      timeline,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  static toPersistence(entity: Ride): Partial<IRideDocument> {
    const fareBreakdown = entity.getFareBreakdown();
    const timeline = entity.getTimeline();

    const baseFareAmount = fareBreakdown.getBaseFare().getAmount();
    const platformFeeAmount = fareBreakdown.getPlatformFee().getAmount();
    const taxAmount =
      fareBreakdown.getFareTax().amount.getAmount() +
      fareBreakdown.getPlatformFeeTax().amount.getAmount();
    const totalFareAmount = fareBreakdown.getTotalFare().getAmount();

    const distanceFare = 0;
    const timeFare = 0;
    return {
      rideId: entity.getRideId(),
      driverId: toObjectId(entity.getDriverId()),
      riderId: toObjectId(entity.getRiderId()),
      status: entity.getStatus(),
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
        baseFare: baseFareAmount,
        distanceFare: distanceFare,
        timeFare: timeFare,
        tax: taxAmount,
        surgeMultiplier: 1,
      },
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
