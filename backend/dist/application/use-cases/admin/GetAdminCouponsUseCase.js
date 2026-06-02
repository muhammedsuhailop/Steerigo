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
exports.GetAdminCouponsUseCase = void 0;
const inversify_1 = require("inversify");
const Result_1 = require("@shared/utils/Result");
const Logger_1 = require("@shared/utils/Logger");
const DITypes_1 = require("@shared/constants/DITypes");
let GetAdminCouponsUseCase = class GetAdminCouponsUseCase {
    constructor(couponRepository) {
        this.couponRepository = couponRepository;
    }
    async execute(dto) {
        try {
            Logger_1.Logger.info("Fetching admin coupons", {
                filters: dto.filters,
                sortBy: dto.sortBy,
                sortOrder: dto.sortOrder,
                page: dto.page,
                limit: dto.limit,
            });
            const result = await this.couponRepository.findAll({
                filters: dto.filters,
                sortBy: dto.sortBy,
                sortOrder: dto.sortOrder,
                page: dto.page,
                limit: dto.limit,
            });
            const coupons = result.coupons.map((coupon) => ({
                couponId: coupon.getId(),
                code: coupon.getCode(),
                discountType: coupon.getDiscountType(),
                discountValue: coupon.getDiscountValue(),
                maxDiscount: coupon.getMaxDiscount(),
                minRideAmount: coupon.getMinRideAmount(),
                usageLimit: coupon.getUsageLimit(),
                usagePerUser: coupon.getUsagePerUser(),
                validFrom: coupon.getValidFrom()?.toISOString(),
                validTo: coupon.getValidTo()?.toISOString(),
                isActive: coupon.getIsActive(),
                createdAt: coupon.getCreatedAt().toISOString(),
                updatedAt: coupon.getUpdatedAt().toISOString(),
            }));
            Logger_1.Logger.info("Admin coupons fetched successfully", {
                total: result.total,
                page: result.page,
                totalPages: result.totalPages,
            });
            return Result_1.Result.success({
                success: true,
                data: {
                    coupons,
                    pagination: {
                        total: result.total,
                        page: result.page,
                        limit: result.limit,
                        totalPages: result.totalPages,
                    },
                },
            });
        }
        catch (error) {
            Logger_1.Logger.error("Error fetching admin coupons", {
                error: error instanceof Error ? error.message : String(error),
            });
            return Result_1.Result.failure(error);
        }
    }
};
exports.GetAdminCouponsUseCase = GetAdminCouponsUseCase;
exports.GetAdminCouponsUseCase = GetAdminCouponsUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.CouponRepository)),
    __metadata("design:paramtypes", [Object])
], GetAdminCouponsUseCase);
//# sourceMappingURL=GetAdminCouponsUseCase.js.map