import { Schema, model, Document } from "mongoose";

interface IFareRule {
  maxHours: number | null;
  ratePerHour: number;
}

export interface IFareConfigurationDocument extends Document {
  baseAmount: number;
  baseHours: number;
  fareRules: IFareRule[];
  platformFeePercentage: number;
  fareTaxPercentage: number;
  platformFeeTaxPercentage: number;
  isActive: boolean;
  effectiveFrom: Date;
  effectiveTill: Date | null;
  maxCancellationCharge: number;
  createdAt: Date;
  updatedAt: Date;
}

const FareRuleSchema = new Schema(
  {
    maxHours: { type: Number, default: null },
    ratePerHour: { type: Number, required: true },
  },
  { _id: false },
);

const FareConfigurationSchema = new Schema<IFareConfigurationDocument>(
  {
    baseAmount: { type: Number, required: true, min: 0 },
    baseHours: { type: Number, required: true, min: 0 },
    fareRules: {
      type: [FareRuleSchema],
      required: true,
      validate: {
        validator: function (rules: IFareRule[]) {
          return rules.length > 0;
        },
        message: "At least one fare rule is required",
      },
    },
    platformFeePercentage: { type: Number, required: true, min: 0, max: 100 },
    fareTaxPercentage: { type: Number, required: true, min: 0, max: 100 },
    platformFeeTaxPercentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    isActive: { type: Boolean, default: true },
    effectiveFrom: { type: Date, required: true },
    effectiveTill: { type: Date, default: null },
    maxCancellationCharge: { type: Number },
  },
  {
    timestamps: true,
    collection: "fare_configurations",
  },
);

FareConfigurationSchema.index({ isActive: 1, effectiveFrom: -1 });

export const FareConfigurationModel = model<IFareConfigurationDocument>(
  "FareConfiguration",
  FareConfigurationSchema,
);
