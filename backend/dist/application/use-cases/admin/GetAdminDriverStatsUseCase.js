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
exports.GetAdminDriverStatsUseCase = void 0;
const inversify_1 = require("inversify");
const Result_1 = require("../../../shared/utils/Result");
const DITypes_1 = require("../../../shared/constants/DITypes");
const DriverStatus_1 = require("../../../domain/value-objects/DriverStatus");
const KYCStatus_1 = require("../../../domain/value-objects/KYCStatus");
let GetAdminDriverStatsUseCase = class GetAdminDriverStatsUseCase {
    constructor(driverRepository) {
        this.driverRepository = driverRepository;
    }
    async execute(dto) {
        try {
            const now = new Date();
            let fromDate = dto.getFromDate();
            let toDate = dto.getToDate();
            if (!fromDate || !toDate) {
                toDate = now;
                fromDate = new Date();
                fromDate.setDate(now.getDate() - 7); // default last 7 days
            }
            const [totalDrivers, newDrivers, activeDrivers, blockedDrivers, suspendedDrivers, approvedKyc, inReviewKyc, rejectedKyc,] = await Promise.all([
                this.driverRepository.count(),
                this.driverRepository.countNewDrivers({ fromDate, toDate }),
                this.driverRepository.countByStatus(DriverStatus_1.DriverStatus.ACTIVE),
                this.driverRepository.countByStatus(DriverStatus_1.DriverStatus.BLOCKED),
                this.driverRepository.countByStatus(DriverStatus_1.DriverStatus.SUSPENDED),
                this.driverRepository.countByKycStatus(KYCStatus_1.KYCStatus.APPROVED),
                this.driverRepository.countByKycStatus(KYCStatus_1.KYCStatus.IN_REVIEW),
                this.driverRepository.countByKycStatus(KYCStatus_1.KYCStatus.REJECTED),
            ]);
            return Result_1.Result.success({
                fromDate: fromDate.toISOString(),
                toDate: toDate.toISOString(),
                driverStats: {
                    totalDrivers,
                    newDrivers,
                    statusBreakdown: {
                        active: activeDrivers,
                        blocked: blockedDrivers,
                        suspended: suspendedDrivers,
                    },
                    kycBreakdown: {
                        approved: approvedKyc,
                        inReview: inReviewKyc,
                        rejected: rejectedKyc,
                    },
                },
            });
        }
        catch (error) {
            return Result_1.Result.failure(error);
        }
    }
};
exports.GetAdminDriverStatsUseCase = GetAdminDriverStatsUseCase;
exports.GetAdminDriverStatsUseCase = GetAdminDriverStatsUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.DriverRepository)),
    __metadata("design:paramtypes", [Object])
], GetAdminDriverStatsUseCase);
//# sourceMappingURL=GetAdminDriverStatsUseCase.js.map