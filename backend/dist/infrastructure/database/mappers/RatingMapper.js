"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RatingMapper = void 0;
const Rating_1 = require("@domain/entities/Rating");
const RatingCriteria_1 = require("@domain/value-objects/RatingCriteria");
const RatingCriteriaType_1 = require("@domain/value-objects/RatingCriteriaType");
const idHelper_1 = require("@shared/utils/idHelper");
class RatingMapper {
    static toDomain(doc) {
        const criteriaObj = {};
        for (const key of Object.values(RatingCriteriaType_1.RatingCriteriaType)) {
            criteriaObj[key] = doc.criteria.get(key) ?? 0;
        }
        const criteria = RatingCriteria_1.RatingCriteria.create(criteriaObj);
        return Rating_1.Rating.fromData({
            id: doc._id.toString(),
            rideId: doc.rideId.toString(),
            reviewerId: doc.reviewerId.toString(),
            reviewerName: doc.reviewerName,
            revieweeId: doc.revieweeId.toString(),
            reviewType: doc.reviewType,
            criteria,
            overallRating: doc.overallRating,
            review: doc.review,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
        });
    }
    static toPersistence(entity) {
        const criteriaMap = new Map(Object.entries(entity.getCriteria().toObject()));
        return {
            rideId: entity.getRideId(),
            reviewerId: (0, idHelper_1.toObjectId)(entity.getReviewerId()),
            reviewerName: entity.getReviewerName(),
            revieweeId: (0, idHelper_1.toObjectId)(entity.getRevieweeId()),
            reviewType: entity.getReviewType(),
            criteria: criteriaMap,
            overallRating: entity.getOverallRating(),
            review: entity.getReview(),
            updatedAt: new Date(),
        };
    }
}
exports.RatingMapper = RatingMapper;
//# sourceMappingURL=RatingMapper.js.map