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
exports.GetDriverProfileUseCase = void 0;
const inversify_1 = require("inversify");
const GetDriverProfileResponseDto_1 = require("@application/dto/admin/GetDriverProfileResponseDto");
const Result_1 = require("@shared/utils/Result");
const Logger_1 = require("@shared/utils/Logger");
const DITypes_1 = require("@shared/constants/DITypes");
const DomainError_1 = require("@domain/errors/DomainError");
let GetDriverProfileUseCase = class GetDriverProfileUseCase {
    constructor(adminDriverRepository, kycRepository) {
        this.adminDriverRepository = adminDriverRepository;
        this.kycRepository = kycRepository;
    }
    async execute(dto) {
        try {
            Logger_1.Logger.info("Executing GetDriverProfileUseCase", {
                driverId: dto.getDriverId(),
            });
            const driverProfile = await this.adminDriverRepository.findDriverProfile(dto.getDriverId());
            if (!driverProfile) {
                Logger_1.Logger.warn("Driver profile not found", {
                    driverId: dto.getDriverId(),
                });
                return Result_1.Result.failure(new DomainError_1.DomainError("Driver not found"));
            }
            const kycDocuments = await this.kycRepository.findByDriverId(dto.getDriverId());
            const driverInfo = new GetDriverProfileResponseDto_1.AdminDriverInfo(driverProfile.driver.getId(), driverProfile.driver.getUserId(), driverProfile.driver.getStatus(), driverProfile.driver.getKycStatus(), driverProfile.driver.getLicenceCategory(), driverProfile.driver.getEligibleGearTypes(), driverProfile.driver.getEligibleBodyTypes(), driverProfile.driver.getLicenseIssueDate(), driverProfile.driver.getLicenseExpiryDate(), driverProfile.driver.getCreatedAt(), driverProfile.driver.getUpdatedAt());
            const userInfo = new GetDriverProfileResponseDto_1.AdminUserInfo(driverProfile.user.id, driverProfile.user.name, driverProfile.user.email, driverProfile.user.mobile, driverProfile.user.profilePicture);
            const stats = new GetDriverProfileResponseDto_1.DriverStatistics(driverProfile.stats.totalRides, driverProfile.stats.totalEarnings, driverProfile.stats.rating, driverProfile.stats.lastRideDate || null);
            const mappedKycDocuments = kycDocuments.map((kyc) => new GetDriverProfileResponseDto_1.AdminKycDocument(kyc.getId(), kyc.getDocType(), kyc.getDocNumber(), kyc.getIssueDate() || null, kyc.getExpiryDate() || null, kyc.getVerificationStatus(), kyc.getComments() || null, kyc.isExpired(), kyc.getCreatedAt(), kyc.getUpdatedAt()));
            const response = new GetDriverProfileResponseDto_1.AdminGetDriverProfileResponseDto(driverInfo, userInfo, stats, mappedKycDocuments);
            Logger_1.Logger.info("Admin driver profile fetched successfully", {
                driverId: dto.getDriverId(),
                kycDocumentsCount: kycDocuments.length,
            });
            return Result_1.Result.success(response);
        }
        catch (error) {
            Logger_1.Logger.error("Error fetching admin driver profile", {
                driverId: dto.getDriverId(),
                error,
            });
            return Result_1.Result.failure(error instanceof DomainError_1.DomainError
                ? error
                : new DomainError_1.DomainError("Failed to fetch driver profile"));
        }
    }
};
exports.GetDriverProfileUseCase = GetDriverProfileUseCase;
exports.GetDriverProfileUseCase = GetDriverProfileUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.AdminDriverRepository)),
    __param(1, (0, inversify_1.inject)(DITypes_1.TYPES.KYCRepository)),
    __metadata("design:paramtypes", [Object, Object])
], GetDriverProfileUseCase);
//# sourceMappingURL=GetDriverProfileUseCase.js.map