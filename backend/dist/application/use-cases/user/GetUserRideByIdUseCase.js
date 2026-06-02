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
exports.GetUserRideByIdUseCase = void 0;
const inversify_1 = require("inversify");
const Result_1 = require("../../../shared/utils/Result");
const Logger_1 = require("../../../shared/utils/Logger");
const DITypes_1 = require("../../../shared/constants/DITypes");
const RideMessages_1 = require("../../../shared/constants/RideMessages");
const RideErrors_1 = require("../../../domain/errors/RideErrors");
const ReviewType_1 = require("../../../domain/value-objects/ReviewType");
let GetUserRideByIdUseCase = class GetUserRideByIdUseCase {
    constructor(rideRepository, driverRepository, userRepository, ratingRepository) {
        this.rideRepository = rideRepository;
        this.driverRepository = driverRepository;
        this.userRepository = userRepository;
        this.ratingRepository = ratingRepository;
    }
    async execute(dto) {
        try {
            Logger_1.Logger.info("Fetching user ride by ID", {
                userId: dto.getUserId(),
                rideId: dto.getRideId(),
            });
            const ride = await this.rideRepository.findByRideId(dto.getRideId());
            if (!ride) {
                return Result_1.Result.failure(RideErrors_1.RideErrors.rideNotFound(dto.getRideId()));
            }
            if (ride.getRiderId() !== dto.getUserId()) {
                Logger_1.Logger.warn("User attempted to access ride not belonging to them", {
                    userId: dto.getUserId(),
                    rideId: dto.getRideId(),
                    actualRiderId: ride.getRiderId(),
                });
                return Result_1.Result.failure(RideErrors_1.RideErrors.unauthorizedRideAccess(dto.getRideId()));
            }
            const driver = await this.driverRepository.findById(ride.getDriverId());
            if (!driver) {
                Logger_1.Logger.error("Driver not found for ride", {
                    driverId: ride.getDriverId(),
                    rideId: dto.getRideId(),
                });
                return Result_1.Result.failure(new Error("Driver information not available for this ride"));
            }
            const driverUser = await this.userRepository.findById(driver.getUserId());
            if (!driverUser) {
                Logger_1.Logger.error("Driver user not found", {
                    driverUserId: driver.getUserId(),
                    rideId: dto.getRideId(),
                });
                return Result_1.Result.failure(new Error("Driver user information not available for this ride"));
            }
            const ratings = await this.ratingRepository.findAllByRideId(ride.getRideId());
            const riderToDriverRating = ratings.find((r) => r.getReviewType() === ReviewType_1.ReviewType.USER_REVIEW);
            const rideDetails = this.mapRideToDetails(ride, riderToDriverRating);
            const driverDetails = this.mapDriverToDetails(driver, driverUser);
            const response = {
                success: true,
                message: RideMessages_1.RIDE_MESSAGES.RIDE_FETCHED_SUCCESSFULLY,
                data: {
                    ride: rideDetails,
                    driver: driverDetails,
                },
            };
            Logger_1.Logger.info("User ride fetched successfully", {
                userId: dto.getUserId(),
                rideId: dto.getRideId(),
                status: ride.getStatus(),
                driverId: driver.getId().toString(),
            });
            return Result_1.Result.success(response);
        }
        catch (error) {
            Logger_1.Logger.error("Error fetching user ride by ID", {
                userId: dto.getUserId(),
                rideId: dto.getRideId(),
                error: error instanceof Error ? error.message : String(error),
            });
            return Result_1.Result.failure(error);
        }
    }
    mapRideToDetails(ride, rating) {
        const fareBreakdown = ride.getFareBreakdown();
        const timeline = ride.getTimeline();
        const fareTax = fareBreakdown.getFareTax();
        const platformFeeTax = fareBreakdown.getPlatformFeeTax();
        const totalTax = (fareTax?.amount.getAmount() ?? 0) +
            (platformFeeTax?.amount.getAmount() ?? 0);
        const fareDetails = {
            baseFare: fareBreakdown.getBaseFare().getAmount(),
            tax: {
                total: totalTax,
            },
            platformFee: fareBreakdown.getPlatformFee().getAmount(),
            totalFare: fareBreakdown.getTotalFare().getAmount(),
            currency: ride.getCurrency(),
            payableAmount: ride.getPayableAmount(),
        };
        const timelineDetails = {
            requestedAt: timeline.getRequestedAt().toISOString(),
            acceptedAt: timeline.getAcceptedAt()?.toISOString(),
            arrivedAt: timeline.getArrivedAt()?.toISOString(),
            startedAt: timeline.getStartedAt()?.toISOString(),
            completedAt: timeline.getCompletedAt()?.toISOString(),
            cancelledAt: timeline.getCancelledAt()?.toISOString(),
            paymentInitiatedAt: timeline.getPaymentInitiatedAt()?.toISOString(),
            paymentCompletedAt: timeline.getPaymentCompletedAt()?.toISOString(),
            paymentFailedAt: timeline.getPaymentFailedAt()?.toISOString(),
            paymentRefundedAt: timeline.getPaymentRefundedAt()?.toISOString(),
        };
        const pickupLocation = {
            latitude: ride.getPickup().getLatitude(),
            longitude: ride.getPickup().getLongitude(),
            address: ride.getPickup().getAddress(),
        };
        const dropLocation = {
            latitude: ride.getDrop().getLatitude(),
            longitude: ride.getDrop().getLongitude(),
            address: ride.getDrop().getAddress(),
        };
        const couponData = ride.getCouponDetails();
        const couponDetails = couponData
            ? {
                couponCode: couponData.code,
                discountType: couponData.discountType,
                discountAmount: couponData.discountAmount,
            }
            : undefined;
        const ratingDetails = rating
            ? {
                overallRating: rating.getOverallRating(),
                reviewType: rating.getReviewType(),
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
            pickup: pickupLocation,
            drop: dropLocation,
            distance: ride.getPickup().distanceTo(ride.getDrop()),
            fare: fareDetails,
            timeline: timelineDetails,
            verificationCode: ride.getVerificationCode(),
            couponDetails: couponDetails,
            rating: ratingDetails,
            createdAt: ride.getCreatedAt().toISOString(),
            updatedAt: ride.getUpdatedAt().toISOString(),
        };
    }
    mapDriverToDetails(driver, driverUser) {
        const driverDetails = {
            driverId: driver.getId().toString(),
            userId: driver.getUserId(),
            name: driverUser.getName(),
            email: driverUser.getEmail().getValue(),
            phoneNumber: driverUser.getMobile(),
            profilePicture: driverUser.getProfilePicture(),
            rating: driver.getAverageRating(),
            totalRides: driver.getTotalRides(),
        };
        return driverDetails;
    }
};
exports.GetUserRideByIdUseCase = GetUserRideByIdUseCase;
exports.GetUserRideByIdUseCase = GetUserRideByIdUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.RideRepository)),
    __param(1, (0, inversify_1.inject)(DITypes_1.TYPES.DriverRepository)),
    __param(2, (0, inversify_1.inject)(DITypes_1.TYPES.UserRepository)),
    __param(3, (0, inversify_1.inject)(DITypes_1.TYPES.RatingRepository)),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], GetUserRideByIdUseCase);
//# sourceMappingURL=GetUserRideByIdUseCase.js.map