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
exports.GetKycRequestsUseCase = void 0;
const inversify_1 = require("inversify");
const Result_1 = require("../../../shared/utils/Result");
const Logger_1 = require("../../../shared/utils/Logger");
const DITypes_1 = require("../../../shared/constants/DITypes");
const GetKycRequestsResponseDto_1 = require("../../dto/admin/GetKycRequestsResponseDto");
let GetKycRequestsUseCase = class GetKycRequestsUseCase {
    constructor(kycRepository) {
        this.kycRepository = kycRepository;
    }
    async execute(dto) {
        try {
            const dateFrom = dto.getDateFrom();
            const dateTo = dto.getDateTo();
            if (dateFrom && dateTo && dateFrom > dateTo) {
                return Result_1.Result.failure(new Error("Date range is invalid: 'from' date cannot be after 'to' date"));
            }
            const filters = {
                verificationStatus: dto.getVerificationStatus(),
                docType: dto.getDocType(),
                driverId: dto.getDriverId(),
                dateFrom,
                dateTo,
            };
            const pagination = {
                page: dto.getPage(),
                pageSize: dto.getPageSize(),
            };
            Logger_1.Logger.info("Executing GetKycRequestsUseCase", {
                filters: {
                    ...filters,
                    dateFrom: filters.dateFrom?.toISOString(),
                    dateTo: filters.dateTo?.toISOString(),
                },
                pagination,
            });
            const result = await this.kycRepository.findKYCDocumentsWithDriverInfo(filters, pagination);
            const kycDocuments = result.data.map((item) => new GetKycRequestsResponseDto_1.KycRequestListItemDto(new GetKycRequestsResponseDto_1.KycDocumentSummaryDto(item.kycDocument.getId(), item.kycDocument.getDocType(), item.kycDocument.getDocNumber(), item.kycDocument.getIssueDate()?.toISOString() || null, item.kycDocument.getExpiryDate()?.toISOString() || null, item.kycDocument.getVerificationStatus(), item.kycDocument.getComments() || null, item.kycDocument.getDocImageUrlsFront(), item.kycDocument.getDocImageUrlsBack(), item.kycDocument.getCreatedAt().toISOString(), item.kycDocument.getUpdatedAt().toISOString(), item.kycDocument.isExpired()), new GetKycRequestsResponseDto_1.KycDriverInfoDto(item.driverInfo.driverId, item.driverInfo.userId, item.driverInfo.userName, item.driverInfo.userEmail, item.driverInfo.userMobile, item.driverInfo.driverStatus)));
            const paginationDto = new GetKycRequestsResponseDto_1.PaginationDto(result.pagination.currentPage, result.pagination.pageSize, result.pagination.totalItems, result.pagination.totalPages);
            const appliedFiltersDto = new GetKycRequestsResponseDto_1.KycRequestsAppliedFiltersDto(dto.getSortBy(), dto.getSortOrder(), dto.getVerificationStatus() || null, dto.getDocType() || null, dto.getDriverId() || null, dateFrom?.toISOString() || null, dateTo?.toISOString() || null);
            const response = new GetKycRequestsResponseDto_1.GetKycRequestsResponseDto(kycDocuments, paginationDto, appliedFiltersDto);
            Logger_1.Logger.info("KYC documents fetched successfully", {
                totalItems: result.pagination.totalItems,
                currentPage: result.pagination.currentPage,
            });
            return Result_1.Result.success(response);
        }
        catch (error) {
            Logger_1.Logger.error("Error fetching KYC documents", error);
            return Result_1.Result.failure(error);
        }
    }
};
exports.GetKycRequestsUseCase = GetKycRequestsUseCase;
exports.GetKycRequestsUseCase = GetKycRequestsUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.KYCRepository)),
    __metadata("design:paramtypes", [Object])
], GetKycRequestsUseCase);
//# sourceMappingURL=GetKycRequestsUseCase.js.map