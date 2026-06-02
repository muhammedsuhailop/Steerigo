import { IRatingRepository, IRatingStatsResult, PaginatedRatings, RatingFilters, RatingQueryOptions } from "../../../domain/repositories/IRatingRepository";
import { Rating } from "../../../domain/entities/Rating";
export declare class RatingRepositoryImpl implements IRatingRepository {
    findById(id: string): Promise<Rating | null>;
    exists(id: string): Promise<boolean>;
    existsByRideAndReviewer(rideId: string, reviewerId: string): Promise<boolean>;
    save(rating: Rating): Promise<Rating>;
    delete(id: string): Promise<void>;
    findAllByRideId(rideId: string): Promise<Rating[]>;
    findByRevieweeId(revieweeId: string): Promise<Rating[]>;
    findAll(options: RatingQueryOptions): Promise<PaginatedRatings>;
    getRatingStats(params: {
        reviewerId?: string;
        revieweeId?: string;
        filters: RatingFilters;
    }): Promise<IRatingStatsResult>;
}
//# sourceMappingURL=RatingRepositoryImpl.d.ts.map