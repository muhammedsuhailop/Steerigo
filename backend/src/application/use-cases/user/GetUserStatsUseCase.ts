import { injectable, inject } from "inversify";
import { IUseCase } from "../interfaces/IUseCase";
import { Result } from "@shared/utils/Result";
import { TYPES } from "@shared/constants/DITypes";
import { IRideRepository } from "@domain/repositories/IRideRepository";
import { IRatingRepository } from "@domain/repositories/IRatingRepository";
import { GetUserStatsRequestDto } from "@application/dto/user/GetUserStatsRequestDto";
import { GetUserStatsResponseDto } from "@application/dto/user/GetUserStatsResponseDto";
import { ReviewType } from "@domain/value-objects/ReviewType";
import { Logger } from "@shared/utils/Logger";

@injectable()
export class GetUserStatsUseCase
  implements
    IUseCase<GetUserStatsRequestDto, Promise<Result<GetUserStatsResponseDto>>>
{
  constructor(
    @inject(TYPES.RideRepository)
    private readonly rideRepository: IRideRepository,

    @inject(TYPES.RatingRepository)
    private readonly ratingRepository: IRatingRepository,
  ) {}

  async execute(
    dto: GetUserStatsRequestDto,
  ): Promise<Result<GetUserStatsResponseDto>> {
    try {
      const userId = dto.getUserId();
      Logger.debug("GetUserStats started", { userId });

      const now = new Date();

      const riderId = dto.getUserId();

      let fromDate = dto.getFromDate();
      let toDate = dto.getToDate();

      if (!fromDate || !toDate) {
        toDate = now;
        fromDate = new Date();
        fromDate.setDate(now.getDate() - 30);
      }

      const dateFilters = { fromDate, toDate };

      Logger.debug("Fetching user stats", {
        userId,
        fromDate,
        toDate,
      });

      const [rideStats, ratingStats] = await Promise.all([
        this.rideRepository.countByRiderStats(riderId, dateFilters),
        this.ratingRepository.getRatingStats({
          reviewerId: riderId,
          filters: {
            ...dateFilters,
            reviewType: ReviewType.USER_REVIEW,
          },
        }),
      ]);

      return Result.success({
        userId: riderId,
        fromDate: fromDate.toISOString(),
        toDate: toDate.toISOString(),
        rideStats: {
          totalRides: rideStats.total,
          completedRides: rideStats.completed,
          cancelledRides: rideStats.cancelled,
          totalSpend: rideStats.totalSpend,
          currency: "INR",
        },
        ratingStats: {
          averageRating: ratingStats.averageRating,
          totalRatings: ratingStats.totalRatings,
          distribution: ratingStats.distribution,
        },
      });
    } catch (error) {
      Logger.error("GetUserStats failed", {
        error: (error as Error).message,
      });
      return Result.failure(error as Error);
    }
  }
}
