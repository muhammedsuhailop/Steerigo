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
exports.UpdateKycStatusUseCase = void 0;
const inversify_1 = require("inversify");
const Result_1 = require("../../../shared/utils/Result");
const Logger_1 = require("../../../shared/utils/Logger");
const DITypes_1 = require("../../../shared/constants/DITypes");
const KYCStatus_1 = require("../../../domain/value-objects/KYCStatus");
const DocumentType_1 = require("../../../domain/value-objects/DocumentType");
let UpdateKycStatusUseCase = class UpdateKycStatusUseCase {
    constructor(kycRepository, adminDriverRepository, userRepository) {
        this.kycRepository = kycRepository;
        this.adminDriverRepository = adminDriverRepository;
        this.userRepository = userRepository;
    }
    async execute(dto) {
        try {
            const validationErrors = dto.validate();
            if (validationErrors.length > 0) {
                return Result_1.Result.failure(new Error(validationErrors.join(", ")));
            }
            const kycWithDriver = await this.kycRepository.findKYCWithDriverInfo(dto.getKycId());
            if (!kycWithDriver) {
                return Result_1.Result.failure(new Error("KYC document not found"));
            }
            const kycDocument = kycWithDriver.kycDocument;
            Logger_1.Logger.info("Executing UpdateKycStatusUseCase", {
                kycId: dto.getKycId(),
                newStatus: dto.getVerificationStatus(),
                currentStatus: kycDocument.getVerificationStatus(),
            });
            // Persist per-document change
            switch (dto.getVerificationStatus()) {
                case "Approved":
                    kycDocument.approve(dto.getComments());
                    break;
                case "Rejected":
                    kycDocument.reject(dto.getComments());
                    break;
                case "Expired":
                    kycDocument.markExpired(dto.getComments());
                    break;
                default:
                    return Result_1.Result.failure(new Error("Invalid verification status"));
            }
            const kycUpdateSuccess = await this.kycRepository.updateVerificationStatus(dto.getKycId(), dto.getVerificationStatus(), dto.getComments());
            if (!kycUpdateSuccess) {
                return Result_1.Result.failure(new Error("Failed to update KYC status"));
            }
            let driverKycStatusUpdated = false;
            try {
                const driver = await this.adminDriverRepository.findById(kycWithDriver.driverInfo.driverId);
                if (driver) {
                    // If the current doc was set to Expired, set overall to EXPIRED
                    if (dto.getVerificationStatus() === "Expired") {
                        if (driver.getKycStatus() !== KYCStatus_1.KYCStatus.EXPIRED) {
                            driver.updateKycStatus(KYCStatus_1.KYCStatus.EXPIRED);
                            await this.adminDriverRepository.save(driver);
                            driverKycStatusUpdated = true;
                            Logger_1.Logger.info("Driver overall KYC set to EXPIRED because updated document status is Expired", {
                                driverId: driver.getId(),
                                kycId: dto.getKycId(),
                            });
                        }
                    }
                    else {
                        const allDriverKycs = await this.kycRepository.findByDriverId(driver.getId());
                        const anyRejected = allDriverKycs.some((k) => k.isRejected());
                        const licenseDocs = allDriverKycs.filter((k) => k.getDocumentType() === DocumentType_1.DocumentType.LICENSE);
                        const nonLicenseDocs = allDriverKycs.filter((k) => k.getDocumentType() === DocumentType_1.DocumentType.AADHAAR ||
                            k.getDocumentType() === DocumentType_1.DocumentType.PAN ||
                            k.getDocumentType() === DocumentType_1.DocumentType.PASSPORT);
                        const latestLicense = licenseDocs.length
                            ? [...licenseDocs].sort((a, b) => b.getCreatedAt().getTime() - a.getCreatedAt().getTime())[0]
                            : undefined;
                        const licenseOk = !!latestLicense && latestLicense.isApproved();
                        const nonLicenseOk = nonLicenseDocs.some((k) => k.isApproved());
                        // Profile picture check
                        const user = await this.userRepository.findById(driver.getUserId());
                        const profilePicturePresent = !!(user && user.getProfilePicture()?.trim());
                        const approvedCondition = licenseOk &&
                            nonLicenseOk &&
                            !anyRejected &&
                            profilePicturePresent;
                        if (approvedCondition) {
                            if (driver.getKycStatus() !== KYCStatus_1.KYCStatus.APPROVED) {
                                driver.updateKycStatus(KYCStatus_1.KYCStatus.APPROVED);
                                await this.adminDriverRepository.save(driver);
                                driverKycStatusUpdated = true;
                                Logger_1.Logger.info("Driver overall KYC set to APPROVED", {
                                    driverId: driver.getId(),
                                });
                            }
                        }
                        else if (dto.getVerificationStatus() === "Rejected") {
                            if (driver.getKycStatus() !== KYCStatus_1.KYCStatus.REJECTED) {
                                driver.updateKycStatus(KYCStatus_1.KYCStatus.REJECTED);
                                await this.adminDriverRepository.save(driver);
                                driverKycStatusUpdated = true;
                                Logger_1.Logger.info("Driver overall KYC set to REJECTED ", {
                                    driverId: driver.getId(),
                                });
                            }
                        }
                        else {
                            Logger_1.Logger.info("Approval conditions not met and current update not Rejected; leaving overall status unchanged", {
                                driverId: driver.getId(),
                            });
                        }
                    }
                }
            }
            catch (err) {
                Logger_1.Logger.warn("Failed to evaluate/apply overall driver KYC status", {
                    driverId: kycWithDriver.driverInfo.driverId,
                    error: err instanceof Error ? err.message : String(err),
                });
            }
            const response = {
                message: `KYC document ${dto.getVerificationStatus().toLowerCase()} successfully`,
                kycDocument: {
                    id: kycDocument.getId(),
                    docType: kycDocument.getDocType(),
                    docNumber: kycDocument.getDocNumber(),
                    verificationStatus: kycDocument.getVerificationStatus(),
                    comments: kycDocument.getComments(),
                    docImageUrlsFront: kycDocument.getDocImageUrlsFront(),
                    docImageUrlsBack: kycDocument.getDocImageUrlsBack(),
                    updatedAt: kycDocument.getUpdatedAt().toISOString(),
                },
                driverKycStatusUpdated,
            };
            Logger_1.Logger.info("KYC status updated successfully", {
                kycId: dto.getKycId(),
                newStatus: dto.getVerificationStatus(),
                driverKycStatusUpdated,
            });
            return Result_1.Result.success(response);
        }
        catch (error) {
            Logger_1.Logger.error("Error updating KYC status", error instanceof Error ? error : String(error));
            return Result_1.Result.failure(error instanceof Error ? error : new Error(String(error)));
        }
    }
};
exports.UpdateKycStatusUseCase = UpdateKycStatusUseCase;
exports.UpdateKycStatusUseCase = UpdateKycStatusUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.KYCRepository)),
    __param(1, (0, inversify_1.inject)(DITypes_1.TYPES.AdminDriverRepository)),
    __param(2, (0, inversify_1.inject)(DITypes_1.TYPES.UserRepository)),
    __metadata("design:paramtypes", [Object, Object, Object])
], UpdateKycStatusUseCase);
//# sourceMappingURL=UpdateKycStatusUseCase.js.map