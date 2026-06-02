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
exports.GetDriversUseCase = void 0;
const inversify_1 = require("inversify");
const Result_1 = require("@shared/utils/Result");
const Logger_1 = require("@shared/utils/Logger");
const DITypes_1 = require("@shared/constants/DITypes");
const GetDriversResponseDto_1 = require("@application/dto/admin/GetDriversResponseDto");
let GetDriversUseCase = class GetDriversUseCase {
    constructor(adminDriverRepository) {
        this.adminDriverRepository = adminDriverRepository;
    }
    async execute(dto) {
        try {
            const dateFrom = dto.getDateFrom();
            const dateTo = dto.getDateTo();
            if (dateFrom && dateTo && dateFrom > dateTo) {
                return Result_1.Result.failure(new Error("Date range is invalid: 'from' date cannot be after 'to' date"));
            }
            const filters = {
                status: dto.getStatus(),
                kycStatus: dto.getKycStatus(),
                licenceCategory: dto.getLicenceCategory(),
                search: dto.getSearch(),
                dateFrom,
                dateTo,
            };
            const pagination = {
                page: dto.getPage(),
                pageSize: dto.getPageSize(),
            };
            Logger_1.Logger.info("Executing GetDriversUseCase", {
                filters: {
                    ...filters,
                    dateFrom: filters.dateFrom?.toISOString(),
                    dateTo: filters.dateTo?.toISOString(),
                },
                pagination,
            });
            const result = await this.adminDriverRepository.findDriversWithSummary(filters, pagination);
            const drivers = result.data.map((driver) => new GetDriversResponseDto_1.DriverSummaryDto(driver.driverId, new GetDriversResponseDto_1.DriverUserSummary(driver.userId, driver.userName, driver.userEmail, driver.userMobile), new GetDriversResponseDto_1.DriverStatusInfo(driver.status, driver.kycStatus, driver.licenceCategory, driver.eligibleGearTypes, driver.eligibleBodyTypes), new GetDriversResponseDto_1.DriverLicenseInfo(driver.licenseIssueDate, driver.licenseExpiryDate), new GetDriversResponseDto_1.DriverPerformanceStats(driver.totalRides, driver.totalEarnings, driver.rating, driver.lastRideDate || null), driver.createdAt));
            const paginationDto = new GetDriversResponseDto_1.PaginationDto(result.pagination.currentPage, result.pagination.pageSize, result.pagination.totalItems, result.pagination.totalPages);
            const appliedFiltersDto = new GetDriversResponseDto_1.AppliedFiltersDto(dto.getSortBy(), dto.getSortOrder(), dto.getSearch() || null, dto.getStatus() || null, dto.getKycStatus() || null, dto.getLicenceCategory() || null, dateFrom?.toISOString() || null, dateTo?.toISOString() || null);
            const response = new GetDriversResponseDto_1.GetDriversResponseDto(drivers, paginationDto, appliedFiltersDto);
            Logger_1.Logger.info("Drivers fetched successfully", {
                totalItems: result.pagination.totalItems,
                currentPage: result.pagination.currentPage,
            });
            return Result_1.Result.success(response);
        }
        catch (error) {
            Logger_1.Logger.error("Error fetching drivers", error);
            return Result_1.Result.failure(error);
        }
    }
};
exports.GetDriversUseCase = GetDriversUseCase;
exports.GetDriversUseCase = GetDriversUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.AdminDriverRepository)),
    __metadata("design:paramtypes", [Object])
], GetDriversUseCase);
//# sourceMappingURL=GetDriversUseCase.js.map