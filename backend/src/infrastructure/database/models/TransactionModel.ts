import { Document, Schema, model, Model, Types } from "mongoose";
import { TransactionDirection } from "@domain/value-objects/TransactionDirection";
import { TransactionType } from "@domain/value-objects/TransactionType";

export interface ITransactionDocument extends Document {
  _id: Types.ObjectId;
  transactionId: string;

  walletId: string;

  type: string;
  direction: string;

  amount: number;
  currency: string;

  relatedEntityId?: string;
  relatedEntityType?: string;
  groupId?: string;

  note?: string;

  metadata?: Record<string, string>;

  createdAt: Date;
}

const transactionSchema = new Schema<ITransactionDocument>(
  {
    transactionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    walletId: {
      type: String,
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: Object.values(TransactionType),
      required: true,
      index: true,
    },

    direction: {
      type: String,
      enum: Object.values(TransactionDirection),
      required: true,
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

    relatedEntityId: {
      type: String,
    },

    relatedEntityType: {
      type: String,
    },

    groupId: {
      type: String,
      index: true,
    },

    note: {
      type: String,
    },

    metadata: {
      type: Schema.Types.Mixed,
    },

    createdAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  { versionKey: false },
);

transactionSchema.index({ walletId: 1, createdAt: -1 });

export const TransactionModel: Model<ITransactionDocument> =
  model<ITransactionDocument>("Transaction", transactionSchema);
