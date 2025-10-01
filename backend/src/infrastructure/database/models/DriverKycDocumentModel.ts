import mongoose, { Schema, Document, Types } from "mongoose";

export interface IDriverKycDocument extends Document {
  driverId: Types.ObjectId;
  docType: string;
  docNumber: string;
  issueDate: Date;
  expiryDate: Date;
  docImageUrls: string[];
  isVerified: boolean;
  verifiedAt?: Date;
  comments?: string;
  createdAt: Date;
  updatedAt: Date;
}

const DriverKycSchema = new Schema<IDriverKycDocument>(
  {
    driverId: {
      type: Schema.Types.ObjectId,
      ref: "Driver",
      required: true,
      index: true,
    },
    docType: {
      type: String,
      enum: ["Aadhaar", "PAN", "DrivingLicense", "Passport"],
      required: true,
    },
    docNumber: { type: String, required: true },
    issueDate: { type: Date, required: true },
    expiryDate: { type: Date, required: true },
    docImageUrls: { type: [String], required: true },
    isVerified: { type: Boolean, default: false },
    verifiedAt: Date,
    comments: String,
  },
  { timestamps: true }
);

export const DriverKycDocumentModel = mongoose.model<IDriverKycDocument>(
  "DriverKycDocument",
  DriverKycSchema
);
