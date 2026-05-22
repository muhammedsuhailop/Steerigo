import { Types } from "mongoose";
import { FutureRideRequest } from "@domain/entities/FutureRideRequest";
import { Location } from "@domain/value-objects/Location";
import { RideType } from "@domain/value-objects/RideType";
import {
  FareBreakdown,
  TaxBreakdown,
} from "@domain/value-objects/FareBreakdown";
import { Money } from "@domain/value-objects/Money";
import { FutureRideRequestStatus } from "@domain/value-objects/FutureRideRequestStatus";
import { IFutureRideRequestDocument } from "../models/FutureRideRequestModel";
import { toObjectId } from "@shared/utils/idHelper";

export class FutureRideRequestMapper {
  static toDomain(doc: IFutureRideRequestDocument): FutureRideRequest {
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

    const baseFare = Money.create(
      doc.fareBreakdown.baseFare.amount,
      doc.fareBreakdown.baseFare.currency,
    );

    const platformFee = Money.create(
      doc.fareBreakdown.platformFee.amount,
      doc.fareBreakdown.platformFee.currency,
    );

    const fareTax: TaxBreakdown = {
      name: doc.fareBreakdown.taxes.fare.name,
      rate: doc.fareBreakdown.taxes.fare.rate,

      amount: Money.create(
        doc.fareBreakdown.taxes.fare.amount.amount,
        doc.fareBreakdown.taxes.fare.amount.currency,
      ),
    };

    const platformFeeTax: TaxBreakdown = {
      name: doc.fareBreakdown.taxes.platformFee.name,
      rate: doc.fareBreakdown.taxes.platformFee.rate,

      amount: Money.create(
        doc.fareBreakdown.taxes.platformFee.amount.amount,
        doc.fareBreakdown.taxes.platformFee.amount.currency,
      ),
    };

    const totalFare = Money.create(
      doc.fareBreakdown.totalFare.amount,
      doc.fareBreakdown.totalFare.currency,
    );

    const fareBreakdown = FareBreakdown.create({
      baseFare,
      platformFee,
      fareTax,
      platformFeeTax,
      totalFare,
      durationHours: doc.fareBreakdown.durationHours,
    });

    return FutureRideRequest.fromData({
      id: doc._id.toString(),
      riderId: doc.riderId.toString(),
      driverId: doc.driverId ? doc.driverId.toString() : null,
      driverUserId: doc.driverUserId ? doc.driverUserId.toString() : null,
      requestGroupId: doc.requestGroupId,
      pickup,
      drop,
      pickupTime: doc.pickupTime,
      requiredDuration: doc.requiredDuration,
      rideType: doc.rideType as RideType,
      fareBreakdown,
      status: doc.status as FutureRideRequestStatus,
      pickupETA: doc.pickupETA,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  static toPersistence(
    entity: FutureRideRequest,
  ): Partial<IFutureRideRequestDocument> {
    const fareBreakdown = entity.getFareBreakdown();

    return {
      _id: entity.getId() ? new Types.ObjectId(entity.getId()) : undefined,
      riderId: toObjectId(entity.getRiderId()),
      driverId: entity.getDriverId() ? toObjectId(entity.getDriverId()!) : null,
      driverUserId: entity.getDriverUserId()
        ? toObjectId(entity.getDriverUserId()!)
        : null,
      requestGroupId: entity.getRequestGroupId(),
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
      requiredDuration: entity.getrequiredDuration(),
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
