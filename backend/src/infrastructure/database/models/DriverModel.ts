import { Schema, model, Document, Types } from "mongoose";

export interface IDriverModel extends Document {
  _id: string;
  userId: Types.ObjectId;
  eligibleGearTypes: string[];
  eligibleBodyTypes: string[];
  licenceCategory: string;
  licenseIssueDate: Date;
  licenseExpiryDate: Date;
  kycStatus: string;
  status: string;
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
        enum: ["Manual", "Automatic"],
        required: true,
      },
    ],
    eligibleBodyTypes: [
      {
        type: String,
        enum: ["Sedan", "SUV", "Truck", "Hatchback", "Coupe"],
        required: true,
      },
    ],
    licenceCategory: {
      type: String,
      enum: ["LMV", "HMV", "MCWG", "MCWOG"],
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
      enum: ["InReview", "Rejected", "Approved", "Expired"],
      default: "InReview",
    },
    status: {
      type: String,
      enum: ["Active", "Blocked", "Suspended"],
      default: "Active",
    },
  },
  {
    timestamps: true,
    collection: "drivers",
  }
);

// Indexes
driverSchema.index({ status: 1 });
driverSchema.index({ kycStatus: 1 });
driverSchema.index({ licenceCategory: 1 });
driverSchema.index({ createdAt: -1 });

export const DriverModel = model<IDriverModel>("Driver", driverSchema);
