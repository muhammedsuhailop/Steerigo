import { injectable, inject } from "inversify";
import { IUseCase } from "../interfaces/IUseCase";
import { GetDriverRideByIdDto } from "@application/dto/driver/GetDriverRideByIdDto";
import {
  GetDriverRideByIdResponseDto,
  RideDetails,
  RiderDetails,
  LocationDetails,
  FareDetails,
  TimelineDetails,
  CouponDetails,
} from "@application/dto/driver/GetDriverRideByIdResponseDto";
import { IRideRepository } from "@domain/repositories/IRideRepository";
import { IDriverRepository } from "@domain/repositories/IDriverRepository";
import { IUserRepository } from "@domain/repositories/IUserRepository";
import { Result } from "@shared/utils/Result";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";
import { DriverNotFoundError } from "@domain/errors/DriverNotFoundError";
import { Ride } from "@domain/entities/Ride";
import { User } from "@domain/entities/User";
import { RideErrors } from "@domain/errors/RideErrors";
import { IRatingRepository } from "@domain/repositories/IRatingRepository";
import { ReviewType } from "@domain/value-objects/ReviewType";
import { Rating } from "@domain/entities/Rating";

@injectable()
export class GetDriverRideByIdUseCase
  implements
    IUseCase<
      GetDriverRideByIdDto,
      Promise<Result<GetDriverRideByIdResponseDto>>
    >
{
  constructor(
    @inject(TYPES.DriverRepository)
    private driverRepository: IDriverRepository,
    @inject(TYPES.RideRepository)
    private rideRepository: IRideRepository,
    @inject(TYPES.UserRepository)
    private userRepository: IUserRepository,
    @inject(TYPES.RatingRepository)
    private ratingRepository: IRatingRepository,
  ) {}

  async execute(
    dto: GetDriverRideByIdDto,
  ): Promise<Result<GetDriverRideByIdResponseDto>> {
    try {
      Logger.info("Fetching driver ride by ID", {
        userId: dto.getUserId(),
        rideId: dto.getRideId(),
      });

      const driver = await this.driverRepository.findByUserId(dto.getUserId());
      if (!driver) {
        return Result.failure(new DriverNotFoundError(dto.getUserId()));
      }

      const driverId = driver.getId().toString();
      Logger.debug("Driver found for user", {
        userId: dto.getUserId(),
        driverId,
      });

      const ride = await this.rideRepository.findByRideId(dto.getRideId());
      if (!ride) {
        return Result.failure(RideErrors.rideNotFound(dto.getRideId()));
      }

      if (ride.getDriverId() !== driverId) {
        Logger.warn("Driver attempted to access ride not assigned to them", {
          driverId,
          rideId: dto.getRideId(),
          actualDriverId: ride.getDriverId(),
        });

        return Result.failure(
          RideErrors.unauthorizedRideAccess(dto.getRideId()),
        );
      }

      const rider = await this.userRepository.findById(ride.getRiderId());
      if (!rider) {
        Logger.error("Rider not found for ride", {
          riderId: ride.getRiderId(),
          rideId: dto.getRideId(),
        });
        return Result.failure(
          new Error("Rider information not available for this ride"),
        );
      }

      const ratings = await this.ratingRepository.findAllByRideId(
        ride.getRideId(),
      );

      const riderToDriverRating = ratings.find(
        (r) => r.getReviewType() === ReviewType.USER_REVIEW,
      );

      const rideDetails = this.mapRideToDetails(ride, riderToDriverRating);
      const riderDetails = this.mapRiderToDetails(rider);

      const response: GetDriverRideByIdResponseDto = {
        ride: rideDetails,
        rider: riderDetails,
      };

      Logger.info("Driver ride fetched successfully", {
        userId: dto.getUserId(),
        rideId: dto.getRideId(),
        status: ride.getStatus(),
      });

      return Result.success(response);
    } catch (error) {
      Logger.error("Error fetching driver ride by ID", {
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
          criteria: rating.getCriteria().toObject(),
          review: rating.getReview(),
          reviewerName: rating.getReviewerName(),
          createdAt: rating.getCreatedAt().toISOString(),
        }
      : undefined;

    return {
      id: ride.getId(),
      rideId: ride.getRideId(),
      driverId: ride.getDriverId(),
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

  private mapRiderToDetails(rider: User): RiderDetails {
    return {
      id: rider.getId().toString(),
      name: rider.getName(),
      email: rider.getEmail().getValue(),
      phoneNumber: rider.getMobile(),
      profilePicture: rider.getProfilePicture(),
    };
  }
}
