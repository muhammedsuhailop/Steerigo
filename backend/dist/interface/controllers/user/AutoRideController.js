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
exports.AutoRideController = void 0;
const inversify_1 = require("inversify");
const AutoSearchAndRequestDto_1 = require("@application/dto/user/AutoSearchAndRequestDto");
const HttpStatusCodes_1 = require("@shared/enums/HttpStatusCodes");
const Logger_1 = require("@shared/utils/Logger");
const DITypes_1 = require("@shared/constants/DITypes");
const ErrorHandlerService_1 = require("@shared/utils/ErrorHandlerService");
const CancelRideRequestDto_1 = require("@application/dto/user/CancelRideRequestDto");
const UserMessages_1 = require("@shared/constants/UserMessages");
const ScheduleFutureRideDto_1 = require("@application/dto/user/ScheduleFutureRideDto");
const CancelFutureRideDto_1 = require("@application/dto/user/CancelFutureRideDto");
let AutoRideController = class AutoRideController {
    constructor(autoSearchAndSendUseCase, cancelRideRequestsUseCase, scheduleUseCase, cancelUseCase) {
        this.autoSearchAndSendUseCase = autoSearchAndSendUseCase;
        this.cancelRideRequestsUseCase = cancelRideRequestsUseCase;
        this.scheduleUseCase = scheduleUseCase;
        this.cancelUseCase = cancelUseCase;
    }
    getUserId(req) {
        const user = req.user;
        return user?.userId ?? null;
    }
    async autoSearchAndSendRequests(req, res) {
        try {
            const userId = this.getUserId(req);
            const { latitude, longitude, searchDate, timeRequired, radiusKm, gearType, bodyType, maxRideRequests, } = req.body;
            Logger_1.Logger.info("Auto search and send ride request received", {
                userId,
                latitude,
                longitude,
                searchDate,
                radiusKm,
                timeRequired,
                gearType,
                bodyType,
                maxRideRequests,
            });
            const dto = AutoSearchAndRequestDto_1.AutoSearchAndRequestDto.fromRequest(userId, req.body);
            const result = await this.autoSearchAndSendUseCase.execute(dto);
            if (result.isSuccessful()) {
                const responseData = result.getValue();
                res.status(HttpStatusCodes_1.HttpStatusCodes.OK).json({
                    success: true,
                    message: responseData.message,
                    requestGroupId: responseData.result.requestGroupId,
                    data: {
                        successfulRequests: responseData.result.successfulRequests,
                        failedRequests: responseData.result.failedRequests,
                        summary: {
                            totalDriversFound: responseData.result.totalDriversFound,
                            successCount: responseData.result.successCount,
                            failureCount: responseData.result.failureCount,
                            searchedAt: responseData.result.searchedAt,
                        },
                    },
                });
                Logger_1.Logger.info("Auto search and send ride request successful", {
                    userId,
                    successCount: responseData.result.successCount,
                    failureCount: responseData.result.failureCount,
                });
            }
            else {
                const error = result.getError();
                const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error, "AutoSearchAndSendRideRequest");
                res.status(statusCode).json(response);
                Logger_1.Logger.warn("Auto search and send ride request failed", {
                    userId,
                    error: error?.message,
                });
            }
        }
        catch (error) {
            Logger_1.Logger.error("Auto search and send ride request controller error", {
                error,
                userId: this.getUserId(req),
            });
            const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error, "AutoSearchAndSendRideRequest");
            res.status(statusCode).json(response);
        }
    }
    async cancelRideRequests(req, res) {
        try {
            const userId = this.getUserId(req);
            const { requestGroupId } = req.body;
            Logger_1.Logger.info("Cancel ride requests received", {
                userId,
                requestGroupId,
            });
            const dto = CancelRideRequestDto_1.CancelRideRequestDto.fromRequest(userId, req.body);
            const result = await this.cancelRideRequestsUseCase.execute(dto);
            if (result.isSuccessful()) {
                const responseData = result.getValue();
                res.status(HttpStatusCodes_1.HttpStatusCodes.OK).json({
                    success: true,
                    message: UserMessages_1.USER_MESSAGES.DRIVER_SEARCH.CANCELLED_SUCCESS,
                    data: responseData,
                });
                Logger_1.Logger.info("Cancel ride requests successful", {
                    userId,
                    requestGroupId,
                    cancelledCount: responseData.cancelledCount,
                });
            }
            else {
                const error = result.getError();
                const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error, "CancelRideRequests");
                res.status(statusCode).json(response);
                Logger_1.Logger.warn("Cancel ride requests failed", {
                    userId,
                    requestGroupId,
                    error: error?.message,
                });
            }
        }
        catch (error) {
            Logger_1.Logger.error("Cancel ride requests controller error", {
                error,
                userId: this.getUserId(req),
            });
            const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error, "CancelRideRequests");
            res.status(statusCode).json(response);
        }
    }
    async scheduleFutureRide(req, res) {
        try {
            const userId = this.getUserId(req);
            const dto = ScheduleFutureRideDto_1.ScheduleFutureRideDto.fromRequest(userId, req.body);
            const result = await this.scheduleUseCase.execute(dto);
            if (result.isSuccessful()) {
                const responseData = result.getValue();
                res.status(HttpStatusCodes_1.HttpStatusCodes.OK).json({
                    success: true,
                    message: responseData.message,
                    data: {
                        requestGroupId: responseData.result.requestGroupId,
                        totalDriversNotified: responseData.result.totalDriversNotified,
                        pickupTime: responseData.result.pickupTime,
                        expiresAt: responseData.result.expiresAt,
                        scheduledAt: responseData.result.scheduledAt,
                        scheduledRequests: responseData.result.scheduledRequests,
                    },
                });
                Logger_1.Logger.info("Schedule future ride successful", {
                    userId,
                    requestGroupId: responseData.result.requestGroupId,
                    driverCount: responseData.result.totalDriversNotified,
                });
            }
            else {
                const error = result.getError();
                const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error, "ScheduleFutureRide");
                res.status(statusCode).json(response);
                Logger_1.Logger.warn("Schedule future ride failed", {
                    userId,
                    error: error?.message,
                });
            }
        }
        catch (error) {
            Logger_1.Logger.error("Schedule future ride controller error", {
                error,
                userId: this.getUserId(req),
            });
            const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error, "ScheduleFutureRide");
            res.status(statusCode).json(response);
        }
    }
    async cancelFutureRide(req, res) {
        try {
            const userId = this.getUserId(req);
            Logger_1.Logger.info("Cancel future ride request received", {
                userId,
                requestGroupId: req.body.requestGroupId,
            });
            const dto = CancelFutureRideDto_1.CancelFutureRideDto.fromRequest(userId, req.body);
            const result = await this.cancelUseCase.execute(dto);
            if (result.isSuccessful()) {
                const responseData = result.getValue();
                res.status(HttpStatusCodes_1.HttpStatusCodes.OK).json({
                    success: true,
                    message: UserMessages_1.USER_MESSAGES.DRIVER_SEARCH.SCHEDULE_CANCELLED,
                    data: {
                        requestGroupId: responseData.requestGroupId,
                        cancelledCount: responseData.cancelledCount,
                        cancelledAt: responseData.cancelledAt,
                    },
                });
                Logger_1.Logger.info("Cancel future ride successful", {
                    userId,
                    requestGroupId: responseData.requestGroupId,
                    cancelledCount: responseData.cancelledCount,
                });
            }
            else {
                const error = result.getError();
                const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error, "CancelFutureRide");
                res.status(statusCode).json(response);
                Logger_1.Logger.warn("Cancel future ride failed", {
                    userId,
                    error: error?.message,
                });
            }
        }
        catch (error) {
            Logger_1.Logger.error("Cancel future ride controller error", {
                error,
                userId: this.getUserId(req),
            });
            const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error, "CancelFutureRide");
            res.status(statusCode).json(response);
        }
    }
};
exports.AutoRideController = AutoRideController;
exports.AutoRideController = AutoRideController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.AutoSearchAndSendRideRequestUseCase)),
    __param(1, (0, inversify_1.inject)(DITypes_1.TYPES.CancelRideRequestsUseCase)),
    __param(2, (0, inversify_1.inject)(DITypes_1.TYPES.ScheduleFutureRideRequestUseCase)),
    __param(3, (0, inversify_1.inject)(DITypes_1.TYPES.CancelFutureRideRequestUseCase)),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], AutoRideController);
//# sourceMappingURL=AutoRideController.js.map