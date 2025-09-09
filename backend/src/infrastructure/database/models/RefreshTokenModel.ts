import mongoose, { Schema, Document } from "mongoose";

export interface IRefreshTokenDocument extends Document {
  userId: string;
  token: string;
  expiresAt: Date;
  isRevoked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const RefreshTokenSchema = new Schema<IRefreshTokenDocument>(
  {
    userId: {
      type: String,
      ref: "User",
      required: true,
      index: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expireAfterSeconds: 0 }, // MongoDB TTL index
    },
    isRevoked: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

RefreshTokenSchema.index({ userId: 1, isRevoked: 1 });
RefreshTokenSchema.index({ token: 1, isRevoked: 1 });

export const RefreshTokenModel = mongoose.model<IRefreshTokenDocument>(
  "RefreshToken",
  RefreshTokenSchema
);
