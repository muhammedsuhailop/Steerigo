import { injectable, inject } from "inversify";
import { TYPES } from "@shared/constants/DITypes";
import { IUseCase } from "../interfaces/IUseCase";
import { Result } from "@shared/utils/Result";
import { DomainError } from "@domain/errors/DomainError";
import { IRideRepository } from "@domain/repositories/IRideRepository";
import { IDriverRepository } from "@domain/repositories/IDriverRepository";
import { IRatingRepository } from "@domain/repositories/IRatingRepository";
import { RateDriverDto } from "@application/dto/user/RateDriverDto";
import { RateDriverResponseDto } from "@application/dto/user/RateDriverResponseDto";
import { Logger } from "@shared/utils/Logger";
import { RideErrors } from "@domain/errors/RideErrors";
import { Rating } from "@domain/entities/Rating";
import { IUserRepository } from "@domain/repositories";
import { UserNotFoundError } from "@domain/errors/UserNotFoundError";
import { IIdGenerator } from "@application/services/IIdGenerator";
import { IUnitOfWork } from "@domain/repositories/IUnitOfWork";

@injectable()
export class RateDriverUseCase
  implements IUseCase<RateDriverDto, Promise<Result<RateDriverResponseDto>>>
{
  constructor(
    @inject(TYPES.RideRepository)
    private readonly rideRepository: IRideRepository,

    @inject(TYPES.DriverRepository)
    private readonly driverRepository: IDriverRepository,

    @inject(TYPES.RatingRepository)
    private readonly ratingRepository: IRatingRepository,

    @inject(TYPES.UserRepository)
    private readonly userRepository: IUserRepository,

    @inject(TYPES.IDGenerator)
    private readonly idGenerator: IIdGenerator,

    @inject(TYPES.UnitOfWork)
    private readonly unitOfWork: IUnitOfWork,
  ) {}

  async execute(dto: RateDriverDto): Promise<Result<RateDriverResponseDto>> {
    const riderId = dto.getRiderId();
    const rideId = dto.rideId;

    try {
      Logger.info("Rate driver requested", { riderId, rideId });

      const ride = await this.rideRepository.findByRideId(rideId);
      if (!ride) return Result.failure(RideErrors.rideNotFound(rideId));

      if (ride.getRiderId() !== riderId) {
        return Result.failure(RideErrors.unauthorizedRideAccess(rideId));
      }

      if (!ride.isCompleted()) {
        return Result.failure(RideErrors.cannotRateIncompleteRide(rideId));
      }

      const driverId = ride.getDriverId();
      if (!driverId)
        return Result.failure(RideErrors.driverNotFoundForRide(rideId));

      const alreadyExists = await this.ratingRepository.existsByRideAndReviewer(
        rideId,
        riderId,
      );
      if (alreadyExists)
        return Result.failure(RideErrors.rideAlreadyRated(rideId));

      const driver = await this.driverRepository.findById(driverId);
      if (!driver)
        return Result.failure(RideErrors.driverNotFoundForRide(rideId));

      const riderUser = await this.userRepository.findById(riderId);
      if (!riderUser) return Result.failure(new UserNotFoundError());

      const criteria = dto.getCriteria();
      const overallRating = criteria.getAverage();
      const ratingId = this.idGenerator.generate();

      const rating = Rating.create({
        id: ratingId,
        rideId,
        reviewerId: riderId,
        reviewerName: riderUser.getName(),
        revieweeId: driverId,
        reviewType: dto.reviewType,
        criteria,
        review: dto.review,
      });

      driver.updateRating(overallRating);

      const resultData = await this.unitOfWork.runInTransaction(async () => {
        await this.ratingRepository.save(rating);
        await this.driverRepository.save(driver);

        return {
          rideId,
          driverId,
          ratingId,
          overallRating,
          driver: {
            driverId,
            averageRating: driver.getAverageRating(),
            numberOfRatings: driver.getNumberOfRatings(),
          },
        };
      });

      Logger.info("Driver rated successfully", {
        riderId,
        rideId,
        overallRating,
      });

      return Result.success(resultData);
    } catch (error) {
      Logger.error("Unexpected error processing driver rating", {
        riderId,
        rideId,
        error: error instanceof Error ? error.message : String(error),
      });

      if (error instanceof DomainError) return Result.failure(error);
      return Result.failure(
        RideErrors.invalidRatingData("Database synchronization failed"),
      );
    }
  }
}
