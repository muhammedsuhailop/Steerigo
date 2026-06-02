"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FareConfigurationModel = void 0;
const mongoose_1 = require("mongoose");
const FareRuleSchema = new mongoose_1.Schema({
    maxHours: { type: Number, default: null },
    ratePerHour: { type: Number, required: true },
}, { _id: false });
const FareConfigurationSchema = new mongoose_1.Schema({
    baseAmount: { type: Number, required: true, min: 0 },
    baseHours: { type: Number, required: true, min: 0 },
    fareRules: {
        type: [FareRuleSchema],
        required: true,
        validate: {
            validator: function (rules) {
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
}, {
    timestamps: true,
    collection: "fare_configurations",
});
FareConfigurationSchema.index({ isActive: 1, effectiveFrom: -1 });
exports.FareConfigurationModel = (0, mongoose_1.model)("FareConfiguration", FareConfigurationSchema);
//# sourceMappingURL=FareConfigurationModel.js.map