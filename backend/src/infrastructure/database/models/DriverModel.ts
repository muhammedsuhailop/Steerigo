import { Schema, model, Document } from "mongoose";

export interface IDriverModel extends Document {
  _id: string;
  userId: string;
  name: string;
  email: string;
  mobile: string;
  licenseNumber: string;
  vehicleNumber: string;
  status: string;
  profilePicture?: string;
  licenseDocument?: string;
  vehicleDocument?: string;
  createdAt: Date;
  updatedAt: Date;
}

const driverSchema = new Schema<IDriverModel>(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 255,
    },
    mobile: {
      type: String,
      required: true,
      trim: true,
      maxlength: 15,
    },
    licenseNumber: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      maxlength: 50,
    },
    vehicleNumber: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20,
    },
    status: {
      type: String,
      enum: ["Pending Verification", "Active", "Suspended", "Rejected"],
      default: "Pending Verification",
    },
    profilePicture: {
      type: String,
      trim: true,
    },
    licenseDocument: {
      type: String,
      trim: true,
    },
    vehicleDocument: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    collection: "drivers",
  }
);

// Indexes 
driverSchema.index({ email: 1 });
driverSchema.index({ mobile: 1 });
driverSchema.index({ status: 1 });
driverSchema.index({ createdAt: -1 });

export const DriverModel = model<IDriverModel>("Driver", driverSchema);
