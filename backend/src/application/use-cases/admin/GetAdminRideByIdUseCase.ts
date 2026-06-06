import { injectable, inject } from "inversify";
import { IUseCase } from "../interfaces/IUseCase";
import { Result } from "@shared/utils/Result";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";
import { IRideRepository } from "@domain/repositories/IRideRepository";
import { IRatingRepository } from "@domain/repositories/IRatingRepository";
import { IUserRepository } from "@domain/repositories/IUserRepository";
import { RideErrors } from "@domain/errors/RideErrors";
import { GetAdminRideByIdDto } from "@application/dto/admin/GetAdminRideByIdDto";
import {
  RideDetails,
  RiderDetails,
  FareDetails,
  TimelineDetails,
  CouponDetails,
  RatingDetails,
  GetAdminRideByIdResponseDto,
  DriverDetails,
} from "@application/dto/admin/GetAdminRideByIdResponseDto";
import { Rating } from "@domain/entities/Rating";
import { Ride } from "@domain/entities/Ride";
import { User } from "@domain/entities";
import { IDriverRepository } from "@domain/repositories/IDriverRepository";
import { Driver } from "@domain/entities/Driver";

@injectable()
export class GetAdminRideByIdUseCase
  implements
    IUseCase<GetAdminRideByIdDto, Promise<Result<GetAdminRideByIdResponseDto>>>
{
  constructor(
    @inject(TYPES.RideRepository)
    private readonly rideRepository: IRideRepository,
    @inject(TYPES.RatingRepository)
    private readonly ratingRepository: IRatingRepository,
    @inject(TYPES.UserRepository)
    private readonly userRepository: IUserRepository,
    @inject(TYPES.DriverRepository)
    private readonly driverRepository: IDriverRepository,
  ) {}

  async execute(
    dto: GetAdminRideByIdDto,
  ): Promise<Result<GetAdminRideByIdResponseDto>> {
    const { rideId } = dto;

    try {
      Logger.info("Admin get ride by ID requested", { rideId });

      const ride = await this.rideRepository.findByRideId(rideId);
      if (!ride) {
        return Result.failure(RideErrors.rideNotFound(rideId));
      }

      const rider = await this.userRepository.findById(ride.getRiderId());
      if (!rider) {
        return Result.failure(RideErrors.rideNotFound(rideId));
      }

      const driverId = ride.getDriverId();
      if (!driverId) {
        return Result.failure(
          new Error(`Ride ${rideId} does not have an assigned driver.`),
        );
      }

      const driver = await this.driverRepository.findById(driverId);
      if (!driver) {
        return Result.failure(
          new Error(`Driver record not found for ID: ${driverId}`),
        );
      }

      const driverUserAccount = await this.userRepository.findById(
        driver.getUserId(),
      );
      if (!driverUserAccount) {
        return Result.failure(
          new Error(`User account profile not found for driver: ${driverId}`),
        );
      }

      const ratings = await this.ratingRepository.findAllByRideId(rideId);
      const riderRating = ratings.find(
        (r: Rating) => r.getRevieweeId() === ride.getDriverId(),
      );

      const rideDetails = this.buildRideDetails(ride, riderRating);
      const riderDetails = this.buildRiderDetails(ride.getRiderId(), rider);
      const driverDetails = this.buildDriverDetails(driver, driverUserAccount);

      Logger.info("Admin ride fetched successfully", { rideId });

      return Result.success({
        ride: rideDetails,
        rider: riderDetails,
        driver: driverDetails,
      });
    } catch (error) {
      Logger.error("Error fetching admin ride by ID", {
        rideId,
        error: error instanceof Error ? error.message : String(error),
      });

      return Result.failure(error as Error);
    }
  }

  private buildRideDetails(ride: Ride, rating?: Rating): RideDetails {
    const fareBreakdown = ride.getFareBreakdown();
    const timeline = ride.getTimeline();
    const coupon = ride.getCouponDetails();

    const fare: FareDetails = {
      baseFare: fareBreakdown.getBaseFare().getAmount(),
      tax: {
        total: fareBreakdown.getFareTax().amount,
      },
      platformFee: fareBreakdown.getPlatformFee().getAmount(),
      totalFare: fareBreakdown.getTotalFare().getAmount(),
      payableAmount: ride.getPayableAmount(),
      currency: ride.getCurrency(),
    };

    const timelineDetails: TimelineDetails = {
      requestedAt: ride.getCreatedAt().toISOString(),
      acceptedAt: timeline.getAcceptedAt()?.toISOString(),
      arrivedAt: ride.getArrivedAt()?.toISOString(),
      startedAt: ride.getStartedAt()?.toISOString(),
      completedAt: ride.getCompletedAt()?.toISOString(),
      cancelledAt: ride.getCancelledAt()?.toISOString(),
    };

    const couponDetails: CouponDetails | undefined = coupon
      ? {
          couponCode: coupon.code,
          discountType: coupon.discountType,
          discountAmount: coupon.discountAmount,
        }
      : undefined;

    const ratingDetails: RatingDetails | undefined = rating
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

  private buildRiderDetails(riderId: string, rider: User): RiderDetails {
    return {
      id: riderId,
      name: rider.getName(),
      email: rider.getEmailValue(),
      phoneNumber: rider.getMobile(),
      profilePicture: rider.getProfilePicture?.(),
    };
  }

  private buildDriverDetails(
    driver: Driver,
    driverUserAccount: User,
  ): DriverDetails {
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
}
