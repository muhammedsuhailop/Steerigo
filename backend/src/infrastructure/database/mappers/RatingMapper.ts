import { Rating } from "@domain/entities/Rating";
import { RatingCriteria } from "@domain/value-objects/RatingCriteria";
import { RatingCriteriaType } from "@domain/value-objects/RatingCriteriaType";
import { IRatingDocument } from "../models/RatingModel";
import { toObjectId } from "@shared/utils/idHelper";
import { ReviewType } from "@domain/value-objects/ReviewType";

export class RatingMapper {
  static toDomain(doc: IRatingDocument): Rating {
    const criteriaObj: any = {};

    for (const key of Object.values(RatingCriteriaType)) {
      criteriaObj[key] = doc.criteria.get(key) ?? 0;
    }

    const criteria = RatingCriteria.create(criteriaObj);

    return Rating.fromData({
      id: doc._id.toString(),
      rideId: doc.rideId.toString(),
      reviewerId: doc.reviewerId.toString(),
      reviewerName: doc.reviewerName,
      revieweeId: doc.revieweeId.toString(),
      reviewType: doc.reviewType as ReviewType,
      criteria,
      overallRating: doc.overallRating,
      review: doc.review,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  static toPersistence(entity: Rating): Partial<IRatingDocument> {
    const criteriaMap = new Map<string, number>(
      Object.entries(entity.getCriteria().toObject()),
    );

    return {
      rideId: toObjectId(entity.getRideId()),
      reviewerId: toObjectId(entity.getReviewerId()),
      reviewerName: entity.getReviewerName(),
      revieweeId: toObjectId(entity.getRevieweeId()),
      reviewType: entity.getReviewType(),
      criteria: criteriaMap,
      overallRating: entity.getOverallRating(),
      review: entity.getReview(),
      updatedAt: new Date(),
    };
  }
}
