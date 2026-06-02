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
exports.GetKYCStatusUseCase = void 0;
const inversify_1 = require("inversify");
const Result_1 = require("../../../shared/utils/Result");
const DomainError_1 = require("../../../domain/errors/DomainError");
const Logger_1 = require("../../../shared/utils/Logger");
const DITypes_1 = require("../../../shared/constants/DITypes");
let GetKYCStatusUseCase = class GetKYCStatusUseCase {
    constructor(driverRepository, kycRepository) {
        this.driverRepository = driverRepository;
        this.kycRepository = kycRepository;
    }
    async execute(userId) {
        try {
            Logger_1.Logger.info("Get KYC status started", { userId });
            const driver = await this.driverRepository.findByUserId(userId);
            if (!driver) {
                return Result_1.Result.failure(new DomainError_1.DomainError("Driver profile not found"));
            }
            const kycDocuments = await this.kycRepository.findByDriverId(driver.getId());
            const response = kycDocuments.map((kyc) => ({
                id: kyc.getId(),
                driverId: kyc.getDriverId(),
                docType: kyc.getDocType(),
                docNumber: kyc.getDocNumber(),
                issueDate: kyc.getIssueDate(),
                expiryDate: kyc.getExpiryDate(),
                verificationStatus: kyc.getVerificationStatus(),
                comments: kyc.getComments(),
                docImageUrlsFront: kyc.getDocImageUrlsFront(),
                docImageUrlsBack: kyc.getDocImageUrlsBack(),
                createdAt: kyc.getCreatedAt(),
                updatedAt: kyc.getUpdatedAt(),
            }));
            Logger_1.Logger.info("Get KYC status successful", {
                userId,
                driverId: driver.getId(),
                documentCount: kycDocuments.length,
            });
            return Result_1.Result.success(response);
        }
        catch (error) {
            Logger_1.Logger.error("Get KYC status failed", { userId, error });
            return Result_1.Result.failure(error);
        }
    }
};
exports.GetKYCStatusUseCase = GetKYCStatusUseCase;
exports.GetKYCStatusUseCase = GetKYCStatusUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.DriverRepository)),
    __param(1, (0, inversify_1.inject)(DITypes_1.TYPES.KYCRepository)),
    __metadata("design:paramtypes", [Object, Object])
], GetKYCStatusUseCase);
//# sourceMappingURL=GetKYCStatusUseCase.js.map