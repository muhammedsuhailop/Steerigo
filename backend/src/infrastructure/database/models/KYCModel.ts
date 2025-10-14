import { Schema, model, Document, Types } from "mongoose";

export interface IKYCModel extends Document {
  _id: string;
  driverId: Types.ObjectId;
  docType: string;
  docNumber: string;
  issueDate?: Date;
  expiryDate?: Date;
  verificationStatus: string;
  comments?: string;
  docImageUrlsFront: string[];
  docImageUrlsBack: string[];
  createdAt: Date;
  updatedAt: Date;
}

const kycSchema = new Schema<IKYCModel>(
  {
    driverId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Driver",
    },
    docType: {
      type: String,
      enum: ["Aadhaar", "PAN", "License", "Passport"],
      required: true,
    },
    docNumber: {
      type: String,
      required: true,
      trim: true,
    },
    issueDate: {
      type: Date,
    },
    expiryDate: {
      type: Date,
    },
    verificationStatus: {
      type: String,
      enum: ["InReview", "Approved", "Rejected", "Expired"],
      default: "InReview",
    },
    comments: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    docImageUrlsFront: [{ type: String, required: true }],
    docImageUrlsBack: [{ type: String, required: true }],
  },
  {
    timestamps: true,
    collection: "kyc_documents",
  }
);

// Indexes
kycSchema.index({ driverId: 1 });
kycSchema.index({ docType: 1 });
kycSchema.index({ verificationStatus: 1 });
kycSchema.index({ createdAt: -1 });

// Compound index for driver's documents
kycSchema.index({ driverId: 1, docType: 1 }, { unique: true });

export const KYCModel = model<IKYCModel>("KYC", kycSchema);
