import { RideErrors } from "@domain/errors/RideErrors";
import { RatingCriteria } from "@domain/value-objects/RatingCriteria";
import { ReviewType } from "@domain/value-objects/ReviewType";
import { RatingCriteriaType } from "@domain/value-objects/RatingCriteriaType";

type RatingCriteriaInput = Record<RatingCriteriaType, number>;

interface RateDriverRequestBody {
  criteria?: RatingCriteriaInput;
  review?: string;
}

export class RateDriverDto {
  private readonly riderId: string;
  public readonly rideId: string;
  public readonly reviewType: ReviewType;
  private readonly criteriaInput: RatingCriteriaInput;
  public readonly review?: string;

  private constructor(
    riderId: string,
    rideId: string,
    reviewType: ReviewType,
    criteriaInput: RatingCriteriaInput,
    review?: string,
  ) {
    this.riderId = riderId;
    this.rideId = rideId;
    this.reviewType = reviewType;
    this.criteriaInput = criteriaInput;
    this.review = review;
  }

  static fromRequest(
    riderId: string,
    params: { rideId?: string },
    body: unknown,
  ): RateDriverDto {
    const parsedBody = (body ?? {}) as RateDriverRequestBody;
    const criteria = parsedBody.criteria;
    const review = parsedBody.review;

    const effectiveRideId = params.rideId;

    const dto = new RateDriverDto(
      riderId,
      effectiveRideId as string,
      ReviewType.USER_REVIEW,
      criteria as RatingCriteriaInput,
      review,
    );

    dto.validate();
    return dto;
  }

  getRiderId(): string {
    return this.riderId;
  }

  getCriteria(): RatingCriteria {
    return RatingCriteria.create(this.criteriaInput);
  }

  getOverallRating(): number {
    return this.getCriteria().getAverage();
  }

  validate(): void {
    if (!this.riderId || this.riderId.trim().length === 0) {
      throw RideErrors.unauthorizedRideAccess(this.rideId ?? "unknown");
    }

    if (!this.rideId || this.rideId.trim().length === 0) {
      throw RideErrors.rideNotFound("unknown");
    }

    if (!this.criteriaInput) {
      throw RideErrors.invalidRatingData("Rating criteria is required");
    }

    const requiredKeys = Object.values(RatingCriteriaType);

    for (const key of requiredKeys) {
      const value = this.criteriaInput[key];

      if (value === undefined || value === null) {
        throw RideErrors.invalidRatingData(`Criteria '${key}' is missing`);
      }

      if (typeof value !== "number" || Number.isNaN(value)) {
        throw RideErrors.invalidRatingData(
          `Criteria '${key}' must be a numeric value`,
        );
      }

      if (value < 1 || value > 5) {
        throw RideErrors.invalidRatingValue();
      }
    }

    if (this.review && this.review.length > 1000) {
      throw RideErrors.invalidRatingData(
        "Review text must be at most 1000 characters",
      );
    }
  }
}
