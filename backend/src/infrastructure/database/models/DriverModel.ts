import mongoose, { Schema, Document, Types } from "mongoose";

export interface IDriverDocument extends Document {
  userId: Types.ObjectId;
  licenseNumber: string;
  licenseIssueDate: Date;
  licenseExpiryDate: Date;
  licenseCategory: string[];
  kycStatus: string;
  status: string;
  eligibleVehicleType: string[];
  eligibleGearType: string[];
  createdAt: Date;
  updatedAt: Date;
}

const DriverSchema = new Schema<IDriverDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    licenseNumber: { type: String, required: true },
    licenseIssueDate: { type: Date, required: true },
    licenseExpiryDate: { type: Date, required: true },
    licenseCategory: { type: [String], required: true },
    kycStatus: {
      type: String,
      enum: ["Pending", "Verified", "Rejected"],
      default: "Pending",
    },
    status: {
      type: String,
      enum: ["Active", "Blocked", "InReview"],
      default: "InReview",
    },
    eligibleVehicleType: { type: [String], default: [] },
    eligibleGearType: { type: [String], default: [] },
  },
  { timestamps: true }
);

export const DriverModel = mongoose.model<IDriverDocument>(
  "Driver",
  DriverSchema
);
