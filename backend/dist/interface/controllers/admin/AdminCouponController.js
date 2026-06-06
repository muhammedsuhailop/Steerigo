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
exports.AdminCouponController = void 0;
const inversify_1 = require("inversify");
const CreateCouponDto_1 = require("../../../application/dto/admin/CreateCouponDto");
const EditCouponDto_1 = require("../../../application/dto/admin/EditCouponDto");
const HttpStatusCodes_1 = require("../../../shared/enums/HttpStatusCodes");
const DITypes_1 = require("../../../shared/constants/DITypes");
const Logger_1 = require("../../../shared/utils/Logger");
const ErrorHandlerService_1 = require("../../../shared/utils/ErrorHandlerService");
const GetAdminCouponsDto_1 = require("../../../application/dto/admin/GetAdminCouponsDto");
let AdminCouponController = class AdminCouponController {
    constructor(createCouponUseCase, editCouponUseCase, getAdminCouponsUseCase) {
        this.createCouponUseCase = createCouponUseCase;
        this.editCouponUseCase = editCouponUseCase;
        this.getAdminCouponsUseCase = getAdminCouponsUseCase;
    }
    async getCoupons(req, res) {
        try {
            Logger_1.Logger.info("Admin get coupons request received", { query: req.query });
            const dto = GetAdminCouponsDto_1.GetAdminCouponsDto.fromRequest(req.query);
            const result = await this.getAdminCouponsUseCase.execute(dto);
            if (result.isFailure()) {
                const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(result.getError());
                res.status(statusCode).json(response);
                return;
            }
            res.status(HttpStatusCodes_1.HttpStatusCodes.OK).json(result.getValue());
        }
        catch (error) {
            Logger_1.Logger.error("AdminCouponController.getCoupons error", { error });
            const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error);
            res.status(statusCode).json(response);
        }
    }
    async createCoupon(req, res) {
        try {
            Logger_1.Logger.info("Admin create coupon request received", { body: req.body });
            const dto = CreateCouponDto_1.CreateCouponDto.fromRequest(req.body);
            const result = await this.createCouponUseCase.execute(dto);
            if (result.isFailure()) {
                const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(result.getError());
                res.status(statusCode).json(response);
                return;
            }
            res
                .status(HttpStatusCodes_1.HttpStatusCodes.CREATED)
                .json(result.getValue());
        }
        catch (error) {
            Logger_1.Logger.error("AdminCouponController.createCoupon error", { error });
            const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error);
            res.status(statusCode).json(response);
        }
    }
    async editCoupon(req, res) {
        try {
            const { couponId } = req.params;
            Logger_1.Logger.info("Admin edit coupon request received", {
                couponId,
                body: req.body,
            });
            const dto = EditCouponDto_1.EditCouponDto.fromRequest({ couponId: couponId }, req.body);
            const result = await this.editCouponUseCase.execute(dto);
            if (result.isFailure()) {
                const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(result.getError());
                res.status(statusCode).json(response);
                return;
            }
            res.status(HttpStatusCodes_1.HttpStatusCodes.OK).json(result.getValue());
        }
        catch (error) {
            Logger_1.Logger.error("AdminCouponController.editCoupon error", { error });
            const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error);
            res.status(statusCode).json(response);
        }
    }
};
exports.AdminCouponController = AdminCouponController;
exports.AdminCouponController = AdminCouponController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.CreateCouponUseCase)),
    __param(1, (0, inversify_1.inject)(DITypes_1.TYPES.EditCouponUseCase)),
    __param(2, (0, inversify_1.inject)(DITypes_1.TYPES.GetAdminCouponsUseCase)),
    __metadata("design:paramtypes", [Object, Object, Object])
], AdminCouponController);
//# sourceMappingURL=AdminCouponController.js.map