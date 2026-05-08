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
import { Logger } from "@shared/utils/Logger";

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
      Logger.debug("GetDriverStats started", dto.getUserId());
      const driver = await this.driverRepository.findByUserId(dto.getUserId());
      if (!driver) {
        Logger.warn("Driver not found for user", dto.getUserId());
        return Result.failure(new DriverNotFoundError(dto.getUserId()));
      }

      const driverId = driver.getId();

      const now = new Date();
      let fromDate = dto.getFromDate();
      let toDate = dto.getToDate();

      if (!fromDate || !toDate) {
        toDate = now;
        fromDate = new Date();
        fromDate.setDate(now.getDate() - 30);
      }

      const dateFilters = { fromDate, toDate };

      Logger.debug("Fetching stats", {
        driverId,
        fromDate,
        toDate,
      });

      const [rideStats, ratingStats] = await Promise.all([
        this.rideRepository.countByDriverStats(driverId, dateFilters),
        this.ratingRepository.getRatingStats({
          revieweeId: driverId,
          filters: {
            ...dateFilters,
            reviewType: ReviewType.USER_REVIEW,
          },
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
      Logger.error("GetDriverStats failed", {
        error: (error as Error).message,
      });

      return Result.failure(error as Error);
    }
  }
}
