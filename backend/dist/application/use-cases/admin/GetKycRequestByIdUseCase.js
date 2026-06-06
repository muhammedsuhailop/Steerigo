"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetKycRequestByIdUseCase = void 0;
const inversify_1 = require("inversify");
const Result_1 = require("../../../shared/utils/Result");
const Logger_1 = require("../../../shared/utils/Logger");
const DITypes_1 = require("../../../shared/constants/DITypes");
const GetKycRequestByIdResponseDto_1 = require("../../dto/admin/GetKycRequestByIdResponseDto");
let GetKycRequestByIdUseCase = class GetKycRequestByIdUseCase {
    constructor(kycRepository) {
        this.kycRepository = kycRepository;
    }
    async execute(dto) {
        try {
            Logger_1.Logger.info("Executing GetKycRequestByIdUseCase", {
                kycId: dto.getKycId(),
            });
            const kycWithDriver = await this.kycRepository.findKYCWithDriverInfo(dto.getKycId());
            if (!kycWithDriver) {
                return Result_1.Result.failure(new Error("KYC document not found"));
            }
            const kycDocumentDto = new GetKycRequestByIdResponseDto_1.KycDocumentDto(kycWithDriver.kycDocument.getId(), kycWithDriver.kycDocument.getDocType(), kycWithDriver.kycDocument.getDocNumber(), kycWithDriver.kycDocument.getIssueDate()?.toISOString() || null, kycWithDriver.kycDocument.getExpiryDate()?.toISOString() || null, kycWithDriver.kycDocument.getVerificationStatus(), kycWithDriver.kycDocument.getComments() || null, kycWithDriver.kycDocument.getDocImageUrlsFront(), kycWithDriver.kycDocument.getDocImageUrlsBack(), kycWithDriver.kycDocument.getCreatedAt().toISOString(), kycWithDriver.kycDocument.getUpdatedAt().toISOString(), kycWithDriver.kycDocument.isExpired());
            const driverInfoDto = new GetKycRequestByIdResponseDto_1.DriverInfoDto(kycWithDriver.driverInfo.driverId, kycWithDriver.driverInfo.userId, kycWithDriver.driverInfo.userName, kycWithDriver.driverInfo.userEmail, kycWithDriver.driverInfo.userMobile, kycWithDriver.driverInfo.driverStatus);
            const response = new GetKycRequestByIdResponseDto_1.GetKycRequestByIdResponseDto(kycDocumentDto, driverInfoDto);
            Logger_1.Logger.info("KYC document fetched successfully", {
                kycId: dto.getKycId(),
            });
            return Result_1.Result.success(response);
        }
        catch (error) {
            Logger_1.Logger.error("Error fetching KYC document by ID", error);
            return Result_1.Result.failure(error);
        }
    }
};
exports.GetKycRequestByIdUseCase = GetKycRequestByIdUseCase;
exports.GetKycRequestByIdUseCase = GetKycRequestByIdUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.KYCRepository)),
    __metadata("design:paramtypes", [Object])
], GetKycRequestByIdUseCase);
//# sourceMappingURL=GetKycRequestByIdUseCase.js.map