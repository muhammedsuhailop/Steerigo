import { FutureRideRequestStatus } from "@domain/value-objects/FutureRideRequestStatus";
import { Document, Model, Schema, Types, model } from "mongoose";

export interface IFutureRideRequestDocument extends Document {
  _id: Types.ObjectId;
  riderId: Types.ObjectId;
  driverId?: Types.ObjectId | null;
  driverUserId?: Types.ObjectId | null;
  requestGroupId: string;
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
  requiredDuration: number;
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
}

const futureRideRequestSchema = new Schema(
  {
    riderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    driverId: {
      type: Schema.Types.ObjectId,
      ref: "Driver",
      default: null,
      index: true,
    },

    driverUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    requestGroupId: {
      type: String,
      required: true,
      index: true,
    },

    pickup: {
      latitude: {
        type: Number,
        required: true,
      },

      longitude: {
        type: Number,
        required: true,
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
      },

      longitude: {
        type: Number,
        required: true,
      },

      address: {
        type: String,
        trim: true,
      },
    },

    pickupTime: {
      type: Date,
      required: true,
    },

    requiredDuration: {
      type: Number,
      min: 60,
    },

    rideType: {
      type: String,
      enum: ["One Way", "Round Trip"],
      required: true,
    },

    fareBreakdown: {
      baseFare: {
        amount: Number,
        currency: String,
      },

      platformFee: {
        amount: Number,
        currency: String,
      },

      taxes: {
        fare: {
          name: String,
          rate: Number,

          amount: {
            amount: Number,
            currency: String,
          },
        },

        platformFee: {
          name: String,
          rate: Number,

          amount: {
            amount: Number,
            currency: String,
          },
        },
      },

      totalFare: {
        amount: Number,
        currency: String,
      },

      durationHours: Number,

      calculatedAt: Date,
    },

    status: {
      type: String,
      enum: FutureRideRequestStatus,
      default: FutureRideRequestStatus.PENDING,
      index: true,
    },

    pickupETA: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// Indexes

futureRideRequestSchema.index({
  pickupTime: 1,
});

futureRideRequestSchema.index({
  riderId: 1,
  status: 1,
});

futureRideRequestSchema.index({
  driverId: 1,
  pickupTime: 1,
});

export const FutureRideRequestModel: Model<IFutureRideRequestDocument> =
  model<IFutureRideRequestDocument>(
    "FutureRideRequest",
    futureRideRequestSchema,
  );
