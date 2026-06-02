"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rating = void 0;
class Rating {
    constructor(id, rideId, reviewerId, reviewerName, revieweeId, reviewType, criteria, overallRating, review, createdAt = new Date(), updatedAt = new Date()) {
        this.id = id;
        this.rideId = rideId;
        this.reviewerId = reviewerId;
        this.reviewerName = reviewerName;
        this.revieweeId = revieweeId;
        this.reviewType = reviewType;
        this.criteria = criteria;
        this.overallRating = overallRating;
        this.review = review;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    static create(params) {
        const { id, rideId, reviewerId, reviewerName, revieweeId, reviewType, criteria, review, } = params;
        if (!id ||
            !rideId ||
            !reviewerId ||
            !reviewerName ||
            !revieweeId ||
            !reviewType) {
            throw new Error("Missing required fields");
        }
        const overall = criteria.getAverage();
        return new Rating(id, rideId, reviewerId, reviewerName, revieweeId, reviewType, criteria, overall, review);
    }
    static fromData(data) {
        return new Rating(data.id, data.rideId, data.reviewerId, data.reviewerName, data.revieweeId, data.reviewType, data.criteria, data.overallRating, data.review, data.createdAt, data.updatedAt);
    }
    getId() {
        return this.id;
    }
    getOverallRating() {
        return this.overallRating;
    }
    getRevieweeId() {
        return this.revieweeId;
    }
    getReviewerId() {
        return this.reviewerId;
    }
    getReviewerName() {
        return this.reviewerName;
    }
    getReviewType() {
        return this.reviewType;
    }
    getReview() {
        return this.review;
    }
    getCriteria() {
        return this.criteria;
    }
    getRideId() {
        return this.rideId;
    }
    getCreatedAt() {
        return this.createdAt;
    }
    getUpdatedAt() {
        return this.updatedAt;
    }
}
exports.Rating = Rating;
//# sourceMappingURL=Rating.js.map