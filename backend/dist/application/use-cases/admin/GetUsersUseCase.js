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
exports.GetUsersUseCase = void 0;
const inversify_1 = require("inversify");
const Result_1 = require("../../../shared/utils/Result");
const Logger_1 = require("../../../shared/utils/Logger");
const DITypes_1 = require("../../../shared/constants/DITypes");
const GetUsersResponseDto_1 = require("../../dto/admin/GetUsersResponseDto");
let GetUsersUseCase = class GetUsersUseCase {
    constructor(adminUserRepository, rideRepository) {
        this.adminUserRepository = adminUserRepository;
        this.rideRepository = rideRepository;
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
                search: dto.getSearch(),
                dateFrom,
                dateTo,
            };
            const pagination = {
                page: dto.getPage(),
                pageSize: dto.getPageSize(),
            };
            Logger_1.Logger.info("Executing GetUsersUseCase", {
                filters: {
                    ...filters,
                    dateFrom: filters.dateFrom?.toISOString(),
                    dateTo: filters.dateTo?.toISOString(),
                },
                pagination,
            });
            const result = await this.adminUserRepository.findUsersWithSummary(filters, pagination);
            const usersWithStats = await Promise.all(result.data.map(async (user) => {
                try {
                    const rideStats = await this.rideRepository.countByRiderStats(user.userId, {
                        fromDate: undefined,
                        toDate: undefined,
                    });
                    return {
                        ...user,
                        totalBookings: rideStats.total,
                        totalSpent: rideStats.totalSpend,
                    };
                }
                catch (statsError) {
                    Logger_1.Logger.error(`Failed loading dynamic stats for user: ${user.userId}`, {
                        message: statsError instanceof Error
                            ? statsError.message
                            : String(statsError),
                    });
                    return {
                        ...user,
                        totalBookings: user.totalBookings || 0,
                        totalSpent: user.totalSpent || 0,
                    };
                }
            }));
            const users = usersWithStats.map((user) => new GetUsersResponseDto_1.AdminUserSummaryDto(user.userId, user.name, user.email, user.mobile, user.status, user.totalBookings, user.totalSpent, user.lastBooked?.toISOString() || null, user.createdAt.toISOString(), user.isVerified));
            const paginationDto = new GetUsersResponseDto_1.AdminUsersPaginationDto(result.pagination.currentPage, result.pagination.pageSize, result.pagination.totalItems, result.pagination.totalPages);
            const appliedFiltersDto = new GetUsersResponseDto_1.AdminUsersAppliedFiltersDto(dto.getSortBy(), dto.getSortOrder(), dto.getSearch() || null, dto.getStatus() || null, dateFrom?.toISOString() || null, dateTo?.toISOString() || null);
            const response = new GetUsersResponseDto_1.GetUsersResponseDto(users, paginationDto, appliedFiltersDto);
            Logger_1.Logger.info("Users fetched successfully", {
                totalItems: result.pagination.totalItems,
                currentPage: result.pagination.currentPage,
            });
            return Result_1.Result.success(response);
        }
        catch (error) {
            Logger_1.Logger.error("Error fetching users", error);
            return Result_1.Result.failure(error);
        }
    }
};
exports.GetUsersUseCase = GetUsersUseCase;
exports.GetUsersUseCase = GetUsersUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.AdminUserRepository)),
    __param(1, (0, inversify_1.inject)(DITypes_1.TYPES.RideRepository)),
    __metadata("design:paramtypes", [Object, Object])
], GetUsersUseCase);
//# sourceMappingURL=GetUsersUseCase.js.map