import { DocumentType } from "@domain/value-objects/DocumentType";
import { KYCStatus } from "@domain/value-objects/KYCStatus";
import { Schema, model, Document, Types } from "mongoose";

export interface IKYCModel extends Document {
  _id: Types.ObjectId;
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
      enum: DocumentType,
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
      default: null,
    },
    verificationStatus: {
      type: String,
      enum: KYCStatus,
      default: KYCStatus.IN_REVIEW,
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

export const KYCModel = model<IKYCModel>("KYC", kycSchema);
