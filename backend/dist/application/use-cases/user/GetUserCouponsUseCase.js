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
exports.GetUserCouponsUseCase = void 0;
const inversify_1 = require("inversify");
const Result_1 = require("../../../shared/utils/Result");
const DITypes_1 = require("../../../shared/constants/DITypes");
let GetUserCouponsUseCase = class GetUserCouponsUseCase {
    constructor(couponRepository) {
        this.couponRepository = couponRepository;
    }
    async execute(dto) {
        try {
            const now = new Date();
            const result = await this.couponRepository.findAll({
                filters: {
                    isActive: true,
                    validFromStart: undefined,
                    validFromEnd: now,
                    validToStart: now,
                    validToEnd: undefined,
                },
                sortBy: "createdAt",
                sortOrder: "desc",
                page: dto.getPage(),
                limit: dto.getLimit(),
            });
            const response = {
                coupons: result.coupons.map((coupon) => ({
                    id: coupon.getId(),
                    code: coupon.getCode(),
                    discountType: coupon.getDiscountType(),
                    discountValue: coupon.getDiscountValue(),
                    maxDiscount: coupon.getMaxDiscount(),
                    minRideAmount: coupon.getMinRideAmount(),
                    validFrom: coupon.getValidFrom()?.toISOString(),
                    validTo: coupon.getValidTo()?.toISOString(),
                    isActive: coupon.getIsActive(),
                })),
                total: result.total,
                page: result.page,
                limit: result.limit,
                totalPages: result.totalPages,
            };
            return Result_1.Result.success(response);
        }
        catch (error) {
            return Result_1.Result.failure(error);
        }
    }
};
exports.GetUserCouponsUseCase = GetUserCouponsUseCase;
exports.GetUserCouponsUseCase = GetUserCouponsUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.CouponRepository)),
    __metadata("design:paramtypes", [Object])
], GetUserCouponsUseCase);
//# sourceMappingURL=GetUserCouponsUseCase.js.map