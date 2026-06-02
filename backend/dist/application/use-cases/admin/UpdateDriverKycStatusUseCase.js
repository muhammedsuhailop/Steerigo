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
exports.UpdateDriverKycStatusUseCase = void 0;
const inversify_1 = require("inversify");
const Result_1 = require("../../../shared/utils/Result");
const Logger_1 = require("../../../shared/utils/Logger");
const DITypes_1 = require("../../../shared/constants/DITypes");
const KYCStatus_1 = require("../../../domain/value-objects/KYCStatus");
const DocumentType_1 = require("../../../domain/value-objects/DocumentType");
const KYCValidationErrors_1 = require("../../../domain/errors/KYCValidationErrors");
const DomainError_1 = require("../../../domain/errors/DomainError");
const UpdateDriverKycStatusResponseDto_1 = require("../../dto/admin/UpdateDriverKycStatusResponseDto");
let UpdateDriverKycStatusUseCase = class UpdateDriverKycStatusUseCase {
    constructor(adminDriverRepository, kycRepository, userRepository) {
        this.adminDriverRepository = adminDriverRepository;
        this.kycRepository = kycRepository;
        this.userRepository = userRepository;
    }
    async execute(dto) {
        try {
            Logger_1.Logger.info("Executing UpdateDriverKycStatusUseCase", {
                driverId: dto.getDriverId(),
                newKycStatus: dto.getKycStatus(),
            });
            const validationErrors = dto.validate();
            if (validationErrors.length > 0) {
                return Result_1.Result.failure(new DomainError_1.DomainError(validationErrors.join(", ")));
            }
            const driver = await this.adminDriverRepository.findById(dto.getDriverId());
            if (!driver) {
                Logger_1.Logger.warn("Driver not found", { driverId: dto.getDriverId() });
                return Result_1.Result.failure(new DomainError_1.DomainError("Driver not found"));
            }
            const previousKycStatus = driver.getKycStatus();
            const newKycStatus = dto.getKycStatus();
            const kycDocuments = await this.kycRepository.findByDriverId(dto.getDriverId());
            if (!kycDocuments || kycDocuments.length === 0) {
                Logger_1.Logger.warn("No KYC documents found for driver", {
                    driverId: dto.getDriverId(),
                });
                return Result_1.Result.failure(new KYCValidationErrors_1.KYCNotFoundError("No KYC documents found for this driver"));
            }
            const user = await this.userRepository.findById(driver.getUserId());
            if (!user) {
                Logger_1.Logger.warn("User not found for driver", {
                    driverId: dto.getDriverId(),
                    userId: driver.getUserId(),
                });
                return Result_1.Result.failure(new DomainError_1.DomainError("User not found"));
            }
            if (newKycStatus === KYCStatus_1.KYCStatus.APPROVED) {
                const profilePicture = user.getProfilePicture();
                if (!profilePicture || profilePicture.trim() === "") {
                    Logger_1.Logger.warn("Profile picture not uploaded", {
                        driverId: dto.getDriverId(),
                        userId: user.getId(),
                    });
                    return Result_1.Result.failure(new KYCValidationErrors_1.ProfilePictureNotUploadedError("Driver must upload a profile picture before KYC approval"));
                }
            }
            const licenseDocuments = kycDocuments.filter((kyc) => kyc.getDocumentType() === DocumentType_1.DocumentType.LICENSE);
            const nonLicenseDocuments = kycDocuments.filter((kyc) => kyc.getDocumentType() === DocumentType_1.DocumentType.AADHAAR ||
                kyc.getDocumentType() === DocumentType_1.DocumentType.PAN ||
                kyc.getDocumentType() === DocumentType_1.DocumentType.PASSPORT);
            const hasApprovedNonLicenseKyc = nonLicenseDocuments.some((kyc) => kyc.getVerificationStatus() === KYCStatus_1.KYCStatus.APPROVED);
            if (!hasApprovedNonLicenseKyc) {
                Logger_1.Logger.warn("No approved non-license KYC documents", {
                    driverId: dto.getDriverId(),
                    nonLicenseDocsCount: nonLicenseDocuments.length,
                });
                return Result_1.Result.failure(new KYCValidationErrors_1.NonLicenseKYCNotApprovedError("At least one non-license KYC document (Aadhaar, PAN, or Passport) must be approved"));
            }
            if (licenseDocuments.length === 0) {
                Logger_1.Logger.warn("No license documents found", {
                    driverId: dto.getDriverId(),
                });
                return Result_1.Result.failure(new KYCValidationErrors_1.LicenseNotApprovedError("No license document found for driver"));
            }
            const latestLicense = [...licenseDocuments].sort((a, b) => b.getCreatedAt().getTime() - a.getCreatedAt().getTime())[0];
            if (!latestLicense) {
                Logger_1.Logger.warn("Unable to determine latest license", {
                    driverId: dto.getDriverId(),
                });
                return Result_1.Result.failure(new KYCValidationErrors_1.LicenseNotApprovedError("No license document found for driver"));
            }
            if (latestLicense.getVerificationStatus() !== KYCStatus_1.KYCStatus.APPROVED) {
                Logger_1.Logger.warn("Latest license is not approved", {
                    driverId: dto.getDriverId(),
                    licenseId: latestLicense.getId(),
                    licenseStatus: latestLicense.getVerificationStatus(),
                });
                return Result_1.Result.failure(new KYCValidationErrors_1.LicenseNotApprovedError(`Latest license must be approved. Current status: ${latestLicense.getVerificationStatus()}`));
            }
            driver.updateKycStatus(newKycStatus);
            await this.adminDriverRepository.save(driver);
            Logger_1.Logger.info("Driver KYC status updated successfully", {
                driverId: dto.getDriverId(),
                previousKycStatus,
                newKycStatus,
            });
            const response = new UpdateDriverKycStatusResponseDto_1.UpdateDriverKycStatusResponseDto(`Driver KYC status updated to ${newKycStatus} successfully`, dto.getDriverId(), previousKycStatus, newKycStatus);
            return Result_1.Result.success(response);
        }
        catch (error) {
            Logger_1.Logger.error("Error updating driver KYC status", {
                driverId: dto.getDriverId(),
                error,
            });
            return Result_1.Result.failure(error instanceof DomainError_1.DomainError
                ? error
                : new DomainError_1.DomainError("Failed to update driver KYC status"));
        }
    }
};
exports.UpdateDriverKycStatusUseCase = UpdateDriverKycStatusUseCase;
exports.UpdateDriverKycStatusUseCase = UpdateDriverKycStatusUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.AdminDriverRepository)),
    __param(1, (0, inversify_1.inject)(DITypes_1.TYPES.KYCRepository)),
    __param(2, (0, inversify_1.inject)(DITypes_1.TYPES.UserRepository)),
    __metadata("design:paramtypes", [Object, Object, Object])
], UpdateDriverKycStatusUseCase);
//# sourceMappingURL=UpdateDriverKycStatusUseCase.js.map