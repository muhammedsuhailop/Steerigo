import { injectable, inject } from "inversify";
import { IUseCase } from "../interfaces/IUseCase";
import { GetUserRideByIdDto } from "@application/dto/user/GetUserRideByIdDto";
import {
  GetUserRideByIdResponseDto,
  RideDetails,
  DriverDetails,
  LocationDetails,
  FareDetails,
  TimelineDetails,
  CouponDetails,
} from "@application/dto/user/GetUserRideByIdResponseDto";
import { IRideRepository } from "@domain/repositories/IRideRepository";
import { IDriverRepository } from "@domain/repositories/IDriverRepository";
import { IUserRepository } from "@domain/repositories/IUserRepository";
import { Result } from "@shared/utils/Result";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";
import { RIDE_MESSAGES } from "@shared/constants/RideMessages";
import { Ride } from "@domain/entities/Ride";
import { User } from "@domain/entities/User";
import { Driver } from "@domain/entities/Driver";
import { RideErrors } from "@domain/errors/RideErrors";
import { TaxBreakdown } from "@domain/value-objects/FareBreakdown";
import { IRatingRepository } from "@domain/repositories/IRatingRepository";
import { Rating } from "@domain/entities/Rating";
import { ReviewType } from "@domain/value-objects/ReviewType";

@injectable()
export class GetUserRideByIdUseCase
  implements
    IUseCase<GetUserRideByIdDto, Promise<Result<GetUserRideByIdResponseDto>>>
{
  constructor(
    @inject(TYPES.RideRepository)
    private rideRepository: IRideRepository,
    @inject(TYPES.DriverRepository)
    private driverRepository: IDriverRepository,
    @inject(TYPES.UserRepository)
    private userRepository: IUserRepository,
    @inject(TYPES.RatingRepository)
    private ratingRepository: IRatingRepository,
  ) {}

  async execute(
    dto: GetUserRideByIdDto,
  ): Promise<Result<GetUserRideByIdResponseDto>> {
    try {
      Logger.info("Fetching user ride by ID", {
        userId: dto.getUserId(),
        rideId: dto.getRideId(),
      });

      const ride = await this.rideRepository.findByRideId(dto.getRideId());
      if (!ride) {
        return Result.failure(RideErrors.rideNotFound(dto.getRideId()));
      }

      if (ride.getRiderId() !== dto.getUserId()) {
        Logger.warn("User attempted to access ride not belonging to them", {
          userId: dto.getUserId(),
          rideId: dto.getRideId(),
          actualRiderId: ride.getRiderId(),
        });
        return Result.failure(
          RideErrors.unauthorizedRideAccess(dto.getRideId()),
        );
      }

      const driver = await this.driverRepository.findById(ride.getDriverId());
      if (!driver) {
        Logger.error("Driver not found for ride", {
          driverId: ride.getDriverId(),
          rideId: dto.getRideId(),
        });
        return Result.failure(
          new Error("Driver information not available for this ride"),
        );
      }

      const driverUser = await this.userRepository.findById(driver.getUserId());
      if (!driverUser) {
        Logger.error("Driver user not found", {
          driverUserId: driver.getUserId(),
          rideId: dto.getRideId(),
        });
        return Result.failure(
          new Error("Driver user information not available for this ride"),
        );
      }

      const ratings = await this.ratingRepository.findAllByRideId(
        ride.getRideId(),
      );

      const riderToDriverRating = ratings.find(
        (r) => r.getReviewType() === ReviewType.USER_REVIEW,
      );

      const rideDetails = this.mapRideToDetails(ride, riderToDriverRating);
      const driverDetails = this.mapDriverToDetails(driver, driverUser);

      const response: GetUserRideByIdResponseDto = {
        success: true,
        message: RIDE_MESSAGES.RIDE_FETCHED_SUCCESSFULLY,
        data: {
          ride: rideDetails,
          driver: driverDetails,
        },
      };

      Logger.info("User ride fetched successfully", {
        userId: dto.getUserId(),
        rideId: dto.getRideId(),
        status: ride.getStatus(),
        driverId: driver.getId().toString(),
      });

      return Result.success(response);
    } catch (error) {
      Logger.error("Error fetching user ride by ID", {
        userId: dto.getUserId(),
        rideId: dto.getRideId(),
        error: error instanceof Error ? error.message : String(error),
      });
      return Result.failure(error as Error);
    }
  }

  private mapRideToDetails(ride: Ride, rating?: Rating): RideDetails {
    const fareBreakdown = ride.getFareBreakdown();
    const timeline = ride.getTimeline();

    const fareTax = fareBreakdown.getFareTax();
    const platformFeeTax = fareBreakdown.getPlatformFeeTax();

    const totalTax =
      (fareTax?.amount.getAmount() ?? 0) +
      (platformFeeTax?.amount.getAmount() ?? 0);

    const fareDetails: FareDetails = {
      baseFare: fareBreakdown.getBaseFare().getAmount(),

      tax: {
        total: totalTax,
      },

      platformFee: fareBreakdown.getPlatformFee().getAmount(),

      totalFare: fareBreakdown.getTotalFare().getAmount(),

      currency: ride.getCurrency(),

      payableAmount: ride.getPayableAmount(),
    };

    const timelineDetails: TimelineDetails = {
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

    const pickupLocation: LocationDetails = {
      latitude: ride.getPickup().getLatitude(),
      longitude: ride.getPickup().getLongitude(),
      address: ride.getPickup().getAddress(),
    };

    const dropLocation: LocationDetails = {
      latitude: ride.getDrop().getLatitude(),
      longitude: ride.getDrop().getLongitude(),
      address: ride.getDrop().getAddress(),
    };

    const couponData = ride.getCouponDetails();
    const couponDetails: CouponDetails | undefined = couponData
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
      couponDetails: couponDetails,
      rating: ratingDetails,
      createdAt: ride.getCreatedAt().toISOString(),
      updatedAt: ride.getUpdatedAt().toISOString(),
    };
  }

  private mapDriverToDetails(driver: Driver, driverUser: User): DriverDetails {
    const driverDetails: DriverDetails = {
      driverId: driver.getId().toString(),
      userId: driver.getUserId(),
      name: driverUser.getName(),
      email: driverUser.getEmail().getValue(),
      phoneNumber: driverUser.getMobile(),
      profilePicture: driverUser.getProfilePicture(),
    };

    return driverDetails;
  }
}
