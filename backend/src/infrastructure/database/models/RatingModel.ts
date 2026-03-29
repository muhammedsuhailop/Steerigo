import { ReviewType } from "@domain/value-objects/ReviewType";
import { Document, Schema, model, Model, Types } from "mongoose";

export interface IRatingDocument extends Document {
  _id: Types.ObjectId;
  rideId: Types.ObjectId;
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

const ratingSchema = new Schema<IRatingDocument>(
  {
    rideId: {
      type: Schema.Types.ObjectId,
      ref: "Ride",
      required: true,
      index: true,
    },
    reviewerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    reviewerName: {
      type: String,
      required: true,
      trim: true,
    },
    revieweeId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    reviewType: {
      type: String,
      enum: Object.values(ReviewType),
      required: true,
      index: true,
    },
    criteria: {
      type: Map,
      of: Number,
      required: true,
    },
    overallRating: {
      type: Schema.Types.Number,
      required: true,
      min: 0,
      max: 5,
      index: true,
    },
    review: {
      type: String,
      maxlength: 500,
      trim: true,
    },
  },
  { timestamps: true },
);

ratingSchema.index({ rideId: 1, reviewerId: 1 }, { unique: true });

ratingSchema.index({ revieweeId: 1, createdAt: -1 });

ratingSchema.index({ reviewType: 1, createdAt: -1 });

export const RatingModel: Model<IRatingDocument> = model<IRatingDocument>(
  "Rating",
  ratingSchema,
);
