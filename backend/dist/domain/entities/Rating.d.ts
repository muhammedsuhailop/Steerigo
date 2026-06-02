import { ReviewType } from "../value-objects/ReviewType";
import { RatingCriteria } from "../value-objects/RatingCriteria";
export declare class Rating {
    private readonly id;
    private readonly rideId;
    private readonly reviewerId;
    private readonly reviewerName;
    private readonly revieweeId;
    private readonly reviewType;
    private readonly criteria;
    private readonly overallRating;
    private review?;
    private readonly createdAt;
    private updatedAt;
    private constructor();
    static create(params: {
        id: string;
        rideId: string;
        reviewerId: string;
        reviewerName: string;
        revieweeId: string;
        reviewType: ReviewType;
        criteria: RatingCriteria;
        review?: string;
    }): Rating;
    static fromData(data: {
        id: string;
        rideId: string;
        reviewerId: string;
        reviewerName: string;
        revieweeId: string;
        reviewType: ReviewType;
        criteria: RatingCriteria;
        overallRating: number;
        review?: string;
        createdAt: Date;
        updatedAt: Date;
    }): Rating;
    getId(): string;
    getOverallRating(): number;
    getRevieweeId(): string;
    getReviewerId(): string;
    getReviewerName(): string;
    getReviewType(): ReviewType;
    getReview(): string | undefined;
    getCriteria(): RatingCriteria;
    getRideId(): string;
    getCreatedAt(): Date;
    getUpdatedAt(): Date;
}
//# sourceMappingURL=Rating.d.ts.map