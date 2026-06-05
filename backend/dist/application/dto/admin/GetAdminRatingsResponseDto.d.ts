import { RatingCriteriaType } from "../../../domain/value-objects/RatingCriteriaType";
import { ReviewType } from "../../../domain/value-objects/ReviewType";
export interface AdminRatingItem {
    ratingId: string;
    rideId: string;
    reviewerId: string;
    reviewerName: string;
    revieweeId: string;
    reviewType: ReviewType;
    criteria: Record<RatingCriteriaType, number>;
    overallRating: number;
    review?: string;
    createdAt: string;
    updatedAt: string;
}
export interface AdminRatingsPagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
export interface GetAdminRatingsResponseDto {
    ratings: AdminRatingItem[];
    pagination: AdminRatingsPagination;
}
//# sourceMappingURL=GetAdminRatingsResponseDto.d.ts.map