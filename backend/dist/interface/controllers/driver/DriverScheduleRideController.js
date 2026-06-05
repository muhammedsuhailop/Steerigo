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
exports.DriverScheduleRideController = void 0;
const inversify_1 = require("inversify");
const DITypes_1 = require("../../../shared/constants/DITypes");
const HttpStatusCodes_1 = require("../../../shared/enums/HttpStatusCodes");
const Logger_1 = require("../../../shared/utils/Logger");
const ErrorHandlerService_1 = require("../../../shared/utils/ErrorHandlerService");
const AcceptFutureRideRequestDto_1 = require("../../../application/dto/driver/AcceptFutureRideRequestDto");
const GetFutureRideRequestsDto_1 = require("../../../application/dto/driver/GetFutureRideRequestsDto");
const RejectFutureRideRequestDto_1 = require("../../../application/dto/driver/RejectFutureRideRequestDto");
let DriverScheduleRideController = class DriverScheduleRideController {
    constructor(acceptUseCase, getFutureRideRequestsUseCase, rejectUseCase) {
        this.acceptUseCase = acceptUseCase;
        this.getFutureRideRequestsUseCase = getFutureRideRequestsUseCase;
        this.rejectUseCase = rejectUseCase;
    }
    getUserId(req) {
        return req.user?.userId ?? null;
    }
    async getFutureRideRequests(req, res) {
        try {
            const userId = this.getUserId(req);
            Logger_1.Logger.info("Get future ride requests received", {
                userId,
                query: req.query,
            });
            const dto = GetFutureRideRequestsDto_1.GetFutureRideRequestsDto.fromRequest(userId, req.query);
            const result = await this.getFutureRideRequestsUseCase.execute(dto);
            if (result.isSuccessful()) {
                const responseData = result.getValue();
                res.status(HttpStatusCodes_1.HttpStatusCodes.OK).json({
                    success: true,
                    message: responseData.message,
                    data: responseData.data,
                });
                Logger_1.Logger.info("Get future ride requests successful", {
                    userId,
                    total: responseData.data.pagination.total,
                });
            }
            else {
                const error = result.getError();
                const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error);
                res.status(statusCode).json(response);
                Logger_1.Logger.warn("Get future ride requests failed", {
                    userId,
                    error: error?.message,
                });
            }
        }
        catch (error) {
            Logger_1.Logger.error("Get future ride requests controller error", {
                error,
                userId: this.getUserId(req),
            });
            const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error);
            res.status(statusCode).json(response);
        }
    }
    async acceptFutureRideRequest(req, res) {
        try {
            const userId = this.getUserId(req);
            Logger_1.Logger.info("Accept future ride request received", {
                userId,
                requestId: req.body.requestId,
            });
            const dto = AcceptFutureRideRequestDto_1.AcceptFutureRideRequestDto.fromRequest(userId, req.body);
            const result = await this.acceptUseCase.execute(dto);
            if (result.isSuccessful()) {
                const responseData = result.getValue();
                res.status(HttpStatusCodes_1.HttpStatusCodes.OK).json({
                    success: true,
                    message: responseData.message,
                    data: responseData.data,
                });
                Logger_1.Logger.info("Accept future ride request successful", {
                    userId,
                    requestId: req.body.requestId,
                    requestGroupId: responseData.data.requestGroupId,
                });
            }
            else {
                const error = result.getError();
                const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error);
                res.status(statusCode).json(response);
                Logger_1.Logger.warn("Accept future ride request failed", {
                    userId,
                    error: error?.message,
                });
            }
        }
        catch (error) {
            Logger_1.Logger.error("Accept future ride request controller error", {
                error,
                userId: this.getUserId(req),
            });
            const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error);
            res.status(statusCode).json(response);
        }
    }
    async rejectFutureRideRequest(req, res) {
        try {
            const userId = this.getUserId(req);
            Logger_1.Logger.info("Reject future ride request received", {
                userId,
                requestId: req.body.requestId,
            });
            const dto = RejectFutureRideRequestDto_1.RejectFutureRideRequestDto.fromRequest(userId, req.body);
            const result = await this.rejectUseCase.execute(dto);
            if (result.isSuccessful()) {
                const responseData = result.getValue();
                res.status(HttpStatusCodes_1.HttpStatusCodes.OK).json({
                    success: true,
                    message: responseData.message,
                    data: responseData.data,
                });
                Logger_1.Logger.info("Reject future ride request successful", {
                    userId,
                    requestId: req.body.requestId,
                    requestGroupId: responseData.data.requestGroupId,
                });
            }
            else {
                const error = result.getError();
                const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error);
                res.status(statusCode).json(response);
                Logger_1.Logger.warn("Reject future ride request failed", {
                    userId,
                    error: error?.message,
                });
            }
        }
        catch (error) {
            Logger_1.Logger.error("Reject future ride request controller error", {
                error,
                userId: this.getUserId(req),
            });
            const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error);
            res.status(statusCode).json(response);
        }
    }
};
exports.DriverScheduleRideController = DriverScheduleRideController;
exports.DriverScheduleRideController = DriverScheduleRideController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.AcceptFutureRideRequestUseCase)),
    __param(1, (0, inversify_1.inject)(DITypes_1.TYPES.GetFutureRideRequestsUseCase)),
    __param(2, (0, inversify_1.inject)(DITypes_1.TYPES.RejectFutureRideRequestUseCase)),
    __metadata("design:paramtypes", [Object, Object, Object])
], DriverScheduleRideController);
//# sourceMappingURL=DriverScheduleRideController.js.map