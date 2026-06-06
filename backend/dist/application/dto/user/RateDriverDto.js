"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateDriverDto = void 0;
const RideErrors_1 = require("../../../domain/errors/RideErrors");
const RatingCriteria_1 = require("../../../domain/value-objects/RatingCriteria");
const ReviewType_1 = require("../../../domain/value-objects/ReviewType");
const RatingCriteriaType_1 = require("../../../domain/value-objects/RatingCriteriaType");
class RateDriverDto {
    constructor(riderId, rideId, reviewType, criteriaInput, review) {
        this.riderId = riderId;
        this.rideId = rideId;
        this.reviewType = reviewType;
        this.criteriaInput = criteriaInput;
        this.review = review;
    }
    static fromRequest(riderId, params, body) {
        const parsedBody = (body ?? {});
        const criteria = parsedBody.criteria;
        const review = parsedBody.review;
        const effectiveRideId = params.rideId;
        const dto = new RateDriverDto(riderId, effectiveRideId, ReviewType_1.ReviewType.USER_REVIEW, criteria, review);
        dto.validate();
        return dto;
    }
    getRiderId() {
        return this.riderId;
    }
    getCriteria() {
        return RatingCriteria_1.RatingCriteria.create(this.criteriaInput);
    }
    getOverallRating() {
        return this.getCriteria().getAverage();
    }
    validate() {
        if (!this.riderId || this.riderId.trim().length === 0) {
            throw RideErrors_1.RideErrors.unauthorizedRideAccess(this.rideId ?? "unknown");
        }
        if (!this.rideId || this.rideId.trim().length === 0) {
            throw RideErrors_1.RideErrors.rideNotFound("unknown");
        }
        if (!this.criteriaInput) {
            throw RideErrors_1.RideErrors.invalidRatingData("Rating criteria is required");
        }
        const requiredKeys = Object.values(RatingCriteriaType_1.RatingCriteriaType);
        for (const key of requiredKeys) {
            const value = this.criteriaInput[key];
            if (value === undefined || value === null) {
                throw RideErrors_1.RideErrors.invalidRatingData(`Criteria '${key}' is missing`);
            }
            if (typeof value !== "number" || Number.isNaN(value)) {
                throw RideErrors_1.RideErrors.invalidRatingData(`Criteria '${key}' must be a numeric value`);
            }
            if (value < 0.5 || value > 5) {
                throw RideErrors_1.RideErrors.invalidRatingValue();
            }
        }
        if (this.review && this.review.length > 1000) {
            throw RideErrors_1.RideErrors.invalidRatingData("Review text must be at most 1000 characters");
        }
    }
}
exports.RateDriverDto = RateDriverDto;
//# sourceMappingURL=RateDriverDto.js.map