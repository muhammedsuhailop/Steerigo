"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateKycStatusRequestDto = void 0;
const KYCStatus_1 = require("../../../domain/value-objects/KYCStatus");
const zod_1 = require("zod");
const updateKycStatusRequestSchema = zod_1.z.object({
    kycId: zod_1.z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId format"),
    verificationStatus: zod_1.z.nativeEnum(KYCStatus_1.KYCStatus, {
        message: `Verification status must be one of: ${Object.values(KYCStatus_1.KYCStatus).join(", ")}`,
    }),
    comments: zod_1.z.string().min(1).max(1000).optional(),
    docImageUrlsFront: zod_1.z.array(zod_1.z.string().url()).optional(),
    docImageUrlsBack: zod_1.z.array(zod_1.z.string().url()).optional(),
});
class UpdateKycStatusRequestDto {
    constructor(requestData) {
        this.data = updateKycStatusRequestSchema.parse(requestData);
    }
    static fromRequest(kycId, requestBody) {
        const body = (requestBody ?? {});
        const mergedData = {
            kycId,
            verificationStatus: body.verificationStatus,
            comments: body.comments,
            docImageUrlsFront: body.docImageUrlsFront,
            docImageUrlsBack: body.docImageUrlsBack,
        };
        return new UpdateKycStatusRequestDto(mergedData);
    }
    getKycId() {
        return this.data.kycId;
    }
    getVerificationStatus() {
        return this.data.verificationStatus;
    }
    getComments() {
        return this.data.comments;
    }
    getDocImageUrlsFront() {
        return this.data.docImageUrlsFront;
    }
    getDocImageUrlsBack() {
        return this.data.docImageUrlsBack;
    }
    validate() {
        const errors = [];
        if (this.data.verificationStatus === "Rejected" && !this.data.comments) {
            errors.push("Comments are required when rejecting KYC documents");
        }
        if (this.data.comments) {
            if (this.data.comments.length < 1) {
                errors.push("Comments cannot be empty");
            }
            if (this.data.comments.length > 1000) {
                errors.push("Comments cannot exceed 1000 characters");
            }
        }
        return errors;
    }
}
exports.UpdateKycStatusRequestDto = UpdateKycStatusRequestDto;
//# sourceMappingURL=UpdateKycStatusRequestDto.js.map