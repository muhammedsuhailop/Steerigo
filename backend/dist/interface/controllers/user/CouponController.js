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
exports.CouponController = void 0;
const ApplyCouponDto_1 = require("../../../application/dto/user/ApplyCouponDto");
const RemoveCouponDto_1 = require("../../../application/dto/user/RemoveCouponDto");
const DITypes_1 = require("../../../shared/constants/DITypes");
const inversify_1 = require("inversify");
const Logger_1 = require("../../../shared/utils/Logger");
const ErrorHandlerService_1 = require("../../../shared/utils/ErrorHandlerService");
const HttpStatusCodes_1 = require("../../../shared/enums/HttpStatusCodes");
const GetUserCouponsDto_1 = require("../../../application/dto/user/GetUserCouponsDto");
const UserMessages_1 = require("../../../shared/constants/UserMessages");
let CouponController = class CouponController {
    constructor(getUserCouponsUseCase, applyCouponUseCase, removeCouponUseCase) {
        this.getUserCouponsUseCase = getUserCouponsUseCase;
        this.applyCouponUseCase = applyCouponUseCase;
        this.removeCouponUseCase = removeCouponUseCase;
    }
    getUserId(req) {
        const user = req.user;
        return user?.userId ?? null;
    }
    async getUserCoupons(req, res) {
        try {
            const userId = this.getUserId(req);
            Logger_1.Logger.info("Get user coupons request received", {
                userId,
                query: req.query,
            });
            const dto = GetUserCouponsDto_1.GetUserCouponsDto.fromRequest(userId, req.query);
            const result = await this.getUserCouponsUseCase.execute(dto);
            if (result.isFailure()) {
                const error = result.getError();
                const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error);
                res.status(statusCode).json(response);
                return;
            }
            const data = result.getValue();
            res.status(HttpStatusCodes_1.HttpStatusCodes.OK).json({
                success: true,
                message: UserMessages_1.USER_MESSAGES.COUPON.FETCHED,
                data,
            });
        }
        catch (error) {
            Logger_1.Logger.error("Get user coupons controller error", {
                userId: this.getUserId(req),
                error: error instanceof Error ? error.message : String(error),
            });
            const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error);
            res.status(statusCode).json(response);
        }
    }
    async applyCoupon(req, res) {
        try {
            const userId = this.getUserId(req);
            const rideId = req.params.rideId;
            Logger_1.Logger.info("Apply coupon request received from rider", {
                userId,
                rideId,
                body: req.body,
            });
            const dto = ApplyCouponDto_1.ApplyCouponDto.fromRequest(userId, { rideId: rideId }, req.body);
            const result = await this.applyCouponUseCase.execute(dto);
            if (result.isFailure()) {
                const error = result.getError();
                Logger_1.Logger.warn("Apply coupon failed", {
                    userId,
                    rideId,
                    error: error?.message,
                });
                const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error);
                res.status(statusCode).json(response);
                return;
            }
            const data = result.getValue();
            Logger_1.Logger.info("Coupon applied successfully", {
                userId,
                rideId: data.rideId,
                couponCode: data.couponCode,
                discountAmount: data.discountAmount,
                payableAmount: data.payableAmount,
            });
            res.status(HttpStatusCodes_1.HttpStatusCodes.OK).json({
                success: true,
                message: data.message,
                data,
            });
        }
        catch (error) {
            Logger_1.Logger.error("Apply coupon controller error", {
                userId: this.getUserId(req),
                rideId: req.params.rideId,
                error: error instanceof Error ? error.message : String(error),
            });
            const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error);
            res.status(statusCode).json(response);
        }
    }
    async removeCoupon(req, res) {
        try {
            const userId = this.getUserId(req);
            const rideId = req.params.rideId;
            Logger_1.Logger.info("Remove coupon request received from rider", {
                userId,
                rideId,
            });
            const dto = RemoveCouponDto_1.RemoveCouponDto.fromRequest(userId, {
                rideId: rideId,
            });
            const result = await this.removeCouponUseCase.execute(dto);
            if (result.isFailure()) {
                const error = result.getError();
                Logger_1.Logger.warn("Remove coupon failed", {
                    userId,
                    rideId,
                    error: error?.message,
                });
                const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error);
                res.status(statusCode).json(response);
                return;
            }
            const data = result.getValue();
            Logger_1.Logger.info("Coupon removed successfully", {
                userId,
                rideId: data.rideId,
                payableAmount: data.payableAmount,
            });
            res.status(HttpStatusCodes_1.HttpStatusCodes.OK).json({
                success: true,
                message: data.message,
                data,
            });
        }
        catch (error) {
            Logger_1.Logger.error("Remove coupon controller error", {
                userId: this.getUserId(req),
                rideId: req.params.rideId,
                error: error instanceof Error ? error.message : String(error),
            });
            const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error);
            res.status(statusCode).json(response);
        }
    }
};
exports.CouponController = CouponController;
exports.CouponController = CouponController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.GetUserCouponsUseCase)),
    __param(1, (0, inversify_1.inject)(DITypes_1.TYPES.ApplyCouponUseCase)),
    __param(2, (0, inversify_1.inject)(DITypes_1.TYPES.RemoveCouponUseCase)),
    __metadata("design:paramtypes", [Object, Object, Object])
], CouponController);
//# sourceMappingURL=CouponController.js.map