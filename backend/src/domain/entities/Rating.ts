import { ReviewType } from "@domain/value-objects/ReviewType";
import { RatingCriteria } from "../value-objects/RatingCriteria";

export class Rating {
  private constructor(
    private readonly id: string,
    private readonly rideId: string,
    private readonly reviewerId: string,
    private readonly reviewerName: string,
    private readonly revieweeId: string,
    private readonly reviewType: ReviewType,
    private readonly criteria: RatingCriteria,
    private readonly overallRating: number,
    private review?: string,
    private readonly createdAt: Date = new Date(),
    private updatedAt: Date = new Date(),
  ) {}

  static create(params: {
    id: string;
    rideId: string;
    reviewerId: string;
    reviewerName: string;
    revieweeId: string;
    reviewType: ReviewType;
    criteria: RatingCriteria;
    review?: string;
  }): Rating {
    const {
      id,
      rideId,
      reviewerId,
      reviewerName,
      revieweeId,
      reviewType,
      criteria,
      review,
    } = params;

    if (
      !id ||
      !rideId ||
      !reviewerId ||
      !reviewerName ||
      !revieweeId ||
      !reviewType
    ) {
      throw new Error("Missing required fields");
    }

    const overall = criteria.getAverage();

    return new Rating(
      id,
      rideId,
      reviewerId,
      reviewerName,
      revieweeId,
      reviewType,
      criteria,
      overall,
      review,
    );
  }

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
  }): Rating {
    return new Rating(
      data.id,
      data.rideId,
      data.reviewerId,
      data.reviewerName,
      data.revieweeId,
      data.reviewType,
      data.criteria,
      data.overallRating,
      data.review,
      data.createdAt,
      data.updatedAt,
    );
  }

  getId(): string {
    return this.id;
  }

  getOverallRating(): number {
    return this.overallRating;
  }

  getRevieweeId(): string {
    return this.revieweeId;
  }

  getReviewerId(): string {
    return this.reviewerId;
  }

  getReviewerName(): string {
    return this.reviewerName;
  }

  getReviewType(): ReviewType {
    return this.reviewType;
  }

  getReview(): string | undefined {
    return this.review;
  }

  getCriteria(): RatingCriteria {
    return this.criteria;
  }

  getRideId(): string {
    return this.rideId;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }
}
