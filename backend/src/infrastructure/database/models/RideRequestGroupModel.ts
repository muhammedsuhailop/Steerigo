import { Document, Schema, model, Types } from "mongoose";
import { RideRequestGroupStatus } from "@domain/value-objects/RideRequestGroupStatus";

export interface IRideLocation {
  latitude: number;
  longitude: number;
  address: string;
}

export interface IRideRequestGroupDocument extends Document {
  _id: Types.ObjectId;
  riderId: Types.ObjectId;
  pickup: IRideLocation;
  drop: IRideLocation;
  rideType: string;
  estimatedFare: {
    amount: number;
    currency: string;
  };
  candidateDriverIds: Types.ObjectId[];
  currentIndex: number;
  status: RideRequestGroupStatus;
  createdAt: Date;
  updatedAt: Date;
}

const RideLocationSchema = new Schema<IRideLocation>(
  {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    address: { type: String, required: true },
  },
  { _id: false },
);

const RideRequestGroupSchema = new Schema<IRideRequestGroupDocument>(
  {
    riderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    pickup: { type: RideLocationSchema, required: true },
    drop: { type: RideLocationSchema, required: true },
    rideType: { type: String, required: true },
    estimatedFare: {
      amount: { type: Number, required: true },
      currency: { type: String, required: true },
    },
    candidateDriverIds: [
      { type: Schema.Types.ObjectId, ref: "Driver", required: true },
    ],
    currentIndex: { type: Number, required: true, default: 0 },
    status: {
      type: String,
      enum: Object.values(RideRequestGroupStatus),
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "ride_request_groups",
  },
);

export const RideRequestGroupModel = model<IRideRequestGroupDocument>(
  "RideRequestGroup",
  RideRequestGroupSchema,
);
