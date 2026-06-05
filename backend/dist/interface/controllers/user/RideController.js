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
exports.RideController = void 0;
const inversify_1 = require("inversify");
const SendRideRequestDto_1 = require("../../../application/dto/user/SendRideRequestDto");
const HttpStatusCodes_1 = require("../../../shared/enums/HttpStatusCodes");
const Logger_1 = require("../../../shared/utils/Logger");
const DITypes_1 = require("../../../shared/constants/DITypes");
const ErrorHandlerService_1 = require("../../../shared/utils/ErrorHandlerService");
const GetUserRideByIdDto_1 = require("../../../application/dto/user/GetUserRideByIdDto");
const GetUserRidesDto_1 = require("../../../application/dto/user/GetUserRidesDto");
const CancelRideDto_1 = require("../../../application/dto/user/CancelRideDto");
const RateDriverDto_1 = require("../../../application/dto/user/RateDriverDto");
const RideMessages_1 = require("../../../shared/constants/RideMessages");
let RideController = class RideController {
    constructor(sendRideRequestUseCase, getUserRideByIdUseCase, getUserRidesUseCase, cancelRideUseCase, rateDriverUseCase) {
        this.sendRideRequestUseCase = sendRideRequestUseCase;
        this.getUserRideByIdUseCase = getUserRideByIdUseCase;
        this.getUserRidesUseCase = getUserRidesUseCase;
        this.cancelRideUseCase = cancelRideUseCase;
        this.rateDriverUseCase = rateDriverUseCase;
    }
    getUserId(req) {
        const user = req.user;
        return user?.userId ?? null;
    }
    async sendRideRequest(req, res) {
        try {
            const riderId = this.getUserId(req);
            const dto = SendRideRequestDto_1.SendRideRequestDto.fromRequest(riderId, req.body);
            Logger_1.Logger.info("Send ride request received", {
                riderId,
                driverId: dto.driverId,
                pickupTime: dto.pickupTime,
                rideType: dto.rideType,
                totalFare: dto.fareBreakdown.getTotalFare().getAmount(),
            });
            const result = await this.sendRideRequestUseCase.execute(dto);
            if (result.isSuccessful()) {
                const responseData = result.getValue();
                res.status(HttpStatusCodes_1.HttpStatusCodes.CREATED).json({
                    success: true,
                    message: responseData.message,
                    data: {
                        rideRequest: responseData.rideRequest,
                    },
                });
                Logger_1.Logger.info("Ride request sent successfully", {
                    riderId,
                    requestId: responseData.rideRequest.requestId,
                    driverId: dto.driverId,
                });
            }
            else {
                const error = result.getError();
                const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error);
                res.status(statusCode).json(response);
                Logger_1.Logger.warn("Send ride request failed", {
                    riderId,
                    driverId: dto.driverId,
                    error: error?.message,
                });
            }
        }
        catch (error) {
            Logger_1.Logger.error("Send ride request controller error", {
                error,
                userId: this.getUserId(req),
            });
            const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error);
            res.status(statusCode).json(response);
        }
    }
    async getUserRideById(req, res) {
        try {
            const userId = this.getUserId(req);
            const rideId = req.params.rideId;
            Logger_1.Logger.info("Get user ride by ID received", {
                userId,
                rideId,
            });
            const dto = GetUserRideByIdDto_1.GetUserRideByIdDto.fromRequest(userId, { rideId });
            const result = await this.getUserRideByIdUseCase.execute(dto);
            if (result.isFailure()) {
                const error = result.getError();
                Logger_1.Logger.warn("Get user ride by ID failed", {
                    userId,
                    rideId,
                    error: error.message,
                });
                const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error);
                res.status(statusCode).json(response);
                return;
            }
            const responseData = result.getValue();
            Logger_1.Logger.info("User ride fetched successfully", {
                userId,
                rideId: responseData.ride.rideId,
                status: responseData.ride.status,
                driverId: responseData.driver.driverId,
            });
            const response = {
                success: true,
                message: RideMessages_1.RIDE_MESSAGES.RIDE_FETCHED_SUCCESSFULLY,
                data: responseData,
            };
            res.status(HttpStatusCodes_1.HttpStatusCodes.OK).json(response);
        }
        catch (error) {
            Logger_1.Logger.error("Get user ride by ID controller error", {
                userId: this.getUserId(req),
                rideId: req.params.rideId,
                error: error instanceof Error ? error.message : String(error),
            });
            const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error);
            res.status(statusCode).json(response);
        }
    }
    async getUserRides(req, res) {
        try {
            const userId = this.getUserId(req);
            Logger_1.Logger.info("Get user rides received", {
                userId,
                query: req.query,
            });
            const dto = GetUserRidesDto_1.GetUserRidesDto.fromRequest(userId, req.query);
            const result = await this.getUserRidesUseCase.execute(dto);
            if (result.isFailure()) {
                Logger_1.Logger.warn("Get user rides failed", {
                    userId,
                    error: result.getError().message,
                });
                const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(result.getError());
                res.status(statusCode).json(response);
                return;
            }
            const responseData = result.getValue();
            Logger_1.Logger.info("User rides fetched successfully", {
                userId,
                total: responseData.pagination.total,
                page: responseData.pagination.page,
            });
            const response = {
                success: true,
                message: RideMessages_1.RIDE_MESSAGES.RIDES_FETCHED_SUCCESSFULLY,
                data: responseData,
            };
            res.status(HttpStatusCodes_1.HttpStatusCodes.OK).json(response);
        }
        catch (error) {
            Logger_1.Logger.error("Get user rides controller error", {
                userId: this.getUserId(req),
                error: error instanceof Error ? error.message : String(error),
            });
            const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error);
            res.status(statusCode).json(response);
        }
    }
    async cancelRide(req, res) {
        try {
            const userId = this.getUserId(req);
            const rideId = req.params.rideId;
            Logger_1.Logger.info("Cancel ride request received from rider", {
                userId,
                rideId,
                body: req.body,
            });
            const dto = CancelRideDto_1.CancelRideDto.fromRequest(userId, { rideId: rideId }, req.body);
            const result = await this.cancelRideUseCase.execute(dto);
            if (result.isFailure()) {
                const error = result.getError();
                Logger_1.Logger.warn("Cancel ride failed", {
                    userId,
                    rideId,
                    error: error?.message,
                });
                const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error);
                res.status(statusCode).json(response);
                return;
            }
            const data = result.getValue();
            Logger_1.Logger.info("Ride cancelled successfully", {
                userId,
                rideId: data.rideId,
                feeAmount: data.cancellationFee.amount,
                feeCurrency: data.cancellationFee.currency,
                feeCharged: data.feeCharged,
                addedToArrears: data.addedToArrears,
            });
            res.status(HttpStatusCodes_1.HttpStatusCodes.OK).json({
                success: true,
                message: data.message,
                data,
            });
        }
        catch (error) {
            Logger_1.Logger.error("Cancel ride controller error", {
                userId: this.getUserId(req),
                rideId: req.params.rideId,
                error: error instanceof Error ? error.message : String(error),
            });
            const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error, "cancel_ride");
            res.status(statusCode).json(response);
        }
    }
    async rateDriver(req, res) {
        try {
            const userId = this.getUserId(req);
            const rideId = req.params.rideId;
            Logger_1.Logger.info("Rate driver request received from rider", {
                userId,
                rideId,
                body: req.body,
            });
            const dto = RateDriverDto_1.RateDriverDto.fromRequest(userId, { rideId: rideId }, req.body);
            const result = await this.rateDriverUseCase.execute(dto);
            if (result.isFailure()) {
                const error = result.getError();
                Logger_1.Logger.warn("Rate driver failed", {
                    userId,
                    rideId,
                    error: error?.message,
                });
                const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error, "rate_driver");
                res.status(statusCode).json(response);
                return;
            }
            const data = result.getValue();
            Logger_1.Logger.info("Driver rated successfully", {
                userId,
                rideId: data.rideId,
                driverId: data.driverId,
                overallRating: data.overallRating,
                averageRating: data.driver.averageRating,
                numberOfRatings: data.driver.numberOfRatings,
            });
            res.status(HttpStatusCodes_1.HttpStatusCodes.OK).json({
                success: true,
                message: RideMessages_1.RIDE_MESSAGES.RIDE_RATED,
                data,
            });
        }
        catch (error) {
            Logger_1.Logger.error("Rate driver controller error", {
                userId: this.getUserId(req),
                rideId: req.params.rideId,
                error: error instanceof Error ? error.message : String(error),
            });
            const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error, "rate_driver");
            res.status(statusCode).json(response);
        }
    }
};
exports.RideController = RideController;
exports.RideController = RideController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.SendRideRequestUseCase)),
    __param(1, (0, inversify_1.inject)(DITypes_1.TYPES.GetUserRideByIdUseCase)),
    __param(2, (0, inversify_1.inject)(DITypes_1.TYPES.GetUserRidesUseCase)),
    __param(3, (0, inversify_1.inject)(DITypes_1.TYPES.CancelRideUseCase)),
    __param(4, (0, inversify_1.inject)(DITypes_1.TYPES.RateDriverUseCase)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], RideController);
//# sourceMappingURL=RideController.js.map