import { Schema, model, Document } from "mongoose";

export interface IKYCModel extends Document {
  _id: string;
  driverId: string;
  status: string;
  documents: string[];
  comments?: string;
  reviewedBy?: string;
  reviewedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const kycSchema = new Schema<IKYCModel>(
  {
    driverId: {
      type: String,
      required: true,
      ref: "Driver",
    },
    status: {
      type: String,
      enum: ["Pending", "Under Review", "Approved", "Rejected"],
      default: "Pending",
    },
    documents: [
      {
        type: String,
        required: true,
      },
    ],
    comments: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    reviewedBy: {
      type: String,
      ref: "User",
    },
    reviewedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    collection: "kyc_requests",
  }
);

// Indexes 
kycSchema.index({ driverId: 1 });
kycSchema.index({ status: 1 });
kycSchema.index({ createdAt: -1 });
kycSchema.index({ reviewedBy: 1 });

export const KYCModel = model<IKYCModel>("KYC", kycSchema);
