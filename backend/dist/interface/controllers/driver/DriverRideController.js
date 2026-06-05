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
exports.DriverRideController = void 0;
const inversify_1 = require("inversify");
const Logger_1 = require("../../../shared/utils/Logger");
const ErrorHandlerService_1 = require("../../../shared/utils/ErrorHandlerService");
const DITypes_1 = require("../../../shared/constants/DITypes");
const HttpStatusCodes_1 = require("../../../shared/enums/HttpStatusCodes");
const DriverMessages_1 = require("../../../shared/constants/DriverMessages");
const AcceptRideRequestDto_1 = require("../../../application/dto/driver/AcceptRideRequestDto");
const RejectRideRequestDto_1 = require("../../../application/dto/driver/RejectRideRequestDto");
const GetPendingRideRequestsDto_1 = require("../../../application/dto/driver/GetPendingRideRequestsDto");
const GetDriverRidesDto_1 = require("../../../application/dto/driver/GetDriverRidesDto");
const GetDriverRideByIdDto_1 = require("../../../application/dto/driver/GetDriverRideByIdDto");
const RideMessages_1 = require("../../../shared/constants/RideMessages");
let DriverRideController = class DriverRideController {
    constructor(acceptRideRequestUseCase, rejectRideRequestUseCase, getPendingRideRequestsUseCase, getDriverRidesUseCase, getDriverRideByIdUseCase) {
        this.acceptRideRequestUseCase = acceptRideRequestUseCase;
        this.rejectRideRequestUseCase = rejectRideRequestUseCase;
        this.getPendingRideRequestsUseCase = getPendingRideRequestsUseCase;
        this.getDriverRidesUseCase = getDriverRidesUseCase;
        this.getDriverRideByIdUseCase = getDriverRideByIdUseCase;
    }
    getUserId(req) {
        const user = req.user;
        return user?.userId ?? null;
    }
    async acceptRideRequest(req, res) {
        try {
            const userId = this.getUserId(req);
            const requestId = req.params.requestId;
            Logger_1.Logger.info("Accept ride request received", {
                userId,
                requestId,
            });
            const dto = AcceptRideRequestDto_1.AcceptRideRequestDto.fromRequest(userId, {
                requestId,
            });
            const result = await this.acceptRideRequestUseCase.execute(dto);
            if (result.isFailure()) {
                const error = result.getError();
                Logger_1.Logger.warn("Accept ride request failed", {
                    userId,
                    error: error.message,
                });
                const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error);
                res.status(statusCode).json(response);
                return;
            }
            const responseData = result.getValue();
            Logger_1.Logger.info("Ride request accepted successfully", {
                userId,
                rideId: responseData.rideId,
                requestId: responseData.requestId,
            });
            const response = {
                success: true,
                message: RideMessages_1.RIDE_MESSAGES.RIDE_REQUEST_ACCEPTED,
                data: responseData,
            };
            res.status(HttpStatusCodes_1.HttpStatusCodes.OK).json(response);
        }
        catch (error) {
            Logger_1.Logger.error("Accept ride request controller error", {
                userId: this.getUserId(req),
                error: error instanceof Error ? error.message : String(error),
            });
            const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error);
            res.status(statusCode).json(response);
        }
    }
    async rejectRideRequest(req, res) {
        try {
            const userId = this.getUserId(req);
            if (!userId) {
                res.status(HttpStatusCodes_1.HttpStatusCodes.UNAUTHORIZED).json({
                    success: false,
                    message: DriverMessages_1.DRIVER_MESSAGES.UNAUTHORIZED,
                });
                return;
            }
            const requestId = req.params.requestId;
            if (!requestId) {
                res.status(HttpStatusCodes_1.HttpStatusCodes.BAD_REQUEST).json({
                    success: false,
                    message: DriverMessages_1.DRIVER_MESSAGES.REQUEST_ID_REQUIRED,
                });
                return;
            }
            Logger_1.Logger.info("Cancel ride request received", {
                userId,
                requestId,
            });
            const dto = RejectRideRequestDto_1.RejectRideRequestDto.fromRequest(userId, {
                requestId,
                reason: req.body?.reason,
            });
            const result = await this.rejectRideRequestUseCase.execute(dto);
            if (result.isFailure()) {
                const error = result.getError();
                Logger_1.Logger.warn("Cancel ride request failed", {
                    userId,
                    error: error.message,
                });
                const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error);
                res.status(statusCode).json(response);
                return;
            }
            const responseData = result.getValue();
            Logger_1.Logger.info("Ride request cancelled successfully", {
                userId,
                requestId: responseData.requestId,
            });
            const response = {
                success: true,
                message: RideMessages_1.RIDE_MESSAGES.RIDE_REQUEST_REJECTED,
                data: responseData,
            };
            res.status(HttpStatusCodes_1.HttpStatusCodes.OK).json(response);
        }
        catch (error) {
            Logger_1.Logger.error("Cancel ride request controller error", {
                userId: this.getUserId(req),
                error: error instanceof Error ? error.message : String(error),
            });
            const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error);
            res.status(statusCode).json(response);
        }
    }
    async getPendingRideRequests(req, res) {
        try {
            const userId = this.getUserId(req);
            const limit = req.query.limit
                ? parseInt(req.query.limit, 10)
                : 10;
            const offset = req.query.offset
                ? parseInt(req.query.offset, 10)
                : 0;
            const dto = GetPendingRideRequestsDto_1.GetPendingRideRequestsDto.fromRequest(userId, {
                limit,
                offset,
            });
            const result = await this.getPendingRideRequestsUseCase.execute(dto);
            if (result.isFailure()) {
                const error = result.getError();
                Logger_1.Logger.warn("Get pending ride requests failed", {
                    userId,
                    error: error.message,
                });
                const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error);
                res.status(statusCode).json(response);
                return;
            }
            const responseData = result.getValue();
            Logger_1.Logger.info("Pending ride requests fetched successfully", {
                userId,
                count: responseData.total,
            });
            const response = {
                success: true,
                message: RideMessages_1.RIDE_MESSAGES.PENDING_REQUESTS_FETCHED,
                data: responseData,
            };
            res.status(HttpStatusCodes_1.HttpStatusCodes.OK).json(response);
        }
        catch (error) {
            Logger_1.Logger.error("Get pending ride requests controller error", {
                userId: this.getUserId(req),
                error: error instanceof Error ? error.message : String(error),
            });
            const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error);
            res.status(statusCode).json(response);
        }
    }
    async getDriverRides(req, res) {
        try {
            const userId = this.getUserId(req);
            Logger_1.Logger.info("Get driver rides received", {
                userId,
                query: req.query,
            });
            const queryData = {
                page: req.query.page ? parseInt(req.query.page, 10) : 1,
                limit: req.query.limit ? parseInt(req.query.limit, 10) : 10,
                sortBy: req.query.sortBy,
                sortOrder: req.query.sortOrder,
                status: req.query.status,
                fromDate: req.query.fromDate,
                toDate: req.query.toDate,
            };
            const dto = GetDriverRidesDto_1.GetDriverRidesDto.fromRequest(userId, queryData);
            const result = await this.getDriverRidesUseCase.execute(dto);
            if (result.isFailure()) {
                const error = result.getError();
                Logger_1.Logger.warn("Get driver rides failed", {
                    userId,
                    error: error.message,
                });
                const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error);
                res.status(statusCode).json(response);
                return;
            }
            const responseData = result.getValue();
            Logger_1.Logger.info("Driver rides fetched successfully", {
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
            Logger_1.Logger.error("Get driver rides controller error", {
                userId: this.getUserId(req),
                error: error instanceof Error ? error.message : String(error),
            });
            const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error);
            res.status(statusCode).json(response);
        }
    }
    async getDriverRideById(req, res) {
        try {
            const userId = this.getUserId(req);
            if (!userId) {
                res.status(HttpStatusCodes_1.HttpStatusCodes.UNAUTHORIZED).json({
                    success: false,
                    message: DriverMessages_1.DRIVER_MESSAGES.UNAUTHORIZED,
                });
                return;
            }
            const rideId = req.params.rideId;
            if (!rideId) {
                res.status(HttpStatusCodes_1.HttpStatusCodes.BAD_REQUEST).json({
                    success: false,
                    message: DriverMessages_1.DRIVER_MESSAGES.RIDE_ID_REQUIRED,
                });
                return;
            }
            Logger_1.Logger.info("Get driver ride by ID received", {
                userId,
                rideId,
            });
            const dto = GetDriverRideByIdDto_1.GetDriverRideByIdDto.fromRequest(userId, { rideId });
            const result = await this.getDriverRideByIdUseCase.execute(dto);
            if (result.isFailure()) {
                const error = result.getError();
                Logger_1.Logger.warn("Get driver ride by ID failed", {
                    userId,
                    rideId,
                    error: error.message,
                });
                const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error);
                res.status(statusCode).json(response);
                return;
            }
            const responseData = result.getValue();
            Logger_1.Logger.info("Driver ride fetched successfully", {
                userId,
                rideId: responseData.ride.rideId,
                status: responseData.ride.status,
            });
            const response = {
                success: true,
                message: RideMessages_1.RIDE_MESSAGES.RIDE_FETCHED_SUCCESSFULLY,
                data: responseData,
            };
            res.status(HttpStatusCodes_1.HttpStatusCodes.OK).json(response);
        }
        catch (error) {
            Logger_1.Logger.error("Get driver ride by ID controller error", {
                userId: this.getUserId(req),
                rideId: req.params.rideId,
                error: error instanceof Error ? error.message : String(error),
            });
            const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error);
            res.status(statusCode).json(response);
        }
    }
};
exports.DriverRideController = DriverRideController;
exports.DriverRideController = DriverRideController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.AcceptRideRequestUseCase)),
    __param(1, (0, inversify_1.inject)(DITypes_1.TYPES.RejectRideRequestUseCase)),
    __param(2, (0, inversify_1.inject)(DITypes_1.TYPES.GetPendingRideRequestsUseCase)),
    __param(3, (0, inversify_1.inject)(DITypes_1.TYPES.GetDriverRidesUseCase)),
    __param(4, (0, inversify_1.inject)(DITypes_1.TYPES.GetDriverRideByIdUseCase)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], DriverRideController);
//# sourceMappingURL=DriverRideController.js.map