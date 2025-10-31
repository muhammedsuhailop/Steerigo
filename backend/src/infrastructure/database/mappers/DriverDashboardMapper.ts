import {
  DriverDashboardResponseDto,
  DriverInfo,
  AvailabilityInfo,
  CurrentRideInfo,
  PendingRequest,
  DashboardMeta,
} from "@application/dto/driver/DriverDashboardResponseDto";
import { Driver } from "@domain/entities/Driver";
import { DriverAvailability } from "@domain/entities/DriverAvailability";
import { Ride } from "@domain/entities/Ride";
import { RideRequest } from "@domain/entities/RideRequest";
import { DriverDashboardStatistics } from "@domain/value-objects/DriverDashboardStatistics";
import { DriverDashboardPerformance } from "@domain/value-objects/DriverDashboardPerformance";
import { User } from "@domain/entities/User";
import { RideStatus } from "@domain/value-objects/RideStatus";

export class DriverDashboardMapper {
  static toResponseDto(
    driver: Driver,
    driverUser: User,
    availability: DriverAvailability | null,
    currentRide: Ride | null,
    currentRideRiderUser: User | null,
    pendingRequests: RideRequest[],
    pendingRequestUsers: (User | null)[],
    statistics: DriverDashboardStatistics,
    performance: DriverDashboardPerformance,
    scheduledRidesCount: number
  ): DriverDashboardResponseDto {
    const driverInfo = this.mapDriverInfo(driver, driverUser);
    const availabilityInfo = availability
      ? this.mapAvailability(availability)
      : null;
    const currentRideInfo = currentRide
      ? this.mapCurrentRide(currentRide, currentRideRiderUser)
      : null;
    const pendingRequestsInfo = pendingRequests.map((req, index) =>
      this.mapPendingRequest(req, pendingRequestUsers[index])
    );

    const meta: DashboardMeta = {
      lastUpdated: new Date(),
      serverTime: new Date(),
    };

    return new DriverDashboardResponseDto({
      driver: driverInfo,
      availability: availabilityInfo,
      currentRide: currentRideInfo,
      pendingRequests: pendingRequestsInfo,
      statistics: {
        ridesCompleted: statistics.getRidesCompleted(),
        ridesCancelled: statistics.getRidesCancelled(),
        scheduledRides: scheduledRidesCount,
        totalEarnings: statistics.getTotalEarnings(),
        currency: "INR",
      },
      performance: {
        acceptanceRate: performance.getAcceptanceRate(),
        cancellationRate: performance.getCancellationRate(),
        averageRating: performance.getAverageRating(),
      },
      meta,
    });
  }

  private static mapDriverInfo(driver: Driver, user: User): DriverInfo {
    return {
      driverId: driver.getId(),
      userId: user.getId(),
      name: user.getName(),
      email: user.getEmail(),
      mobile: user.getMobile(),
      licenseNumber: driver.getLicenseNumber(),
      licenceCategory: driver.getLicenceCategory(),
      licenseIssueDate: driver.getLicenseIssueDate(),
      licenseExpiryDate: driver.getLicenseExpiryDate(),
      kycStatus: driver.getKycStatus(),
      status: driver.getStatus(),
      eligibleGearTypes: driver.getEligibleGearTypes(),
      eligibleBodyTypes: driver.getEligibleBodyTypes(),
    };
  }

  private static mapAvailability(
    availability: DriverAvailability
  ): AvailabilityInfo {
    const location = availability.getCurrentLocation();

    return {
      id: availability.getId(),
      status: availability.getStatus(),
      availableFrom: availability.getAvailableFrom(),
      availableTill: availability.getAvailableTill(),
      currentLocation: location,
      updatedAt: availability.getUpdatedAt(),
    };
  }

  private static mapCurrentRide(
    ride: Ride,
    riderUser: User | null
  ): CurrentRideInfo {
    const timer = ride.getStartedAt()
      ? this.calculateTimer(ride.getStartedAt())
      : "00:00:00";
    const pickup = ride.getPickup();
    const drop = ride.getDrop();

    return {
      rideId: ride.getRideId(),
      status:
        ride.getStatus() === RideStatus.STARTED
          ? "Ride started"
          : ride.getStatus(),
      pickup: pickup,
      drop: drop,
      rider: {
        id: ride.getRiderId(),
        name: riderUser ? riderUser.getName() : "",
        mobile: riderUser ? riderUser.getMobile() : "",
      },
      rideType: ride.getRideType(),
      fare: ride.getFare(),
      currency: ride.getCurrency(),
      startedAt: ride.getStartedAt() || new Date(),
      timer,
    };
  }

  private static mapPendingRequest(
    request: RideRequest,
    riderUser: User | null
  ): PendingRequest {
    return {
      requestId: request.getRequestId(),
      pickup: request.getPickup(),
      drop: request.getDrop(),
      pickupTime: request.getPickupTime(),
      rideType: request.getRideType(),
      fare: request.getFare(),
      userName: riderUser ? riderUser.getName() : "",
      status: request.getStatus(),
      pickupETA: request.getPickupETA(),
    };
  }

  private static calculateTimer(startedAt: Date | undefined): string {
    if (!startedAt) return "00:00:00";

    const now = new Date();
    const diff = now.getTime() - startedAt.getTime();

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(
      seconds
    ).padStart(2, "0")}`;
  }
}
