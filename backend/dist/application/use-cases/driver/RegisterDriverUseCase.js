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
exports.DriverRegistrationUseCase = void 0;
const inversify_1 = require("inversify");
const Result_1 = require("@shared/utils/Result");
const Driver_1 = require("@domain/entities/Driver");
const KYC_1 = require("@domain/entities/KYC");
const DomainError_1 = require("@domain/errors/DomainError");
const Logger_1 = require("@shared/utils/Logger");
const DITypes_1 = require("@shared/constants/DITypes");
const AuthConstants_1 = require("@shared/constants/AuthConstants");
const mongoose_1 = require("mongoose");
const DocumentType_1 = require("@domain/value-objects/DocumentType");
let DriverRegistrationUseCase = class DriverRegistrationUseCase {
    constructor(driverRepository, userRepository, kycRepository) {
        this.driverRepository = driverRepository;
        this.userRepository = userRepository;
        this.kycRepository = kycRepository;
    }
    async execute(dto) {
        try {
            Logger_1.Logger.info("Comprehensive driver registration started", dto.getUserId());
            const user = await this.userRepository.findById(dto.getUserId());
            if (!user) {
                return Result_1.Result.failure(new DomainError_1.DomainError("User not found"));
            }
            const existingDriver = await this.driverRepository.findByUserId(dto.getUserId());
            if (existingDriver) {
                return Result_1.Result.failure(new DomainError_1.DomainError("User is already registered as a driver"));
            }
            const now = new Date();
            if (dto.getLicenseExpiryDate() <= now) {
                return Result_1.Result.failure(new DomainError_1.DomainError("License expiry date must be in the future"));
            }
            if (dto.getLicenseIssueDate() > now) {
                return Result_1.Result.failure(new DomainError_1.DomainError("License issue date cannot be in the future"));
            }
            const idExpiryDate = dto.getIdExpiryDate();
            if (idExpiryDate !== null && idExpiryDate <= now) {
                return Result_1.Result.failure(new DomainError_1.DomainError("ID expiry date must be in the future"));
            }
            if (dto.getIdIssueDate() > now) {
                return Result_1.Result.failure(new DomainError_1.DomainError("ID issue date cannot be in the future"));
            }
            const driverId = new mongoose_1.Types.ObjectId().toString();
            user.updateProfile({
                name: dto.getName(),
                mobile: dto.getMobile(),
                dob: dto.getDob(),
                gender: dto.getGender(),
                address: dto.getFullAddress(),
            });
            const driver = Driver_1.Driver.create(driverId, dto.getUserId(), dto.getEligibleGearTypes(), dto.getEligibleBodyTypes(), dto.getLicenseNumber(), dto.getLicenseCategory(), dto.getLicenseIssueDate(), dto.getLicenseExpiryDate());
            const licenseKycId = new mongoose_1.Types.ObjectId().toString();
            const idKycId = new mongoose_1.Types.ObjectId().toString();
            const licenseKyc = KYC_1.KYC.create(licenseKycId, driverId, DocumentType_1.DocumentType.LICENSE, dto.getLicenseNumber(), dto.getLicenseIssueDate(), dto.getLicenseExpiryDate(), [dto.getLicenseFrontImage()], [dto.getLicenseBackImage()]);
            const idKyc = KYC_1.KYC.create(idKycId, driverId, dto.getIdType(), dto.getIdNumber(), dto.getIdIssueDate(), dto.getIdExpiryDate() ?? undefined, [dto.getIdFrontImage()], [dto.getIdBackImage()]);
            try {
                await this.userRepository.save(user);
                const savedDriver = await this.driverRepository.save(driver);
                if (!savedDriver) {
                    throw new Error("Failed to save driver");
                }
                await this.kycRepository.save(licenseKyc);
                await this.kycRepository.save(idKyc);
                if (user.getRole() !== AuthConstants_1.UserRole.DRIVER) {
                    Logger_1.Logger.info("User role should be updated to DRIVER", dto.getUserId());
                }
                const response = {
                    driver: {
                        id: savedDriver.getId(),
                        userId: savedDriver.getUserId(),
                        eligibleGearTypes: savedDriver.getEligibleGearTypes(),
                        eligibleBodyTypes: savedDriver.getEligibleBodyTypes(),
                        licenceCategory: savedDriver.getLicenceCategory(),
                        licenseIssueDate: savedDriver.getLicenseIssueDate(),
                        licenseExpiryDate: savedDriver.getLicenseExpiryDate(),
                        kycStatus: savedDriver.getKycStatus(),
                        status: savedDriver.getStatus(),
                        createdAt: savedDriver.getCreatedAt(),
                        updatedAt: savedDriver.getUpdatedAt(),
                    },
                    kycDocumentsCreated: {
                        license: licenseKycId,
                        idDocument: idKycId,
                    },
                    userUpdated: true,
                };
                Logger_1.Logger.info("Comprehensive driver registration successful", {
                    userId: savedDriver.getUserId(),
                    driverId: savedDriver.getId(),
                    licenseKycId,
                    idKycId,
                });
                return Result_1.Result.success(response);
            }
            catch (saveError) {
                Logger_1.Logger.error("Failed to save driver registration data", {
                    userId: dto.getUserId(),
                    error: saveError,
                });
                throw saveError;
            }
        }
        catch (error) {
            Logger_1.Logger.error("Comprehensive driver registration failed", {
                userId: dto.getUserId(),
                error,
            });
            return Result_1.Result.failure(error);
        }
    }
};
exports.DriverRegistrationUseCase = DriverRegistrationUseCase;
exports.DriverRegistrationUseCase = DriverRegistrationUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.DriverRepository)),
    __param(1, (0, inversify_1.inject)(DITypes_1.TYPES.UserRepository)),
    __param(2, (0, inversify_1.inject)(DITypes_1.TYPES.KYCRepository)),
    __metadata("design:paramtypes", [Object, Object, Object])
], DriverRegistrationUseCase);
//# sourceMappingURL=RegisterDriverUseCase.js.map