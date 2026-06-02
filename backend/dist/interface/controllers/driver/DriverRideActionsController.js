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
exports.DriverRideActionsController = void 0;
const inversify_1 = require("inversify");
const Logger_1 = require("../../../shared/utils/Logger");
const ErrorHandlerService_1 = require("../../../shared/utils/ErrorHandlerService");
const DITypes_1 = require("../../../shared/constants/DITypes");
const HttpStatusCodes_1 = require("../../../shared/enums/HttpStatusCodes");
const MarkRideAsArrivedDto_1 = require("../../../application/dto/driver/MarkRideAsArrivedDto");
const MarkRideAsStartedDto_1 = require("../../../application/dto/driver/MarkRideAsStartedDto");
const MarkRideAsCompletedDto_1 = require("../../../application/dto/driver/MarkRideAsCompletedDto");
const DriverCancelRideDto_1 = require("../../../application/dto/driver/DriverCancelRideDto");
let DriverRideActionsController = class DriverRideActionsController {
    constructor(markRideAsArrivedUseCase, markRideAsStartedUseCase, markRideAsCompletedUseCase, driverCancelRideUseCase) {
        this.markRideAsArrivedUseCase = markRideAsArrivedUseCase;
        this.markRideAsStartedUseCase = markRideAsStartedUseCase;
        this.markRideAsCompletedUseCase = markRideAsCompletedUseCase;
        this.driverCancelRideUseCase = driverCancelRideUseCase;
    }
    getUserId(req) {
        const user = req.user;
        return user?.userId ?? null;
    }
    async markRideAsArrived(req, res) {
        try {
            const userId = this.getUserId(req);
            const rideId = req.params.rideId;
            Logger_1.Logger.info("Mark ride as arrived request received", {
                userId,
                rideId,
            });
            const dto = MarkRideAsArrivedDto_1.MarkRideAsArrivedDto.fromRequest(userId, {
                rideId: rideId,
            });
            const result = await this.markRideAsArrivedUseCase.execute(dto);
            if (result.isFailure()) {
                const error = result.getError();
                Logger_1.Logger.warn("Mark ride as arrived failed", {
                    userId,
                    rideId,
                    error: error.message,
                });
                const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error, "mark_ride_as_arrived");
                res.status(statusCode).json(response);
                return;
            }
            const responseData = result.getValue();
            Logger_1.Logger.info("Ride marked as arrived successfully", {
                userId,
                rideId: responseData.data.rideId,
                arrivedAt: responseData.data.arrivedAt,
            });
            res.status(HttpStatusCodes_1.HttpStatusCodes.OK).json(responseData);
        }
        catch (error) {
            Logger_1.Logger.error("Mark ride as arrived controller error", {
                userId: this.getUserId(req),
                rideId: req.params.rideId,
                error: error instanceof Error ? error.message : String(error),
            });
            const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error, "mark_ride_as_arrived");
            res.status(statusCode).json(response);
        }
    }
    async markRideAsStarted(req, res) {
        try {
            const userId = this.getUserId(req);
            const rideId = req.params.rideId;
            const { verificationCode } = req.body;
            Logger_1.Logger.info("Mark ride as started request received", { userId, rideId });
            const dto = MarkRideAsStartedDto_1.MarkRideAsStartedDto.fromRequest(userId, {
                rideId: rideId,
                verificationCode: verificationCode,
            });
            const result = await this.markRideAsStartedUseCase.execute(dto);
            if (result.isFailure()) {
                const error = result.getError();
                Logger_1.Logger.warn("Mark ride as started failed", {
                    userId,
                    rideId,
                    error: error.message,
                });
                const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error, "mark_ride_as_started");
                res.status(statusCode).json(response);
                return;
            }
            const responseData = result.getValue();
            Logger_1.Logger.info("Ride marked as started successfully", {
                userId,
                rideId: responseData.data.rideId,
                arrivedAt: responseData.data.arrivedAt,
                startedAt: responseData.data.startedAt,
                wasArrivedAutoSet: responseData.data.wasArrivedAutoSet,
            });
            res.status(HttpStatusCodes_1.HttpStatusCodes.OK).json(responseData);
        }
        catch (error) {
            Logger_1.Logger.error("Mark ride as started controller error", {
                userId: this.getUserId(req),
                rideId: req.params.rideId,
                error: error instanceof Error ? error.message : String(error),
            });
            const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error, "mark_ride_as_started");
            res.status(statusCode).json(response);
        }
    }
    async markRideAsCompleted(req, res) {
        try {
            const userId = this.getUserId(req);
            const rideId = req.params.rideId;
            Logger_1.Logger.info("Mark ride as completed received", { userId, rideId });
            const dto = MarkRideAsCompletedDto_1.MarkRideAsCompletedDto.fromRequest(userId, {
                rideId: rideId,
            });
            const result = await this.markRideAsCompletedUseCase.execute(dto);
            if (result.isFailure()) {
                const error = result.getError();
                Logger_1.Logger.warn("Mark ride as completed failed", {
                    userId,
                    rideId,
                    error: error.message,
                });
                const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error, "mark_ride_as_completed");
                res.status(statusCode).json(response);
                return;
            }
            const responseData = result.getValue();
            Logger_1.Logger.info("Ride completed successfully", {
                userId,
                rideId: responseData.data.rideId,
                totalFare: responseData.data.fareBreakdown.totalFare.amount,
                actualDurationMinutes: responseData.data.fareBreakdown.actualDurationMinutes,
                durationHours: responseData.data.fareBreakdown.durationHours,
            });
            res.status(HttpStatusCodes_1.HttpStatusCodes.OK).json(responseData);
        }
        catch (error) {
            Logger_1.Logger.error("Mark ride as completed controller error", {
                userId: this.getUserId(req),
                rideId: req.params.rideId,
                error: error instanceof Error ? error.message : String(error),
            });
            const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error, "mark_ride_as_completed");
            res.status(statusCode).json(response);
        }
    }
    async cancelRide(req, res) {
        try {
            const userId = this.getUserId(req);
            const rideId = req.params.rideId;
            Logger_1.Logger.info("Driver cancel ride request received", {
                userId,
                rideId,
                body: req.body,
            });
            const dto = DriverCancelRideDto_1.DriverCancelRideDto.fromRequest(userId, { rideId: rideId }, req.body);
            const result = await this.driverCancelRideUseCase.execute(dto);
            if (result.isFailure()) {
                const error = result.getError();
                Logger_1.Logger.warn("Driver cancel ride failed", {
                    userId,
                    rideId,
                    error: error?.message,
                });
                const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error, "driver_cancel_ride");
                res.status(statusCode).json(response);
                return;
            }
            const data = result.getValue();
            Logger_1.Logger.info("Ride cancelled by driver successfully", {
                userId,
                rideId: data.rideId,
                penaltyAmount: data.driverPenalty.amount,
                penaltyDeducted: data.penaltyDeducted,
            });
            res.status(HttpStatusCodes_1.HttpStatusCodes.OK).json({
                success: true,
                message: data.message,
                data,
            });
        }
        catch (error) {
            Logger_1.Logger.error("Driver cancel ride controller error", {
                userId: this.getUserId(req),
                rideId: req.params.rideId,
                error: error instanceof Error ? error.message : String(error),
            });
            const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error, "driver_cancel_ride");
            res.status(statusCode).json(response);
        }
    }
};
exports.DriverRideActionsController = DriverRideActionsController;
exports.DriverRideActionsController = DriverRideActionsController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.MarkRideAsArrivedUseCase)),
    __param(1, (0, inversify_1.inject)(DITypes_1.TYPES.MarkRideAsStartedUseCase)),
    __param(2, (0, inversify_1.inject)(DITypes_1.TYPES.MarkRideAsCompletedUseCase)),
    __param(3, (0, inversify_1.inject)(DITypes_1.TYPES.DriverCancelRideUseCase)),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], DriverRideActionsController);
//# sourceMappingURL=DriverRideActionsController.js.map