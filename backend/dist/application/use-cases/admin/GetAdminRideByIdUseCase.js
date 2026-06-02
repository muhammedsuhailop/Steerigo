"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAdminRideByIdUseCase = void 0;
const inversify_1 = require("inversify");
const Result_1 = require("@shared/utils/Result");
const Logger_1 = require("@shared/utils/Logger");
const DITypes_1 = require("@shared/constants/DITypes");
const RideErrors_1 = require("@domain/errors/RideErrors");
const RideMessages_1 = require("@shared/constants/RideMessages");
let GetAdminRideByIdUseCase = class GetAdminRideByIdUseCase {
    constructor(rideRepository, ratingRepository, userRepository, driverRepository) {
        this.rideRepository = rideRepository;
        this.ratingRepository = ratingRepository;
        this.userRepository = userRepository;
        this.driverRepository = driverRepository;
    }
    async execute(dto) {
        const { rideId } = dto;
        try {
            Logger_1.Logger.info("Admin get ride by ID requested", { rideId });
            const ride = await this.rideRepository.findByRideId(rideId);
            if (!ride) {
                return Result_1.Result.failure(RideErrors_1.RideErrors.rideNotFound(rideId));
            }
            const rider = await this.userRepository.findById(ride.getRiderId());
            if (!rider) {
                return Result_1.Result.failure(RideErrors_1.RideErrors.rideNotFound(rideId));
            }
            const driverId = ride.getDriverId();
            if (!driverId) {
                return Result_1.Result.failure(new Error(`Ride ${rideId} does not have an assigned driver.`));
            }
            const driver = await this.driverRepository.findById(driverId);
            if (!driver) {
                return Result_1.Result.failure(new Error(`Driver record not found for ID: ${driverId}`));
            }
            const driverUserAccount = await this.userRepository.findById(driver.getUserId());
            if (!driverUserAccount) {
                return Result_1.Result.failure(new Error(`User account profile not found for driver: ${driverId}`));
            }
            const ratings = await this.ratingRepository.findAllByRideId(rideId);
            const riderRating = ratings.find((r) => r.getRevieweeId() === ride.getDriverId());
            const rideDetails = this.buildRideDetails(ride, riderRating);
            const riderDetails = this.buildRiderDetails(ride.getRiderId(), rider);
            const driverDetails = this.buildDriverDetails(driver, driverUserAccount);
            Logger_1.Logger.info("Admin ride fetched successfully", { rideId });
            return Result_1.Result.success({
                success: true,
                message: RideMessages_1.RIDE_MESSAGES.RIDE_FETCHED_SUCCESSFULLY,
                data: {
                    ride: rideDetails,
                    rider: riderDetails,
                    driver: driverDetails,
                },
            });
        }
        catch (error) {
            Logger_1.Logger.error("Error fetching admin ride by ID", {
                rideId,
                error: error instanceof Error ? error.message : String(error),
            });
            return Result_1.Result.failure(error);
        }
    }
    buildRideDetails(ride, rating) {
        const fareBreakdown = ride.getFareBreakdown();
        const timeline = ride.getTimeline();
        const coupon = ride.getCouponDetails();
        const fare = {
            baseFare: fareBreakdown.getBaseFare().getAmount(),
            tax: {
                total: fareBreakdown.getFareTax().amount,
            },
            platformFee: fareBreakdown.getPlatformFee().getAmount(),
            totalFare: fareBreakdown.getTotalFare().getAmount(),
            payableAmount: ride.getPayableAmount(),
            currency: ride.getCurrency(),
        };
        const timelineDetails = {
            requestedAt: ride.getCreatedAt().toISOString(),
            acceptedAt: timeline.getAcceptedAt()?.toISOString(),
            arrivedAt: ride.getArrivedAt()?.toISOString(),
            startedAt: ride.getStartedAt()?.toISOString(),
            completedAt: ride.getCompletedAt()?.toISOString(),
            cancelledAt: ride.getCancelledAt()?.toISOString(),
        };
        const couponDetails = coupon
            ? {
                couponCode: coupon.code,
                discountType: coupon.discountType,
                discountAmount: coupon.discountAmount,
            }
            : undefined;
        const ratingDetails = rating
            ? {
                overallRating: rating.getOverallRating(),
                reviewType: rating.getReviewType(),
                criteria: rating.getCriteria().toObject(),
                review: rating.getReview(),
                reviewerName: rating.getReviewerName(),
                createdAt: rating.getCreatedAt().toISOString(),
            }
            : undefined;
        return {
            id: ride.getId(),
            rideId: ride.getRideId(),
            status: ride.getStatus(),
            paymentStatus: ride.getPaymentStatus(),
            rideType: ride.getRideType(),
            pickup: {
                latitude: ride.getPickup().getLatitude(),
                longitude: ride.getPickup().getLongitude(),
                address: ride.getPickup().getAddress(),
            },
            drop: {
                latitude: ride.getDrop().getLatitude(),
                longitude: ride.getDrop().getLongitude(),
                address: ride.getDrop().getAddress(),
            },
            fare,
            timeline: timelineDetails,
            couponDetails,
            rating: ratingDetails,
            createdAt: ride.getCreatedAt().toISOString(),
            updatedAt: ride.getUpdatedAt().toISOString(),
        };
    }
    buildRiderDetails(riderId, rider) {
        return {
            id: riderId,
            name: rider.getName(),
            email: rider.getEmailValue(),
            phoneNumber: rider.getMobile(),
            profilePicture: rider.getProfilePicture?.(),
        };
    }
    buildDriverDetails(driver, driverUserAccount) {
        return {
            id: driver.getId(),
            userId: driver.getUserId(),
            name: driverUserAccount.getName(),
            email: driverUserAccount.getEmailValue(),
            phoneNumber: driverUserAccount.getMobile(),
            profilePicture: driverUserAccount.getProfilePicture?.(),
            status: driver.getStatus(),
            kycStatus: driver.getKycStatus(),
            averageRating: driver.getAverageRating(),
            totalRides: driver.getTotalRides(),
        };
    }
};
exports.GetAdminRideByIdUseCase = GetAdminRideByIdUseCase;
exports.GetAdminRideByIdUseCase = GetAdminRideByIdUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.RideRepository)),
    __param(1, (0, inversify_1.inject)(DITypes_1.TYPES.RatingRepository)),
    __param(2, (0, inversify_1.inject)(DITypes_1.TYPES.UserRepository)),
    __param(3, (0, inversify_1.inject)(DITypes_1.TYPES.DriverRepository)),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], GetAdminRideByIdUseCase);
//# sourceMappingURL=GetAdminRideByIdUseCase.js.map