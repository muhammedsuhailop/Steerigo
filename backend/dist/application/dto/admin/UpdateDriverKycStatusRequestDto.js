"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateDriverKycStatusRequestDto = void 0;
const KYCStatus_1 = require("@domain/value-objects/KYCStatus");
const zod_1 = require("zod");
const updateDriverKycStatusSchema = zod_1.z.object({
    driverId: zod_1.z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId format"),
    kycStatus: zod_1.z.nativeEnum(KYCStatus_1.KYCStatus, {
        message: "KYC status must be one of: InReview, Rejected, Approved, Expired",
    }),
    comments: zod_1.z
        .string()
        .min(1, "Comments must be at least 1 character")
        .max(1000, "Comments cannot exceed 1000 characters")
        .optional(),
});
class UpdateDriverKycStatusRequestDto {
    constructor(requestData) {
        this.data = updateDriverKycStatusSchema.parse(requestData);
    }
    static fromRequest(driverId, requestBody) {
        const body = (requestBody ?? {});
        return new UpdateDriverKycStatusRequestDto({
            driverId,
            kycStatus: body.kycStatus,
            comments: body.comments,
        });
    }
    getDriverId() {
        return this.data.driverId;
    }
    getKycStatus() {
        return this.data.kycStatus;
    }
    getComments() {
        return this.data.comments;
    }
    validate() {
        const errors = [];
        if (this.data.kycStatus === "Rejected" && !this.data.comments) {
            errors.push("Comments are required when rejecting driver KYC status");
        }
        return errors;
    }
}
exports.UpdateDriverKycStatusRequestDto = UpdateDriverKycStatusRequestDto;
//# sourceMappingURL=UpdateDriverKycStatusRequestDto.js.map