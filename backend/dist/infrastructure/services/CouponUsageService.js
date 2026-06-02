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
exports.CouponUsageService = void 0;
const inversify_1 = require("inversify");
const CouponUsage_1 = require("@domain/entities/CouponUsage");
const DITypes_1 = require("@shared/constants/DITypes");
const Logger_1 = require("@shared/utils/Logger");
let CouponUsageService = class CouponUsageService {
    constructor(rideRepository, couponUsageRepository, idGenerator) {
        this.rideRepository = rideRepository;
        this.couponUsageRepository = couponUsageRepository;
        this.idGenerator = idGenerator;
    }
    async recordUsage(rideId) {
        try {
            const ride = await this.rideRepository.findByRideId(rideId);
            if (!ride) {
                Logger_1.Logger.warn("Coupon usage skipped: ride not found", { rideId });
                return;
            }
            if (!ride.hasCouponApplied()) {
                Logger_1.Logger.warn("Coupon usage skipped: coupon not applied", { rideId });
                return;
            }
            const couponDetails = ride.getCouponDetails();
            if (!couponDetails) {
                Logger_1.Logger.warn("Coupon usage skipped: coupon details missing", { rideId });
                return;
            }
            const usage = CouponUsage_1.CouponUsage.create({
                id: this.idGenerator.generate(),
                userId: ride.getRiderId(),
                couponId: couponDetails.couponId,
                rideId: ride.getRideId(),
                discountAmount: couponDetails.discountAmount,
                usedAt: new Date(),
            });
            Logger_1.Logger.info("Creating coupon usage entry", {
                rideId,
                couponId: couponDetails.couponId,
            });
            await this.couponUsageRepository.create(usage);
            Logger_1.Logger.info("Coupon usage recorded successfully", {
                rideId,
                couponId: couponDetails.couponId,
            });
        }
        catch (error) {
            Logger_1.Logger.error("Failed to record coupon usage", {
                rideId,
                error: error instanceof Error ? error.message : String(error),
            });
        }
    }
};
exports.CouponUsageService = CouponUsageService;
exports.CouponUsageService = CouponUsageService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.RideRepository)),
    __param(1, (0, inversify_1.inject)(DITypes_1.TYPES.CouponUsageRepository)),
    __param(2, (0, inversify_1.inject)(DITypes_1.TYPES.IDGenerator)),
    __metadata("design:paramtypes", [Object, Object, Object])
], CouponUsageService);
//# sourceMappingURL=CouponUsageService.js.map