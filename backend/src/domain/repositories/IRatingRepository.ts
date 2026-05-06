import { ReviewType } from "@domain/value-objects/ReviewType";
import { IReadOnlyRepository } from "./base/IReadOnlyRepository";
import { IWriteOnlyRepository } from "./base/IWriteOnlyRepository";
import { Rating } from "@domain/entities/Rating";

export interface RatingFilters {
  reviewType?: ReviewType;
  reviewerId?: string;
  revieweeId?: string;
  rideId?: string;
  minRating?: number;
  maxRating?: number;
  fromDate?: Date;
  toDate?: Date;
}

export type RatingSortField = "createdAt" | "overallRating";

export interface RatingQueryOptions {
  filters: RatingFilters;
  sortBy: RatingSortField;
  sortOrder: "asc" | "desc";
  page: number;
  limit: number;
}

export interface PaginatedRatings {
  ratings: Rating[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IRatingAggregateResult {
  averageRating: number;
  totalRatings: number;
  distribution: {
    zeroToOne: number;
    oneToTwo: number;
    twoToThree: number;
    threeToFour: number;
    fourToFive: number;
  };
}

export interface IRatingRepository
  extends IReadOnlyRepository<Rating, string>,
    IWriteOnlyRepository<Rating, string> {
  findAllByRideId(rideId: string): Promise<Rating[]>;

  findByRevieweeId(revieweeId: string): Promise<Rating[]>;

  existsByRideAndReviewer(rideId: string, reviewerId: string): Promise<boolean>;

  findAll(options: RatingQueryOptions): Promise<PaginatedRatings>;

  getAverageRatingForReviewee(
    revieweeId: string,
    filters: RatingFilters,
  ): Promise<IRatingAggregateResult>;
}
