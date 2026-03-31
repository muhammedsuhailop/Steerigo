import { injectable, inject } from "inversify";
import { IUseCase } from "../interfaces/IUseCase";
import { Result } from "@shared/utils/Result";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";
import { IRatingRepository } from "@domain/repositories/IRatingRepository";
import { Rating } from "@domain/entities/Rating";
import { GetAdminRatingsDto } from "@application/dto/admin/GetAdminRatingsDto";
import {
  GetAdminRatingsResponseDto,
  AdminRatingItem,
} from "@application/dto/admin/GetAdminRatingsResponseDto";
import { RatingCriteriaType } from "@domain/value-objects/RatingCriteriaType";

@injectable()
export class GetAdminRatingsUseCase
  implements
    IUseCase<GetAdminRatingsDto, Promise<Result<GetAdminRatingsResponseDto>>>
{
  constructor(
    @inject(TYPES.RatingRepository)
    private readonly ratingRepository: IRatingRepository,
  ) {}

  async execute(
    dto: GetAdminRatingsDto,
  ): Promise<Result<GetAdminRatingsResponseDto>> {
    try {
      Logger.info("Admin get ratings requested", {
        page: dto.getPage(),
        limit: dto.getLimit(),
        sortBy: dto.getSortBy(),
        sortOrder: dto.getSortOrder(),
        reviewType: dto.getReviewType(),
        revieweeId: dto.getRevieweeId(),
      });

      const result = await this.ratingRepository.findAll({
        filters: {
          reviewType: dto.getReviewType(),
          reviewerId: dto.getReviewerId(),
          revieweeId: dto.getRevieweeId(),
          rideId: dto.getRideId(),
          minRating: dto.getMinRating(),
          maxRating: dto.getMaxRating(),
          fromDate: dto.getFromDate(),
          toDate: dto.getToDate(),
        },
        sortBy: dto.getSortBy(),
        sortOrder: dto.getSortOrder(),
        page: dto.getPage(),
        limit: dto.getLimit(),
      });

      const ratings: AdminRatingItem[] = result.ratings.map(
        (rating: Rating): AdminRatingItem => ({
          ratingId: rating.getId(),
          rideId: rating.getRideId(),
          reviewerId: rating.getReviewerId(),
          reviewerName: rating.getReviewerName(),
          revieweeId: rating.getRevieweeId(),
          reviewType: rating.getReviewType(),
          criteria: rating.getCriteria().toObject() as Record<
            RatingCriteriaType,
            number
          >,
          overallRating: rating.getOverallRating(),
          review: rating.getReview(),
          createdAt: rating.getCreatedAt().toISOString(),
          updatedAt: rating.getUpdatedAt().toISOString(),
        }),
      );

      Logger.info("Admin ratings fetched successfully", {
        total: result.total,
        page: result.page,
        totalPages: result.totalPages,
      });

      return Result.success({
        success: true,
        data: {
          ratings,
          pagination: {
            total: result.total,
            page: result.page,
            limit: result.limit,
            totalPages: result.totalPages,
          },
        },
      });
    } catch (error) {
      Logger.error("Error fetching admin ratings", {
        error: error instanceof Error ? error.message : String(error),
      });

      return Result.failure(error as Error);
    }
  }
}
