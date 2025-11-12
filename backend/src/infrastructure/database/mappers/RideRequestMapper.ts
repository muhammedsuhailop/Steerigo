import { RideRequest } from "@domain/entities/RideRequest";
import { Location } from "@domain/value-objects/Location";
import { RideRequestStatus } from "@domain/value-objects/RideRequestStatus";
import { RideType } from "@domain/value-objects/RideType";
import { IRideRequestDocument } from "../models/RideRequestModel";

export class RideRequestMapper {
  static toDomain(doc: IRideRequestDocument): RideRequest {
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

    return RideRequest.fromData({
      id: doc.id.toString(),
      requestId: doc.requestId,
      driverId: doc.driverId.toString(),
      riderId: doc.riderId.toString(),
      pickup,
      drop,
      pickupTime: doc.pickupTime,
      rideType: doc.rideType as RideType,
      fare: doc.fare,
      status: doc.status as RideRequestStatus,
      pickupETA: doc.pickupETA,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  static toPersistence(entity: RideRequest): any {
    return {
      _id: entity.getId(),
      requestId: entity.getRequestId(),
      driverId: entity.getDriverId(),
      riderId: entity.getRiderId(),
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
      rideType: entity.getRideType(),
      fare: entity.getFare(),
      status: entity.getStatus(),
      pickupETA: entity.getPickupETA(),
      createdAt: entity.getCreatedAt(),
      updatedAt: entity.getUpdatedAt(),
    };
  }
}
