import { Types } from "mongoose";
import { RideRequestGroup } from "@domain/entities/RideRequestGroup";
import { Location } from "@domain/value-objects/Location";
import { RideType } from "@domain/value-objects/RideType";
import { RideRequestGroupStatus } from "@domain/value-objects/RideRequestGroupStatus";
import { IRideRequestGroupDocument } from "../models/RideRequestGroupModel";
import { toObjectId } from "@shared/utils/idHelper";
import { FareBreakdown } from "@domain/value-objects/FareBreakdown";
import { Money } from "@domain/value-objects/Money";

export class RideRequestGroupMapper {
  static toDomain(doc: IRideRequestGroupDocument): RideRequestGroup {
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

    const fareBreakdown = FareBreakdown.create({
      baseFare: Money.create(
        doc.fareBreakdown.baseFare.amount,
        doc.fareBreakdown.baseFare.currency,
      ),
      platformFee: Money.create(
        doc.fareBreakdown.platformFee.amount,
        doc.fareBreakdown.platformFee.currency,
      ),
      fareTax: {
        name: doc.fareBreakdown.taxes.fare.name,
        rate: doc.fareBreakdown.taxes.fare.rate,
        amount: Money.create(
          doc.fareBreakdown.taxes.fare.amount.amount,
          doc.fareBreakdown.taxes.fare.amount.currency,
        ),
      },
      platformFeeTax: {
        name: doc.fareBreakdown.taxes.platformFee.name,
        rate: doc.fareBreakdown.taxes.platformFee.rate,
        amount: Money.create(
          doc.fareBreakdown.taxes.platformFee.amount.amount,
          doc.fareBreakdown.taxes.platformFee.amount.currency,
        ),
      },
      totalFare: Money.create(
        doc.fareBreakdown.totalFare.amount,
        doc.fareBreakdown.totalFare.currency,
      ),
      durationHours: doc.fareBreakdown.durationHours,
      calculatedAt: doc.fareBreakdown.calculatedAt,
    });

    return RideRequestGroup.fromData({
      id: doc._id.toString(),
      riderId: doc.riderId.toString(),
      pickup,
      drop,
      timeRequired: doc.timeRequired,
      rideType: doc.rideType as RideType,
      fareBreakdown,
      candidateDriverIds: doc.candidateDriverIds.map((id) => id.toString()),
      currentIndex: doc.currentIndex,
      status: doc.status as RideRequestGroupStatus,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  static toPersistence(
    entity: RideRequestGroup,
  ): Partial<IRideRequestGroupDocument> {
    const pickup = entity.getPickup();
    const drop = entity.getDrop();

    const candidateDriverIds = entity
      .getCandidateDriverIds()
      .map((id) => toObjectId(id));

    return {
      _id: entity.getId() ? new Types.ObjectId(entity.getId()) : undefined,
      riderId: toObjectId(entity.getRiderId()),
      pickup: {
        latitude: pickup.getLatitude(),
        longitude: pickup.getLongitude(),
        address: pickup.getAddress() as string,
      },
      drop: {
        latitude: drop.getLatitude(),
        longitude: drop.getLongitude(),
        address: drop.getAddress() as string,
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
