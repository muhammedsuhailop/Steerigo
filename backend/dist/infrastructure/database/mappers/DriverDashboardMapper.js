"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverDashboardMapper = void 0;
const DriverDashboardResponseDto_1 = require("../../../application/dto/driver/DriverDashboardResponseDto");
const RideStatus_1 = require("../../../domain/value-objects/RideStatus");
class DriverDashboardMapper {
    static toResponseDto(driver, driverUser, availability, currentRide, currentRideRiderUser, pendingRequests, pendingRequestUsers, statistics, performance, scheduledRidesCount) {
        return new DriverDashboardResponseDto_1.DriverDashboardResponseDto({
            driver: this.mapDriverInfo(driver, driverUser),
            availability: availability ? this.mapAvailability(availability) : null,
            currentRide: currentRide
                ? this.mapCurrentRide(currentRide, currentRideRiderUser)
                : null,
            pendingRequests: pendingRequests.map((req, idx) => this.mapPendingRequest(req, pendingRequestUsers[idx] ?? null)),
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
    static mapDriverInfo(driver, user) {
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
    static mapAvailability(availability) {
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
    static mapCurrentRide(ride, riderUser) {
        const startedAt = ride.getStartedAt() ?? new Date();
        const riderName = riderUser?.getName() ?? "";
        const riderMobile = riderUser?.getMobile() ?? undefined;
        return {
            rideId: ride.getRideId(),
            status: ride.getStatus() === RideStatus_1.RideStatus.STARTED
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
    static mapPendingRequest(request, riderUser) {
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
    static calculateRideTimer(startedAt) {
        const now = new Date();
        const diff = now.getTime() - startedAt.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    }
}
exports.DriverDashboardMapper = DriverDashboardMapper;
//# sourceMappingURL=DriverDashboardMapper.js.map