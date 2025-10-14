import { DriverAvailability } from "@domain/entities/DriverAvailability";
import { IDriverAvailabilityModel } from "../models/DriverAvailabilityModel";
import { AvailabilityStatus } from "@domain/value-objects/AvailabilityStatus";
import { Location } from "@domain/value-objects/Location";
import { Types } from "mongoose";

export class DriverAvailabilityMapper {
  static toDomain(raw: IDriverAvailabilityModel): DriverAvailability {
    const location = Location.create({
      latitude: raw.currentLocation.latitude,
      longitude: raw.currentLocation.longitude,
      address: raw.currentLocation.address,
    });

    return DriverAvailability.fromData({
      id: raw._id,
      driverId: raw.driverId.toString(),
      status: raw.status as AvailabilityStatus,
      availableFrom: raw.availableFrom,
      availableTill: raw.availableTill,
      currentLocation: location,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  static toPersistence(
    availability: DriverAvailability
  ): Partial<IDriverAvailabilityModel> {
    const location = availability.getCurrentLocation();

    return {
      _id: availability.getId(),
      driverId: new Types.ObjectId(availability.getDriverId()),
      status: availability.getStatus(),
      availableFrom: availability.getAvailableFrom(),
      availableTill: availability.getAvailableTill(),
      currentLocation: location.getCoordinates(),
      updatedAt: availability.getUpdatedAt(),
    };
  }
}
