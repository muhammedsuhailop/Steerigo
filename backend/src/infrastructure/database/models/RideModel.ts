import { Document, Schema, model, Model, Types } from "mongoose";

export interface IRideDocument extends Document {
  rideId: string;
  driverId: Types.ObjectId;
  riderId: Types.ObjectId;
  status: string; // RideStatus enum value

  pickup: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  drop: {
    latitude: number;
    longitude: number;
    address?: string;
  };

  rideType: string; // RideType enum value (One way, Round Trip)

  fareBreakdown: {
    baseFare: number;
    distanceFare: number;
    timeFare: number;
    tax: number;
    surgeMultiplier: number;
  };

  currency: string;

  timeline: {
    requestedAt: Date;
    acceptedAt?: Date;
    startedAt?: Date;
    completedAt?: Date;
    cancelledAt?: Date;
    rejectedAt?: Date;
    paymentInitiatedAt?: Date;
    paymentCompletedAt?: Date;
  };

  rating?: number;
  feedback?: string;

  createdAt: Date;
  updatedAt: Date;
}

// Ride Schema Definition

const rideSchema = new Schema<IRideDocument>(
  {
    rideId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    driverId: {
      type: Schema.Types.ObjectId,
      ref: "Driver",
      required: true,
      index: true,
    },

    riderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: [
        "Requested",
        "Accepted",
        "Started",
        "Completed",
        "Cancelled",
        "Rejected",
      ],
      default: "Requested",
      index: true,
    },

    // Location data
    pickup: {
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
      },
    },

    drop: {
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
      },
    },

    // Ride details
    rideType: {
      type: String,
      enum: ["One Way", "Round Trip"],
      required: true,
    },

    // Fare breakdown
    fareBreakdown: {
      baseFare: {
        type: Number,
        required: true,
        min: 0,
      },
      distanceFare: {
        type: Number,
        required: true,
        min: 0,
      },
      timeFare: {
        type: Number,
        required: true,
        min: 0,
      },
      tax: {
        type: Number,
        required: true,
        min: 0,
      },
      surgeMultiplier: {
        type: Number,
        default: 1,
        min: 1,
      },
    },

    // Currency
    currency: {
      type: String,
      default: "INR",
    },

    // Timeline
    timeline: {
      requestedAt: {
        type: Date,
        required: true,
        default: new Date(),
      },
      acceptedAt: {
        type: Date,
      },
      startedAt: {
        type: Date,
        index: true,
      },
      completedAt: {
        type: Date,
        index: true,
      },
      cancelledAt: {
        type: Date,
      },
      rejectedAt: {
        type: Date,
      },
      paymentInitiatedAt: {
        type: Date,
      },
      paymentCompletedAt: {
        type: Date,
      },
    },

    // Optional fields
    rating: {
      type: Number,
      min: 0,
      max: 5,
    },
    feedback: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
rideSchema.index({ driverId: 1, status: 1 });
rideSchema.index({ driverId: 1, "timeline.startedAt": 1 });
rideSchema.index({ riderId: 1, status: 1 });
rideSchema.index({ createdAt: 1 });
rideSchema.index({ "timeline.completedAt": 1 });

// Ride Model

export const RideModel: Model<IRideDocument> = model<IRideDocument>(
  "Ride",
  rideSchema
);
