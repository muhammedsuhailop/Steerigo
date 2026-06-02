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
exports.AdminStatsController = void 0;
const inversify_1 = require("inversify");
const GetUserStatsRequestDto_1 = require("@application/dto/admin/GetUserStatsRequestDto");
const DITypes_1 = require("@shared/constants/DITypes");
const Logger_1 = require("@shared/utils/Logger");
const ErrorHandlerService_1 = require("@shared/utils/ErrorHandlerService");
const HttpStatusCodes_1 = require("@shared/enums/HttpStatusCodes");
const AdminMessages_1 = require("@shared/constants/AdminMessages");
const GetAdminRideStatsRequestDto_1 = require("@application/dto/admin/GetAdminRideStatsRequestDto");
const GetAdminDriverStatsRequestDto_1 = require("@application/dto/admin/GetAdminDriverStatsRequestDto");
let AdminStatsController = class AdminStatsController {
    constructor(getAdminUserStatsUseCase, getAdminRideStatsUseCase, getAdminDriverStatsUseCase) {
        this.getAdminUserStatsUseCase = getAdminUserStatsUseCase;
        this.getAdminRideStatsUseCase = getAdminRideStatsUseCase;
        this.getAdminDriverStatsUseCase = getAdminDriverStatsUseCase;
    }
    async getUserStats(req, res) {
        try {
            Logger_1.Logger.info("Admin get user stats request received", {
                query: req.query,
            });
            const dto = GetUserStatsRequestDto_1.GetUserStatsRequestDto.fromRequest(req.query);
            const result = await this.getAdminUserStatsUseCase.execute(dto);
            if (result.isFailure()) {
                const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(result.getError(), "get_user_stats");
                res.status(statusCode).json(response);
                return;
            }
            const data = result.getValue();
            const response = {
                success: true,
                message: AdminMessages_1.ADMIN_MESSAGES.STATS.USER_FETCHED,
                data,
            };
            res.status(HttpStatusCodes_1.HttpStatusCodes.OK).json(response);
        }
        catch (error) {
            Logger_1.Logger.error("AdminStatsController.getUserStats error", {
                error,
            });
            const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error, "get_user_stats");
            res.status(statusCode).json(response);
        }
    }
    async getRideStats(req, res) {
        try {
            Logger_1.Logger.info("Admin get ride stats request received", {
                query: req.query,
            });
            const dto = GetAdminRideStatsRequestDto_1.GetAdminRideStatsRequestDto.fromRequest(req.query);
            const result = await this.getAdminRideStatsUseCase.execute(dto);
            if (result.isFailure()) {
                const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(result.getError(), "get_ride_stats");
                res.status(statusCode).json(response);
                return;
            }
            const data = result.getValue();
            const response = {
                success: true,
                message: AdminMessages_1.ADMIN_MESSAGES.STATS.RIDE_FETCHED,
                data,
            };
            res.status(HttpStatusCodes_1.HttpStatusCodes.OK).json(response);
        }
        catch (error) {
            Logger_1.Logger.error("AdminStatsController.getRideStats error", { error });
            const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error, "get_ride_stats");
            res.status(statusCode).json(response);
        }
    }
    async getDriverStats(req, res) {
        try {
            Logger_1.Logger.info("Admin get driver stats request received", {
                query: req.query,
            });
            const dto = GetAdminDriverStatsRequestDto_1.GetAdminDriverStatsRequestDto.fromRequest(req.query);
            const result = await this.getAdminDriverStatsUseCase.execute(dto);
            if (result.isFailure()) {
                const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(result.getError(), "get_driver_stats");
                res.status(statusCode).json(response);
                return;
            }
            const response = {
                success: true,
                message: AdminMessages_1.ADMIN_MESSAGES.STATS.DRIVER_FETCHED,
                data: result.getValue(),
            };
            res.status(HttpStatusCodes_1.HttpStatusCodes.OK).json(response);
        }
        catch (error) {
            Logger_1.Logger.error("AdminStatsController.getDriverStats error", { error });
            const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error, "get_driver_stats");
            res.status(statusCode).json(response);
        }
    }
};
exports.AdminStatsController = AdminStatsController;
exports.AdminStatsController = AdminStatsController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.GetAdminUserStatsUseCase)),
    __param(1, (0, inversify_1.inject)(DITypes_1.TYPES.GetAdminRideStatsUseCase)),
    __param(2, (0, inversify_1.inject)(DITypes_1.TYPES.GetAdminDriverStatsUseCase)),
    __metadata("design:paramtypes", [Object, Object, Object])
], AdminStatsController);
//# sourceMappingURL=AdminStatsController.js.map