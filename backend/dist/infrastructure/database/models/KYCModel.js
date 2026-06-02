"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KYCModel = void 0;
const DocumentType_1 = require("@domain/value-objects/DocumentType");
const KYCStatus_1 = require("@domain/value-objects/KYCStatus");
const mongoose_1 = require("mongoose");
const kycSchema = new mongoose_1.Schema({
    driverId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "Driver",
    },
    docType: {
        type: String,
        enum: DocumentType_1.DocumentType,
        required: true,
    },
    docNumber: {
        type: String,
        required: true,
        trim: true,
    },
    issueDate: {
        type: Date,
    },
    expiryDate: {
        type: Date,
        default: null,
    },
    verificationStatus: {
        type: String,
        enum: KYCStatus_1.KYCStatus,
        default: KYCStatus_1.KYCStatus.IN_REVIEW,
    },
    comments: {
        type: String,
        trim: true,
        maxlength: 1000,
    },
    docImageUrlsFront: [{ type: String, required: true }],
    docImageUrlsBack: [{ type: String, required: true }],
}, {
    timestamps: true,
    collection: "kyc_documents",
});
// Indexes
kycSchema.index({ driverId: 1 });
kycSchema.index({ docType: 1 });
kycSchema.index({ verificationStatus: 1 });
kycSchema.index({ createdAt: -1 });
exports.KYCModel = (0, mongoose_1.model)("KYC", kycSchema);
//# sourceMappingURL=KYCModel.js.map