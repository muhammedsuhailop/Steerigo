import { Document, Schema, model, Model } from "mongoose";
import { PayoutMethod } from "@domain/value-objects/PayoutMethod";
import { PayoutStatus } from "@domain/value-objects/PayoutStatus";

export interface IPayoutDocument extends Document {
  payoutId: string;
  driverId: string;

  amount: number;
  currency: string;

  status: string;
  method: string;

  destination?: {
    type: "BANK" | "UPI";
    accountNumber?: string;
    ifsc?: string;
    beneficiaryName?: string;
    bankName?: string;
    upiId?: string;
  };

  externalPayoutId?: string;

  fee?: number;
  feeCurrency?: string;

  failureReason?: string;

  createdAt: Date;
  processedAt?: Date;
  updatedAt: Date;
}

const destinationSchema = new Schema(
  {
    type: { type: String, enum: ["BANK", "UPI"], required: true },

    accountNumber: String,
    ifsc: String,
    beneficiaryName: String,
    bankName: String,

    upiId: String,
  },
  { _id: false },
);

const payoutSchema = new Schema<IPayoutDocument>(
  {
    payoutId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    driverId: {
      type: String,
      required: true,
      index: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: Object.values(PayoutStatus),
      required: true,
      index: true,
    },

    method: {
      type: String,
      enum: Object.values(PayoutMethod),
      required: true,
    },

    destination: destinationSchema,

    externalPayoutId: String,

    fee: Number,
    feeCurrency: String,

    failureReason: String,

    processedAt: Date,
  },
  {
    timestamps: true,
  },
);

payoutSchema.index({ driverId: 1, createdAt: -1 });

export const PayoutModel: Model<IPayoutDocument> = model<IPayoutDocument>(
  "Payout",
  payoutSchema,
);
