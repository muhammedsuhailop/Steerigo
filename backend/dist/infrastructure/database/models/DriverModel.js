"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverModel = void 0;
const DriverStatus_1 = require("@domain/value-objects/DriverStatus");
const KYCStatus_1 = require("@domain/value-objects/KYCStatus");
const LicenseCategory_1 = require("@domain/value-objects/LicenseCategory");
const VehicleType_1 = require("@domain/value-objects/VehicleType");
const mongoose_1 = require("mongoose");
const driverSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        unique: true,
        ref: "User",
    },
    eligibleGearTypes: [
        {
            type: String,
            enum: VehicleType_1.GearType,
            required: true,
        },
    ],
    eligibleBodyTypes: [
        {
            type: String,
            enum: VehicleType_1.BodyType,
            required: true,
        },
    ],
    licenseNumber: {
        type: String,
        required: true,
    },
    licenceCategory: {
        type: String,
        enum: LicenseCategory_1.LicenseCategory,
        required: true,
    },
    licenseIssueDate: {
        type: Date,
        required: true,
    },
    licenseExpiryDate: {
        type: Date,
        required: true,
    },
    kycStatus: {
        type: String,
        enum: KYCStatus_1.KYCStatus,
        default: KYCStatus_1.KYCStatus.IN_REVIEW,
    },
    status: {
        type: String,
        enum: DriverStatus_1.DriverStatus,
        default: DriverStatus_1.DriverStatus.ACTIVE,
    },
    averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
    },
    numberOfRatings: {
        type: Number,
        default: 0,
        min: 0,
    },
    totalRides: {
        type: Number,
        default: 0,
        min: 0,
    },
}, {
    timestamps: true,
    collection: "drivers",
});
// Indexes
driverSchema.index({ status: 1 });
driverSchema.index({ kycStatus: 1 });
driverSchema.index({ licenceCategory: 1 });
driverSchema.index({ createdAt: -1 });
exports.DriverModel = (0, mongoose_1.model)("Driver", driverSchema);
//# sourceMappingURL=DriverModel.js.map