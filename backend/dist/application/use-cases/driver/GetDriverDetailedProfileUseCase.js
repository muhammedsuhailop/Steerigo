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
exports.GetDriverDetailedProfileUseCase = void 0;
const inversify_1 = require("inversify");
const Result_1 = require("../../../shared/utils/Result");
const DomainError_1 = require("../../../domain/errors/DomainError");
const Logger_1 = require("../../../shared/utils/Logger");
const DITypes_1 = require("../../../shared/constants/DITypes");
const DriverProfileErrors_1 = require("../../../domain/errors/DriverProfileErrors");
let GetDriverDetailedProfileUseCase = class GetDriverDetailedProfileUseCase {
    constructor(driverRepository, userRepository, kycRepository) {
        this.driverRepository = driverRepository;
        this.userRepository = userRepository;
        this.kycRepository = kycRepository;
    }
    async execute(dto) {
        try {
            if (!dto.isValid()) {
                Logger_1.Logger.warn("Invalid driver profile request", {
                    userId: dto.getUserId(),
                });
                return Result_1.Result.failure(new DomainError_1.DomainError("Invalid user ID provided"));
            }
            const userId = dto.getUserId();
            Logger_1.Logger.info("Get driver detailed profile started", { userId });
            const [driver, user] = await Promise.all([
                this.driverRepository.findByUserId(userId),
                this.userRepository.findById(userId),
            ]);
            if (!user) {
                Logger_1.Logger.warn("User not found", { userId });
                return Result_1.Result.failure(new DriverProfileErrors_1.UserNotFoundError(userId));
            }
            if (!driver) {
                Logger_1.Logger.warn("Driver profile not found", { userId });
                return Result_1.Result.failure(new DriverProfileErrors_1.DriverProfileNotFoundError(userId));
            }
            let kycDocuments = [];
            try {
                kycDocuments = await this.kycRepository.findByDriverId(driver.getId());
            }
            catch (error) {
                Logger_1.Logger.warn("Unable to fetch KYC documents", {
                    driverId: driver.getId(),
                    error,
                });
            }
            const licenseInfo = {
                licenseNumber: driver.getLicenseNumber(),
                licenceCategory: driver.getLicenceCategory(),
                licenseIssueDate: driver.getLicenseIssueDate(),
                licenseExpiryDate: driver.getLicenseExpiryDate(),
                licenseVerified: driver.getKycStatus() === "Approved",
            };
            const kycInfo = {
                overallStatus: driver.getKycStatus(),
                docs: kycDocuments.map((kyc) => ({
                    docId: kyc.getId(),
                    docType: kyc.getDocumentType?.() ?? "",
                    docNumberMasked: this.maskDocumentNumber(kyc.getDocumentNumber?.() ?? ""),
                    issueDate: kyc.getIssueDate?.(),
                    expiryDate: kyc.getExpiryDate?.(),
                    docImageUrlsFront: kyc.getDocImageUrlsFront?.() ?? [],
                    docImageUrlsBack: kyc.getDocImageUrlsBack?.() ?? [],
                    verificationStatus: kyc.getVerificationStatus?.() ?? "Pending",
                    createdAt: kyc.getCreatedAt(),
                    updatedAt: kyc.getUpdatedAt(),
                    comments: kyc.getComments(),
                })),
            };
            const response = {
                driverId: driver.getId(),
                userId: userId,
                name: user.getName(),
                profileImageUrl: user.getProfilePicture() || "",
                email: user.getEmailValue(),
                mobile: user.getMobile() || "",
                dob: user.getDob() || new Date(),
                gender: user.getGender() || "",
                address: user.getAddress() || "",
                role: user.getRole(),
                status: driver.getStatus(),
                isVerified: user.getIsVerified(),
                authProvider: user.getAuthProvider(),
                createdAt: user.getCreatedAt(),
                updatedAt: user.getUpdatedAt(),
                license: licenseInfo,
                kyc: kycInfo,
                eligibleGearTypes: driver.getEligibleGearTypes(),
                eligibleBodyTypes: driver.getEligibleBodyTypes(),
                meta: {
                    lastUpdated: user.getUpdatedAt(),
                    serverTime: new Date(),
                },
            };
            Logger_1.Logger.info("Driver detailed profile fetched successfully", {
                userId,
                driverId: driver.getId(),
            });
            return Result_1.Result.success(response);
        }
        catch (error) {
            Logger_1.Logger.error("Get driver detailed profile failed", {
                userId: dto.getUserId(),
                error,
            });
            return Result_1.Result.failure(error instanceof DomainError_1.DomainError
                ? error
                : new DomainError_1.DomainError("Failed to fetch driver profile"));
        }
    }
    maskDocumentNumber(docNumber) {
        if (!docNumber || docNumber.length <= 4)
            return "****";
        return "****" + docNumber.slice(-4);
    }
};
exports.GetDriverDetailedProfileUseCase = GetDriverDetailedProfileUseCase;
exports.GetDriverDetailedProfileUseCase = GetDriverDetailedProfileUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.DriverRepository)),
    __param(1, (0, inversify_1.inject)(DITypes_1.TYPES.UserRepository)),
    __param(2, (0, inversify_1.inject)(DITypes_1.TYPES.KYCRepository)),
    __metadata("design:paramtypes", [Object, Object, Object])
], GetDriverDetailedProfileUseCase);
//# sourceMappingURL=GetDriverDetailedProfileUseCase.js.map