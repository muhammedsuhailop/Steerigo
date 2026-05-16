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
  timeRequired: number;
  rideType: string;
  fareBreakdown: {
    baseFare: {
      amount: number;
      currency: string;
    };
    platformFee: {
      amount: number;
      currency: string;
    };
    taxes: {
      fare: {
        name: string;
        rate: number;
        amount: {
          amount: number;
          currency: string;
        };
      };
      platformFee: {
        name: string;
        rate: number;
        amount: {
          amount: number;
          currency: string;
        };
      };
    };
    totalFare: {
      amount: number;
      currency: string;
    };
    durationHours: number;
    calculatedAt: Date;
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
    timeRequired: { type: Number, min: 1, max: 12 },
    rideType: { type: String, required: true },
    fareBreakdown: {
      baseFare: {
        amount: {
          type: Number,
          required: true,
          min: 0,
        },
        currency: {
          type: String,
          required: true,
          default: "INR",
        },
      },
      platformFee: {
        amount: {
          type: Number,
          required: true,
          min: 0,
        },
        currency: {
          type: String,
          required: true,
          default: "INR",
        },
      },
      taxes: {
        fare: {
          name: {
            type: String,
            required: true,
          },
          rate: {
            type: Number,
            required: true,
            min: 0,
            max: 100,
          },
          amount: {
            amount: {
              type: Number,
              required: true,
              min: 0,
            },
            currency: {
              type: String,
              required: true,
              default: "INR",
            },
          },
        },
        platformFee: {
          name: {
            type: String,
            required: true,
          },
          rate: {
            type: Number,
            required: true,
            min: 0,
            max: 100,
          },
          amount: {
            amount: {
              type: Number,
              required: true,
              min: 0,
            },
            currency: {
              type: String,
              required: true,
              default: "INR",
            },
          },
        },
      },
      totalFare: {
        amount: {
          type: Number,
          required: true,
          min: 0,
        },
        currency: {
          type: String,
          required: true,
          default: "INR",
        },
      },
      durationHours: {
        type: Number,
        required: true,
        min: 0,
      },
      calculatedAt: {
        type: Date,
        required: true,
        default: Date.now,
      },
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
