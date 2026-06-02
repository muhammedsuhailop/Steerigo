import { ReviewType } from "../../../domain/value-objects/ReviewType";
import { Document, Model, Types } from "mongoose";
export interface IRatingDocument extends Document {
    _id: Types.ObjectId;
    rideId: string;
    reviewerId: Types.ObjectId;
    reviewerName: string;
    revieweeId: Types.ObjectId;
    reviewType: ReviewType;
    criteria: Map<string, number>;
    overallRating: number;
    review?: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare const RatingModel: Model<IRatingDocument>;
//# sourceMappingURL=RatingModel.d.ts.map