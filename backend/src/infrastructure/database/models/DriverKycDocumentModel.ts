import mongoose, { Schema, Document } from 'mongoose';

export interface IDriverKycDocument extends Document {
  driverId: string;
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

const DriverKycSchema = new Schema<IDriverKycDocument>({
  driverId: { type: String, required: true, index: true },
  docType: { type: String, enum: ['Aadhaar','PAN','DrivingLicense'], required: true },
  docNumber: { type: String, required: true },
  issueDate: { type: Date, required: true },
  expiryDate: { type: Date, required: true },
  docImageUrls: { type: [String], required: true },
  isVerified: { type: Boolean, default: false },
  verifiedAt: Date,
  comments: String
}, { timestamps: true });

export const DriverKycDocumentModel = mongoose.model<IDriverKycDocument>('DriverKycDocument', DriverKycSchema);
