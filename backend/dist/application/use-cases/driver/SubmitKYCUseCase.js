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
exports.SubmitKYCUseCase = void 0;
const inversify_1 = require("inversify");
const Result_1 = require("../../../shared/utils/Result");
const KYC_1 = require("../../../domain/entities/KYC");
const DomainError_1 = require("../../../domain/errors/DomainError");
const Logger_1 = require("../../../shared/utils/Logger");
const DITypes_1 = require("../../../shared/constants/DITypes");
const DocumentType_1 = require("../../../domain/value-objects/DocumentType");
const KYCStatus_1 = require("../../../domain/value-objects/KYCStatus");
const mongoose_1 = require("mongoose");
const SubmitKYCResponseDto_1 = require("../../dto/driver/SubmitKYCResponseDto");
let SubmitKYCUseCase = class SubmitKYCUseCase {
    constructor(driverRepository, kycRepository) {
        this.driverRepository = driverRepository;
        this.kycRepository = kycRepository;
    }
    async execute(dto) {
        try {
            const validationErrors = dto.validate();
            if (validationErrors.length > 0) {
                Logger_1.Logger.warn("KYC submission validation failed", {
                    userId: dto.getUserId(),
                    errors: validationErrors,
                });
                return Result_1.Result.failure(new DomainError_1.DomainError(validationErrors.join(", ")));
            }
            const driver = await this.driverRepository.findByUserId(dto.getUserId());
            if (!driver) {
                Logger_1.Logger.warn("Driver profile not found for KYC update", dto.getUserId());
                return Result_1.Result.failure(new DomainError_1.DomainError("Driver profile not found"));
            }
            Logger_1.Logger.info("KYC submission started", {
                userId: dto.getUserId(),
                driverId: driver.getId(),
                hasLicense: dto.hasLicenseUpdate(),
                hasId: dto.hasIdUpdate(),
            });
            const now = new Date();
            if (dto.getLicenseExpiryDate()) {
                if (dto.getLicenseExpiryDate() <= now) {
                    Logger_1.Logger.warn("License expiry date in past", dto.getUserId());
                    return Result_1.Result.failure(new DomainError_1.DomainError("License expiry date must be in the future"));
                }
            }
            if (dto.getLicenseIssueDate()) {
                if (dto.getLicenseIssueDate() > now) {
                    Logger_1.Logger.warn("License issue date in future", dto.getUserId());
                    return Result_1.Result.failure(new DomainError_1.DomainError("License issue date cannot be in the future"));
                }
            }
            if (dto.getIdExpiryDate() !== undefined &&
                dto.getIdExpiryDate() !== null) {
                if (dto.getIdExpiryDate() <= now) {
                    Logger_1.Logger.warn("ID expiry date in past", dto.getUserId());
                    return Result_1.Result.failure(new DomainError_1.DomainError("ID expiry date must be in the future"));
                }
            }
            if (dto.getIdIssueDate()) {
                if (dto.getIdIssueDate() > now) {
                    Logger_1.Logger.warn("ID issue date in future", dto.getUserId());
                    return Result_1.Result.failure(new DomainError_1.DomainError("ID issue date cannot be in the future"));
                }
            }
            const kycDocuments = {};
            let licenseUpdated = false;
            let idUpdated = false;
            let driverUpdated = false;
            if (dto.hasLicenseUpdate()) {
                const licenseKyc = await this.createNewLicenseKyc(driver.getId(), dto);
                if (licenseKyc) {
                    kycDocuments.license = licenseKyc.getId();
                    licenseUpdated = true;
                    Logger_1.Logger.info("New license KYC created", {
                        userId: dto.getUserId(),
                        driverId: driver.getId(),
                        kycId: licenseKyc.getId(),
                        licenseNumber: dto.getLicenseNumber(),
                    });
                    driver.updateLicenseInfo(dto.getLicenseCategory(), dto.getLicenseIssueDate(), dto.getLicenseExpiryDate());
                    const gearTypes = dto.getEligibleGearTypes();
                    const bodyTypes = dto.getEligibleBodyTypes();
                    if (gearTypes && bodyTypes) {
                        driver.updateEligibleVehicles(gearTypes, bodyTypes);
                        Logger_1.Logger.info("Driver eligible vehicles updated", {
                            userId: dto.getUserId(),
                            gearTypes,
                            bodyTypes,
                        });
                    }
                    driver.updateKycStatus(KYCStatus_1.KYCStatus.IN_REVIEW);
                    await this.driverRepository.save(driver);
                    driverUpdated = true;
                    Logger_1.Logger.info("Driver license information updated", {
                        userId: dto.getUserId(),
                        driverId: driver.getId(),
                        kycStatusSet: KYCStatus_1.KYCStatus.IN_REVIEW,
                    });
                }
            }
            if (dto.hasIdUpdate()) {
                const idKyc = await this.createNewIdKyc(driver.getId(), dto);
                if (idKyc) {
                    kycDocuments.id = idKyc.getId();
                    idUpdated = true;
                    Logger_1.Logger.info("New ID KYC created", {
                        userId: driver.getUserId(),
                        driverId: driver.getId(),
                        kycId: idKyc.getId(),
                        idType: dto.getIdType(),
                    });
                }
            }
            const response = new SubmitKYCResponseDto_1.SubmitKYCResponseDto("KYC documents submitted successfully", kycDocuments, licenseUpdated, idUpdated, driverUpdated);
            Logger_1.Logger.info("KYC submission completed successfully", {
                userId: driver.getUserId(),
                driverId: driver.getId(),
                kycDocuments,
                driverUpdated,
            });
            return Result_1.Result.success(response);
        }
        catch (error) {
            Logger_1.Logger.error("KYC submission failed", {
                userId: dto.getUserId(),
                error: error instanceof Error ? error.message : String(error),
            });
            return Result_1.Result.failure(error);
        }
    }
    async createNewLicenseKyc(driverId, dto) {
        try {
            const licenseId = new mongoose_1.Types.ObjectId().toString();
            const licenseImages = dto.getLicenseImageUrls() || {
                front: [],
                back: [],
            };
            const licenseKyc = KYC_1.KYC.create(licenseId, driverId, DocumentType_1.DocumentType.LICENSE, dto.getLicenseNumber(), dto.getLicenseIssueDate(), dto.getLicenseExpiryDate(), licenseImages.front, licenseImages.back);
            const savedKyc = await this.kycRepository.save(licenseKyc);
            Logger_1.Logger.info("New license KYC saved to DB", {
                driverId,
                kycId: savedKyc.getId(),
            });
            return savedKyc;
        }
        catch (error) {
            Logger_1.Logger.error("Failed to create new license KYC", {
                driverId,
                error,
            });
            throw error;
        }
    }
    async createNewIdKyc(driverId, dto) {
        try {
            const idId = new mongoose_1.Types.ObjectId().toString();
            const idImages = dto.getIdImageUrls() || {
                front: [],
                back: [],
            };
            const idKyc = KYC_1.KYC.create(idId, driverId, dto.getIdType(), dto.getIdNumber(), dto.getIdIssueDate(), dto.getIdExpiryDate() ?? undefined, idImages.front, idImages.back);
            const savedKyc = await this.kycRepository.save(idKyc);
            Logger_1.Logger.info("New ID KYC saved to DB", {
                driverId,
                kycId: savedKyc.getId(),
                idType: dto.getIdType(),
            });
            return savedKyc;
        }
        catch (error) {
            Logger_1.Logger.error("Failed to create new ID KYC", {
                driverId,
                error,
            });
            throw error;
        }
    }
};
exports.SubmitKYCUseCase = SubmitKYCUseCase;
exports.SubmitKYCUseCase = SubmitKYCUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.DriverRepository)),
    __param(1, (0, inversify_1.inject)(DITypes_1.TYPES.KYCRepository)),
    __metadata("design:paramtypes", [Object, Object])
], SubmitKYCUseCase);
//# sourceMappingURL=SubmitKYCUseCase.js.map