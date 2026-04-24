import { DriverStatus } from "@domain/value-objects/DriverStatus";
import { KYCStatus } from "@domain/value-objects/KYCStatus";
import { LicenseCategory } from "@domain/value-objects/LicenseCategory";
import { BodyType, GearType } from "@domain/value-objects/VehicleType";
import { Schema, model, Document, Types } from "mongoose";

export interface IDriverModel extends Document {
  _id: string;
  userId: Types.ObjectId;
  eligibleGearTypes: string[];
  eligibleBodyTypes: string[];
  licenseNumber: string;
  licenceCategory: string;
  licenseIssueDate: Date;
  licenseExpiryDate: Date;
  kycStatus: string;
  status: string;
  averageRating: number;
  numberOfRatings: number;
  totalRides: number;
  createdAt: Date;
  updatedAt: Date;
}

const driverSchema = new Schema<IDriverModel>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      unique: true,
      ref: "User",
    },
    eligibleGearTypes: [
      {
        type: String,
        enum: GearType,
        required: true,
      },
    ],
    eligibleBodyTypes: [
      {
        type: String,
        enum: BodyType,
        required: true,
      },
    ],
    licenseNumber: {
      type: String,
      required: true,
    },
    licenceCategory: {
      type: String,
      enum: LicenseCategory,
      required: true,
    },
    licenseIssueDate: {
      type: Date,
      required: true,
    },
    licenseExpiryDate: {
      type: Date,
      required: true,
    },
    kycStatus: {
      type: String,
      enum: KYCStatus,
      default: KYCStatus.IN_REVIEW,
    },
    status: {
      type: String,
      enum: DriverStatus,
      default: DriverStatus.ACTIVE,
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numberOfRatings: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalRides: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
    collection: "drivers",
  },
);

// Indexes
driverSchema.index({ status: 1 });
driverSchema.index({ kycStatus: 1 });
driverSchema.index({ licenceCategory: 1 });
driverSchema.index({ createdAt: -1 });

export const DriverModel = model<IDriverModel>("Driver", driverSchema);
