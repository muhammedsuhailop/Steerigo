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
exports.CouponValidationService = void 0;
const inversify_1 = require("inversify");
const CouponErrors_1 = require("../../domain/errors/CouponErrors");
const Logger_1 = require("../../shared/utils/Logger");
const DITypes_1 = require("../../shared/constants/DITypes");
let CouponValidationService = class CouponValidationService {
    constructor(couponRepository, couponUsageRepository) {
        this.couponRepository = couponRepository;
        this.couponUsageRepository = couponUsageRepository;
    }
    async validateAndCalculate(code, rideAmount, userId, currentDate) {
        Logger_1.Logger.info("Validating coupon", { code, rideAmount });
        const coupon = await this.couponRepository.findByCode(code);
        if (!coupon) {
            throw CouponErrors_1.CouponErrors.couponNotFound(code);
        }
        const usageCount = await this.couponUsageRepository.countByUserAndCoupon(userId, coupon.getId());
        if (usageCount >= (coupon.getUsagePerUser() ?? Infinity)) {
            throw CouponErrors_1.CouponErrors.couponUsageLimitExceeded(coupon.getCode());
        }
        if (!coupon.isValidNow(currentDate)) {
            throw CouponErrors_1.CouponErrors.couponNotValid(code);
        }
        if (!coupon.isMinimumAmountSatisfied(rideAmount)) {
            throw CouponErrors_1.CouponErrors.minimumAmountNotSatisfied(coupon.getMinRideAmount(), rideAmount);
        }
        const discountAmount = coupon.calculateDiscount(rideAmount);
        Logger_1.Logger.info("Coupon validated successfully", {
            code,
            discountAmount,
            discountType: coupon.getDiscountType(),
        });
        return { coupon, discountAmount };
    }
};
exports.CouponValidationService = CouponValidationService;
exports.CouponValidationService = CouponValidationService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.CouponRepository)),
    __param(1, (0, inversify_1.inject)(DITypes_1.TYPES.CouponUsageRepository)),
    __metadata("design:paramtypes", [Object, Object])
], CouponValidationService);
//# sourceMappingURL=CouponValidationService.js.map