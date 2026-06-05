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
exports.AdminPayoutController = void 0;
const inversify_1 = require("inversify");
const ApprovePayoutDto_1 = require("../../../application/dto/admin/ApprovePayoutDto");
const RejectPayoutDto_1 = require("../../../application/dto/admin/RejectPayoutDto");
const GetAdminPayoutsDto_1 = require("../../../application/dto/admin/GetAdminPayoutsDto");
const HttpStatusCodes_1 = require("../../../shared/enums/HttpStatusCodes");
const DITypes_1 = require("../../../shared/constants/DITypes");
const Logger_1 = require("../../../shared/utils/Logger");
const ErrorHandlerService_1 = require("../../../shared/utils/ErrorHandlerService");
const AdminMessages_1 = require("../../../shared/constants/AdminMessages");
let AdminPayoutController = class AdminPayoutController {
    constructor(approvePayoutUseCase, rejectPayoutUseCase, getAdminPayoutsUseCase) {
        this.approvePayoutUseCase = approvePayoutUseCase;
        this.rejectPayoutUseCase = rejectPayoutUseCase;
        this.getAdminPayoutsUseCase = getAdminPayoutsUseCase;
    }
    async approvePayout(req, res) {
        try {
            const adminId = req.user.userId;
            const { payoutId } = req.params;
            const dto = ApprovePayoutDto_1.ApprovePayoutDto.create({
                adminId,
                payoutId: payoutId,
            });
            const result = await this.approvePayoutUseCase.execute(dto);
            if (result.isFailure()) {
                const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(result.getError());
                res.status(statusCode).json(response);
                return;
            }
            res.status(HttpStatusCodes_1.HttpStatusCodes.OK).json({
                success: true,
                message: AdminMessages_1.ADMIN_MESSAGES.PAYOUT.APPROVED,
                data: result.getValue(),
            });
        }
        catch (error) {
            Logger_1.Logger.error("AdminPayoutController.approvePayout error", { error });
            const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error);
            res.status(statusCode).json(response);
        }
    }
    async rejectPayout(req, res) {
        try {
            const adminId = req.user.userId;
            const { payoutId } = req.params;
            const { reason } = req.body;
            const dto = RejectPayoutDto_1.RejectPayoutDto.create({
                adminId,
                payoutId: payoutId,
                reason,
            });
            const result = await this.rejectPayoutUseCase.execute(dto);
            if (result.isFailure()) {
                const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(result.getError());
                res.status(statusCode).json(response);
                return;
            }
            res.status(HttpStatusCodes_1.HttpStatusCodes.OK).json({
                success: true,
                message: AdminMessages_1.ADMIN_MESSAGES.PAYOUT.REJECTED,
                data: result.getValue(),
            });
        }
        catch (error) {
            Logger_1.Logger.error("AdminPayoutController.rejectPayout error", { error });
            const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error);
            res.status(statusCode).json(response);
        }
    }
    async getPayouts(req, res) {
        try {
            const { status, driverId, page, limit, sortBy, sortOrder } = req.query;
            const dto = GetAdminPayoutsDto_1.GetAdminPayoutsDto.create({
                status: status,
                driverId: driverId,
                page: page ? Number(page) : undefined,
                limit: limit ? Number(limit) : undefined,
                sortBy: sortBy,
                sortOrder: sortOrder,
            });
            const result = await this.getAdminPayoutsUseCase.execute(dto);
            if (result.isFailure()) {
                const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(result.getError());
                res.status(statusCode).json(response);
                return;
            }
            res.status(HttpStatusCodes_1.HttpStatusCodes.OK).json({
                success: true,
                message: AdminMessages_1.ADMIN_MESSAGES.PAYOUT.RETRIVED,
                data: result.getValue(),
            });
        }
        catch (error) {
            Logger_1.Logger.error("AdminPayoutController.getPayouts error", { error });
            const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error);
            res.status(statusCode).json(response);
        }
    }
};
exports.AdminPayoutController = AdminPayoutController;
exports.AdminPayoutController = AdminPayoutController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.ApprovePayoutUseCase)),
    __param(1, (0, inversify_1.inject)(DITypes_1.TYPES.RejectPayoutUseCase)),
    __param(2, (0, inversify_1.inject)(DITypes_1.TYPES.GetAdminPayoutsUseCase)),
    __metadata("design:paramtypes", [Object, Object, Object])
], AdminPayoutController);
//# sourceMappingURL=AdminPayoutController.js.map