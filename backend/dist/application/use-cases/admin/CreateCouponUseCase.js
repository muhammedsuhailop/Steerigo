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
exports.CreateCouponUseCase = void 0;
const inversify_1 = require("inversify");
const Result_1 = require("@shared/utils/Result");
const Logger_1 = require("@shared/utils/Logger");
const DITypes_1 = require("@shared/constants/DITypes");
const Coupon_1 = require("@domain/entities/Coupon");
const CouponErrors_1 = require("@domain/errors/CouponErrors");
const CouponMessages_1 = require("@shared/constants/CouponMessages");
let CreateCouponUseCase = class CreateCouponUseCase {
    constructor(couponRepository, idGenerator) {
        this.couponRepository = couponRepository;
        this.idGenerator = idGenerator;
    }
    async execute(dto) {
        try {
            Logger_1.Logger.info("Creating coupon", { code: dto.code });
            const existing = await this.couponRepository.findByCode(dto.code);
            if (existing) {
                return Result_1.Result.failure(CouponErrors_1.CouponErrors.couponCodeAlreadyExists(dto.code));
            }
            const couponId = this.idGenerator.generate();
            const coupon = Coupon_1.Coupon.create(couponId, dto.code, dto.discountType, dto.discountValue, dto.maxDiscount, dto.minRideAmount, dto.usageLimit, dto.usagePerUser, dto.validFrom, dto.validTo);
            const saved = await this.couponRepository.save(coupon);
            Logger_1.Logger.info("Coupon created successfully", {
                couponId: saved.getId(),
                code: saved.getCode(),
            });
            return Result_1.Result.success({
                success: true,
                message: CouponMessages_1.COUPON_MESSAGES.CREATED,
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
            Logger_1.Logger.error("Error creating coupon", {
                code: dto.code,
                error: error instanceof Error ? error.message : String(error),
            });
            return Result_1.Result.failure(error);
        }
    }
};
exports.CreateCouponUseCase = CreateCouponUseCase;
exports.CreateCouponUseCase = CreateCouponUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.CouponRepository)),
    __param(1, (0, inversify_1.inject)(DITypes_1.TYPES.IDGenerator)),
    __metadata("design:paramtypes", [Object, Object])
], CreateCouponUseCase);
//# sourceMappingURL=CreateCouponUseCase.js.map