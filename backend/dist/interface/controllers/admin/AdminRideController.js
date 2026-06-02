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
exports.AdminRideController = void 0;
const inversify_1 = require("inversify");
const GetAdminRidesDto_1 = require("../../../application/dto/admin/GetAdminRidesDto");
const ErrorHandlerService_1 = require("../../../shared/utils/ErrorHandlerService");
const Logger_1 = require("../../../shared/utils/Logger");
const DITypes_1 = require("../../../shared/constants/DITypes");
const HttpStatusCodes_1 = require("../../../shared/enums/HttpStatusCodes");
const GetAdminRatingsDto_1 = require("../../../application/dto/admin/GetAdminRatingsDto");
const GetAdminRideByIdDto_1 = require("../../../application/dto/admin/GetAdminRideByIdDto");
let AdminRideController = class AdminRideController {
    constructor(getAdminRidesUseCase, getAdminRatingsUseCase, getAdminRideByIdUseCase) {
        this.getAdminRidesUseCase = getAdminRidesUseCase;
        this.getAdminRatingsUseCase = getAdminRatingsUseCase;
        this.getAdminRideByIdUseCase = getAdminRideByIdUseCase;
    }
    async getRides(req, res) {
        try {
            Logger_1.Logger.info("Admin get rides received", { query: req.query });
            const dto = GetAdminRidesDto_1.GetAdminRidesDto.fromRequest(req.query);
            const result = await this.getAdminRidesUseCase.execute(dto);
            if (result.isFailure()) {
                const error = result.getError();
                Logger_1.Logger.warn("Admin get rides failed", { error: error.message });
                const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error, "admin_get_rides");
                res.status(statusCode).json(response);
                return;
            }
            res.status(HttpStatusCodes_1.HttpStatusCodes.OK).json(result.getValue());
        }
        catch (error) {
            Logger_1.Logger.error("Admin get rides controller error", {
                error: error instanceof Error ? error.message : String(error),
            });
            const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error, "admin_get_rides");
            res.status(statusCode).json(response);
        }
    }
    async getRatings(req, res) {
        try {
            Logger_1.Logger.info("Admin get ratings received", { query: req.query });
            const dto = GetAdminRatingsDto_1.GetAdminRatingsDto.fromRequest(req.query);
            const result = await this.getAdminRatingsUseCase.execute(dto);
            if (result.isFailure()) {
                const error = result.getError();
                Logger_1.Logger.warn("Admin get ratings failed", { error: error.message });
                const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error, "admin_get_ratings");
                res.status(statusCode).json(response);
                return;
            }
            res.status(HttpStatusCodes_1.HttpStatusCodes.OK).json(result.getValue());
        }
        catch (error) {
            Logger_1.Logger.error("Admin get ratings controller error", {
                error: error instanceof Error ? error.message : String(error),
            });
            const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error, "admin_get_ratings");
            res.status(statusCode).json(response);
        }
    }
    async getRideById(req, res) {
        try {
            const rideId = req.params.rideId;
            Logger_1.Logger.info("Admin get ride by ID received", { rideId });
            const dto = GetAdminRideByIdDto_1.GetAdminRideByIdDto.fromRequest({ rideId: rideId });
            const result = await this.getAdminRideByIdUseCase.execute(dto);
            if (result.isFailure()) {
                const error = result.getError();
                Logger_1.Logger.warn("Admin get ride by ID failed", {
                    rideId,
                    error: error?.message,
                });
                const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error, "admin_get_ride_by_id");
                res.status(statusCode).json(response);
                return;
            }
            res.status(HttpStatusCodes_1.HttpStatusCodes.OK).json(result.getValue());
        }
        catch (error) {
            Logger_1.Logger.error("Admin get ride by ID controller error", {
                rideId: req.params.rideId,
                error: error instanceof Error ? error.message : String(error),
            });
            const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error, "admin_get_ride_by_id");
            res.status(statusCode).json(response);
        }
    }
};
exports.AdminRideController = AdminRideController;
exports.AdminRideController = AdminRideController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.GetAdminRidesUseCase)),
    __param(1, (0, inversify_1.inject)(DITypes_1.TYPES.GetAdminRatingsUseCase)),
    __param(2, (0, inversify_1.inject)(DITypes_1.TYPES.GetAdminRideByIdUseCase)),
    __metadata("design:paramtypes", [Object, Object, Object])
], AdminRideController);
//# sourceMappingURL=AdminRideController.js.map