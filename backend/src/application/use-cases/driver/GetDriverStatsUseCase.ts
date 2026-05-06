import { injectable, inject } from "inversify";
import { IUseCase } from "../interfaces/IUseCase";
import { Result } from "@shared/utils/Result";
import { TYPES } from "@shared/constants/DITypes";
import { IRideRepository } from "@domain/repositories/IRideRepository";
import { IRatingRepository } from "@domain/repositories/IRatingRepository";
import { IDriverRepository } from "@domain/repositories/IDriverRepository";
import { GetDriverStatsRequestDto } from "@application/dto/driver/GetDriverStatsRequestDto";
import { GetDriverStatsResponseDto } from "@application/dto/driver/GetDriverStatsResponseDto";
import { ReviewType } from "@domain/value-objects/ReviewType";
import { DriverNotFoundError } from "@domain/errors/DriverNotFoundError";

@injectable()
export class GetDriverStatsUseCase
  implements
    IUseCase<
      GetDriverStatsRequestDto,
      Promise<Result<GetDriverStatsResponseDto>>
    >
{
  constructor(
    @inject(TYPES.RideRepository)
    private readonly rideRepository: IRideRepository,

    @inject(TYPES.RatingRepository)
    private readonly ratingRepository: IRatingRepository,

    @inject(TYPES.DriverRepository)
    private readonly driverRepository: IDriverRepository,
  ) {}

  async execute(
    dto: GetDriverStatsRequestDto,
  ): Promise<Result<GetDriverStatsResponseDto>> {
    try {
      const driver = await this.driverRepository.findByUserId(dto.getUserId());
      if (!driver) {
        return Result.failure(new DriverNotFoundError(dto.getUserId()));
      }

      const driverId = driver.getId();

      const now = new Date();
      let fromDate = dto.getFromDate();
      let toDate = dto.getToDate();

      if (!fromDate || !toDate) {
        toDate = now;
        fromDate = new Date();
        fromDate.setDate(now.getDate() - 30); // default last 30 days
      }

      const dateFilters = { fromDate, toDate };

      const [rideStats, ratingStats] = await Promise.all([
        this.rideRepository.countByDriverStats(driverId, dateFilters),
        this.ratingRepository.getAverageRatingForReviewee(driverId, {
          ...dateFilters,
          reviewType: ReviewType.USER_REVIEW,
          revieweeId: driverId,
        }),
      ]);

      return Result.success({
        driverId,
        fromDate: fromDate.toISOString(),
        toDate: toDate.toISOString(),
        rideStats: {
          totalRides: rideStats.total,
          completedRides: rideStats.completed,
          cancelledRides: rideStats.cancelled,
          totalEarnings: rideStats.totalEarnings,
          currency: "INR",
        },
        ratingStats: {
          averageRating: ratingStats.averageRating,
          totalRatings: ratingStats.totalRatings,
          distribution: ratingStats.distribution,
        },
      });
    } catch (error) {
      return Result.failure(error as Error);
    }
  }
}
