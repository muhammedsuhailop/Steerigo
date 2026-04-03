import { Types } from "mongoose";
import { RideRequestGroup } from "@domain/entities/RideRequestGroup";
import { Location } from "@domain/value-objects/Location";
import { RideType } from "@domain/value-objects/RideType";
import { RideRequestGroupStatus } from "@domain/value-objects/RideRequestGroupStatus";
import { IRideRequestGroupDocument } from "../models/RideRequestGroupModel";
import { toObjectId } from "@shared/utils/idHelper";

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

    return RideRequestGroup.fromData({
      id: doc._id.toString(),
      riderId: doc.riderId.toString(),
      pickup,
      drop,
      rideType: doc.rideType as RideType,
      estimatedFareAmount: doc.estimatedFare.amount,
      estimatedFareCurrency: doc.estimatedFare.currency,
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
      rideType: entity.getRideType(),
      estimatedFare: {
        amount: entity.getEstimatedFareAmount(),
        currency: entity.getEstimatedFareCurrency(),
      },
      candidateDriverIds,
      currentIndex: entity.getCurrentIndex(),
      status: entity.getStatus(),
    };
  }
}
