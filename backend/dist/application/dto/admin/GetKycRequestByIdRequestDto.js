"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetKycRequestByIdRequestDto = void 0;
const zod_1 = require("zod");
const getKycRequestByIdRequestSchema = zod_1.z.object({
    kycId: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid KYC ID format"),
});
class GetKycRequestByIdRequestDto {
    constructor(requestData) {
        this.data = getKycRequestByIdRequestSchema.parse(requestData);
    }
    static fromRequest(requestData) {
        return new GetKycRequestByIdRequestDto(requestData);
    }
    getKycId() {
        return this.data.kycId;
    }
}
exports.GetKycRequestByIdRequestDto = GetKycRequestByIdRequestDto;
//# sourceMappingURL=GetKycRequestByIdRequestDto.js.map