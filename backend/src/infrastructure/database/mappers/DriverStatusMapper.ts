import { DriverStatusResponseDto } from "@application/dto/driver/DriverStatusResponseDto";
import { DriverAvailability } from "@domain/entities/DriverAvailability";
export class DriverStatusMapper {
  static toResponseDto(
    driverId: string,
    availability: DriverAvailability
  ): DriverStatusResponseDto {
    const currentLocation = availability.getCurrentLocation();

    return new DriverStatusResponseDto(
      availability.getId(),
      driverId,
      availability.getStatus(),
      availability.getAvailableFrom(),
      availability.getAvailableTill(),
      {
        latitude: currentLocation.getLatitude(),
        longitude: currentLocation.getLongitude(),
        address: currentLocation.getAddress(),
      },
      availability.getUpdatedAt()
    );
  }
}
