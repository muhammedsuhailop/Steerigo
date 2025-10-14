import { Schema, model, Document, Types } from "mongoose";

export interface IDriverAvailabilityModel extends Document {
  _id: string;
  driverId: Types.ObjectId;
  status: string;
  availableFrom: Date;
  availableTill: Date;
  currentLocation: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const locationSchema = new Schema(
  {
    latitude: {
      type: Number,
      required: true,
      min: -90,
      max: 90,
    },
    longitude: {
      type: Number,
      required: true,
      min: -180,
      max: 180,
    },
    address: {
      type: String,
      trim: true,
      maxlength: 500,
    },
  },
  { _id: false }
);

const driverAvailabilitySchema = new Schema(
  {
    driverId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Driver",
    },
    status: {
      type: String,
      enum: ["Available", "Busy", "Offline"],
      default: "Available",
      required: true,
    },
    availableFrom: {
      type: Date,
      required: true,
      index: true,
    },
    availableTill: {
      type: Date,
      required: true,
      index: true,
    },
    currentLocation: {
      type: locationSchema,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "driver_availability",
  }
);

// Compound indexes
driverAvailabilitySchema.index({ status: 1 });
driverAvailabilitySchema.index({
  status: 1,
  availableFrom: 1,
  availableTill: 1,
});
driverAvailabilitySchema.index({
  "currentLocation.latitude": 1,
  "currentLocation.longitude": 1,
});

// Ensure only one active availability record per driver
driverAvailabilitySchema.index(
  { driverId: 1 },
  {
    unique: true,
    partialFilterExpression: {
      availableTill: { $gte: new Date() },
    },
  }
);

export const DriverAvailabilityModel = model<IDriverAvailabilityModel>(
  "DriverAvailability",
  driverAvailabilitySchema
);
