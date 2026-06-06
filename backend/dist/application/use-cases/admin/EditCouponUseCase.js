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
exports.EditCouponUseCase = void 0;
const inversify_1 = require("inversify");
const Result_1 = require("../../../shared/utils/Result");
const Logger_1 = require("../../../shared/utils/Logger");
const DITypes_1 = require("../../../shared/constants/DITypes");
const Coupon_1 = require("../../../domain/entities/Coupon");
const CouponErrors_1 = require("../../../domain/errors/CouponErrors");
const CouponMessages_1 = require("../../../shared/constants/CouponMessages");
const CouponDiscountType_1 = require("../../../domain/value-objects/CouponDiscountType");
let EditCouponUseCase = class EditCouponUseCase {
    constructor(couponRepository) {
        this.couponRepository = couponRepository;
    }
    async execute(dto) {
        const couponId = dto.couponId;
        try {
            Logger_1.Logger.info("Editing coupon", { couponId });
            const existing = await this.couponRepository.findById(couponId);
            if (!existing) {
                return Result_1.Result.failure(CouponErrors_1.CouponErrors.couponNotFound(couponId));
            }
            const resolvedDiscountType = dto.discountType ?? existing.getDiscountType();
            const resolvedDiscountValue = dto.discountValue ?? existing.getDiscountValue();
            if (resolvedDiscountType === CouponDiscountType_1.CouponDiscountType.PERCENTAGE &&
                resolvedDiscountValue > 100) {
                return Result_1.Result.failure(CouponErrors_1.CouponErrors.invalidDiscountValue("Percentage discount cannot exceed 100"));
            }
            const resolveOptionalNumber = (patch, current) => {
                if (patch === null)
                    return undefined;
                if (patch === undefined)
                    return current;
                return patch;
            };
            const resolveOptionalDate = (patch, current) => {
                if (patch === null)
                    return undefined;
                if (patch === undefined)
                    return current;
                return patch;
            };
            const resolvedValidFrom = resolveOptionalDate(dto.validFrom, existing.getValidFrom());
            const resolvedValidTo = resolveOptionalDate(dto.validTo, existing.getValidTo());
            if (resolvedValidFrom &&
                resolvedValidTo &&
                resolvedValidFrom >= resolvedValidTo) {
                return Result_1.Result.failure(CouponErrors_1.CouponErrors.invalidValidityPeriod());
            }
            const updated = Coupon_1.Coupon.fromData({
                id: existing.getId(),
                code: existing.getCode(),
                discountType: resolvedDiscountType,
                discountValue: resolvedDiscountValue,
                maxDiscount: resolveOptionalNumber(dto.maxDiscount, existing.getMaxDiscount()),
                minRideAmount: resolveOptionalNumber(dto.minRideAmount, existing.getMinRideAmount()),
                usageLimit: resolveOptionalNumber(dto.usageLimit, existing.getUsageLimit()),
                usagePerUser: resolveOptionalNumber(dto.usagePerUser, existing.getUsagePerUser()),
                validFrom: resolvedValidFrom,
                validTo: resolvedValidTo,
                isActive: dto.isActive ?? existing.getIsActive(),
                createdAt: existing.getCreatedAt(),
                updatedAt: new Date(),
            });
            const saved = await this.couponRepository.save(updated);
            Logger_1.Logger.info("Coupon updated successfully", {
                couponId: saved.getId(),
                code: saved.getCode(),
            });
            return Result_1.Result.success({
                success: true,
                message: CouponMessages_1.COUPON_MESSAGES.UPDATED,
                data: {
                    coupon: {
                        couponId: saved.getId(),
                        code: saved.getCode(),
                        discountType: saved.getDiscountType(),
                        discountValue: saved.getDiscountValue(),
                        maxDiscount: saved.getMaxDiscount(),
                        minRideAmount: saved.getMinRideAmount(),
                        usageLimit: saved.getUsageLimit(),
                        usagePerUser: saved.getUsagePerUser(),
                        validFrom: saved.getValidFrom()?.toISOString(),
                        validTo: saved.getValidTo()?.toISOString(),
                        isActive: saved.getIsActive(),
                        createdAt: saved.getCreatedAt().toISOString(),
                        updatedAt: saved.getUpdatedAt().toISOString(),
                    },
                },
            });
        }
        catch (error) {
            Logger_1.Logger.error("Error editing coupon", {
                couponId,
                error: error instanceof Error ? error.message : String(error),
            });
            return Result_1.Result.failure(error);
        }
    }
};
exports.EditCouponUseCase = EditCouponUseCase;
exports.EditCouponUseCase = EditCouponUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.CouponRepository)),
    __metadata("design:paramtypes", [Object])
], EditCouponUseCase);
//# sourceMappingURL=EditCouponUseCase.js.map