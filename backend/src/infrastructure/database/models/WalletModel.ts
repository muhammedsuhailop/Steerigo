import { Schema, model, Document, Model } from "mongoose";
import { WalletOwnerType } from "@domain/value-objects/WalletOwnerType";

export interface IWalletDocument extends Document {
  walletId: string;

  ownerId: string;
  ownerType: string;

  availableBalance: number;
  pendingBalance: number;

  currency: string;

  createdAt: Date;
  updatedAt: Date;
}

const walletSchema = new Schema<IWalletDocument>(
  {
    walletId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    ownerId: {
      type: String,
      required: true,
      index: true,
    },

    ownerType: {
      type: String,
      enum: Object.values(WalletOwnerType),
      required: true,
      index: true,
    },

    availableBalance: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    pendingBalance: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    currency: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

walletSchema.index({ ownerId: 1, ownerType: 1 });

export const WalletModel: Model<IWalletDocument> = model<IWalletDocument>(
  "Wallet",
  walletSchema,
);
