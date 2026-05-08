import {
  DriverDashboardResponseDto,
  DriverInfo,
  AvailabilityInfo,
  CurrentRideInfo,
  PendingRequest,
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
    scheduledRidesCount: number,
  ): DriverDashboardResponseDto {
    return new DriverDashboardResponseDto({
      driver: this.mapDriverInfo(driver, driverUser),
      availability: availability ? this.mapAvailability(availability) : null,
      currentRide: currentRide
        ? this.mapCurrentRide(currentRide, currentRideRiderUser)
        : null,
      pendingRequests: pendingRequests.map((req, idx) =>
        this.mapPendingRequest(req, pendingRequestUsers[idx] ?? null),
      ),
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
      meta: {
        lastUpdated: new Date(),
        serverTime: new Date(),
      },
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
    availability: DriverAvailability,
  ): AvailabilityInfo {
    const recurringSchedule = availability.getRecurringSchedule();
    const availableFrom = recurringSchedule?.validity.startDate ?? new Date();
    const availableTill = recurringSchedule?.validity.endDate ?? new Date();

    return {
      id: availability.getId(),
      status: availability.getStatus(),
      availableFrom,
      availableTill,
      currentLocation: availability.getCurrentLocation(),
      updatedAt: availability.getUpdatedAt(),
    };
  }

  private static mapCurrentRide(
    ride: Ride,
    riderUser: User | null,
  ): CurrentRideInfo {
    const startedAt = ride.getStartedAt() ?? new Date();
    const riderName = riderUser?.getName() ?? "";
    const riderMobile = riderUser?.getMobile() ?? undefined;

    return {
      rideId: ride.getRideId(),
      status:
        ride.getStatus() === RideStatus.STARTED
          ? "Ride started"
          : ride.getStatus(),
      pickup: ride.getPickup(),
      drop: ride.getDrop(),
      rider: {
        id: ride.getRiderId(),
        name: riderName,
        mobile: riderMobile,
      },
      rideType: ride.getRideType(),
      fare: ride.getFare(),
      currency: ride.getCurrency(),
      startedAt,
      timer: this.calculateRideTimer(startedAt),
    };
  }

  private static mapPendingRequest(
    request: RideRequest,
    riderUser: User | null,
  ): PendingRequest {
    const userName = riderUser?.getName() ?? "";

    return {
      requestId: request.getId(),
      pickup: request.getPickup(),
      drop: request.getDrop(),
      pickupTime: request.getPickupTime(),
      rideType: request.getRideType(),
      fare: request.getFare(),
      userName,
      status: request.getStatus(),
      pickupETA: request.getPickupETA(),
    };
  }

  private static calculateRideTimer(startedAt: Date): string {
    const now = new Date();
    const diff = now.getTime() - startedAt.getTime();

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0",
    )}:${String(seconds).padStart(2, "0")}`;
  }
}
