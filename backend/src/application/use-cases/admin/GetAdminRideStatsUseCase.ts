import { injectable, inject } from "inversify";
import { IUseCase } from "../interfaces/IUseCase";
import { Result } from "@shared/utils/Result";
import { TYPES } from "@shared/constants/DITypes";
import { IRideRepository } from "@domain/repositories/IRideRepository";
import { IRatingRepository } from "@domain/repositories/IRatingRepository";
import { GetAdminRideStatsResponseDto } from "@application/dto/admin/GetAdminRideStatsResponseDto";
import { GetAdminRideStatsRequestDto } from "@application/dto/admin/GetAdminRideStatsRequestDto";

@injectable()
export class GetAdminRideStatsUseCase
  implements
    IUseCase<
      GetAdminRideStatsRequestDto,
      Promise<Result<GetAdminRideStatsResponseDto>>
    >
{
  constructor(
    @inject(TYPES.RideRepository)
    private readonly rideRepository: IRideRepository,

    @inject(TYPES.RatingRepository)
    private readonly ratingRepository: IRatingRepository,
  ) {}

  async execute(
    dto: GetAdminRideStatsRequestDto,
  ): Promise<Result<GetAdminRideStatsResponseDto>> {
    try {
      const now = new Date();

      let fromDate = dto.getFromDate();
      let toDate = dto.getToDate();

      if (!fromDate || !toDate) {
        toDate = now;
        fromDate = new Date();
        fromDate.setDate(now.getDate() - 7); // default last 7 days
      }

      const dateFilters = { fromDate, toDate };

      const [rideStats, ratingStats, timeSeriesData] = await Promise.all([
        this.rideRepository.countRideStats({
          filters: dateFilters,
        }),

        this.ratingRepository.getRatingStats({
          filters: dateFilters,
        }),

        this.rideRepository.getRideTimeSeriesData({
          filters: dateFilters,
        }),
      ]);

      return Result.success({
        fromDate: fromDate.toISOString(),
        toDate: toDate.toISOString(),
        rideStats: {
          totalRides: rideStats.total,
          completedRides: rideStats.completed,
          cancelledRides: rideStats.cancelled,
          totalAmount: rideStats.totalAmount,
          currency: "INR",
        },
        ratingStats: {
          averageRating: ratingStats.averageRating,
          totalRatings: ratingStats.totalRatings,
          distribution: {
            zeroToOne: ratingStats.distribution.zeroToOne,
            oneToTwo: ratingStats.distribution.oneToTwo,
            twoToThree: ratingStats.distribution.twoToThree,
            threeToFour: ratingStats.distribution.threeToFour,
            fourToFive: ratingStats.distribution.fourToFive,
          },
        },
        graphData: {
          ridesOverTime: timeSeriesData.map((data) => ({
            date: data.date,
            totalRides: data.totalRides,
            completedRides: data.completedRides,
            cancelledRides: data.cancelledRides,
            revenue: data.revenue,
          })),
        },
      });
    } catch (error) {
      return Result.failure(error as Error);
    }
  }
}
