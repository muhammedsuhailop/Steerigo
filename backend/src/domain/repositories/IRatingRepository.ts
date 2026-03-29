import { IReadOnlyRepository } from "./base/IReadOnlyRepository";
import { IWriteOnlyRepository } from "./base/IWriteOnlyRepository";
import { Rating } from "@domain/entities/Rating";

export interface IRatingRepository
  extends IReadOnlyRepository<Rating, string>,
    IWriteOnlyRepository<Rating, string> {
  findAllByRideId(rideId: string): Promise<Rating[]>;

  findByRevieweeId(revieweeId: string): Promise<Rating[]>;

  existsByRideAndReviewer(rideId: string, reviewerId: string): Promise<boolean>;
}
