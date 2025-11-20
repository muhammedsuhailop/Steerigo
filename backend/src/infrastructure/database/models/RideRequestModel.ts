import { Document, Schema, model, Model, Types } from "mongoose";

export interface IRideRequestDocument extends Document {
  _id: string;
  driverId: Types.ObjectId;
  riderId: Types.ObjectId;
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
  pickupTime: Date;
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
  status: string;
  pickupETA: string;
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
}

// RideRequest Schema Definition
const rideRequestSchema = new Schema(
  {
    _id: {
      type: String,
      required: true,
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
    pickupTime: {
      type: Date,
      required: true,
    },
    rideType: {
      type: String,
      enum: ["One Way", "Round Trip"],
      required: true,
    },
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
    // Status
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected", "Expired"],
      default: "Pending",
      index: true,
    },
    // ETA
    pickupETA: {
      type: String,
      required: true,
    },
    // Expiry for pending requests (auto-delete after 30 minutes)
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
rideRequestSchema.index({ driverId: 1, status: 1 });
rideRequestSchema.index({ driverId: 1, pickupTime: 1 });
rideRequestSchema.index({ riderId: 1, status: 1 });
rideRequestSchema.index({ createdAt: 1 });
rideRequestSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index for auto-expiry

// RideRequest Model
export const RideRequestModel: Model<IRideRequestDocument> =
  model<IRideRequestDocument>("RideRequest", rideRequestSchema);
