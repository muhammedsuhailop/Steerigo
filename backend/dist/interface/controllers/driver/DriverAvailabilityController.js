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
exports.DriverAvailabilityController = void 0;
const inversify_1 = require("inversify");
const express_validator_1 = require("express-validator");
const driver_1 = require("../../../application/dto/driver");
const Logger_1 = require("../../../shared/utils/Logger");
const ErrorHandlerService_1 = require("../../../shared/utils/ErrorHandlerService");
const DITypes_1 = require("../../../shared/constants/DITypes");
const HttpStatusCodes_1 = require("../../../shared/enums/HttpStatusCodes");
const DriverMessages_1 = require("../../../shared/constants/DriverMessages");
const AddAvailabilityExceptionRequestDto_1 = require("../../../application/dto/driver/AddAvailabilityExceptionRequestDto");
const EditAvailabilityExceptionRequestDto_1 = require("../../../application/dto/driver/EditAvailabilityExceptionRequestDto");
const RemoveAvailabilityExceptionRequestDto_1 = require("../../../application/dto/driver/RemoveAvailabilityExceptionRequestDto");
const UpdateBaseLocationRequestDto_1 = require("../../../application/dto/driver/UpdateBaseLocationRequestDto");
let DriverAvailabilityController = class DriverAvailabilityController {
    constructor(scheduleAvailabilityUseCase, updateStatusUseCase, updateLocationUseCase, addExceptionUseCase, editExceptionUseCase, removeExceptionUseCase, updateBaseLocationUseCase) {
        this.scheduleAvailabilityUseCase = scheduleAvailabilityUseCase;
        this.updateStatusUseCase = updateStatusUseCase;
        this.updateLocationUseCase = updateLocationUseCase;
        this.addExceptionUseCase = addExceptionUseCase;
        this.editExceptionUseCase = editExceptionUseCase;
        this.removeExceptionUseCase = removeExceptionUseCase;
        this.updateBaseLocationUseCase = updateBaseLocationUseCase;
    }
    async scheduleAvailability(req, res) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleValidationErrors(errors.array());
                res.status(statusCode).json(response);
                return;
            }
            const userId = req.user?.userId;
            if (!userId) {
                res.status(HttpStatusCodes_1.HttpStatusCodes.UNAUTHORIZED).json({
                    success: false,
                    message: DriverMessages_1.DRIVER_MESSAGES.DRIVER_AUTH_REQUIRED,
                });
                return;
            }
            const dto = driver_1.ScheduleRecurringAvailabilityRequestDto.fromRequest(userId, req.body);
            const result = await this.scheduleAvailabilityUseCase.execute(dto);
            if (result.isFailure()) {
                const error = result.getError();
                const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error);
                res.status(statusCode).json(response);
                return;
            }
            const data = result.getValue();
            const response = {
                success: true,
                message: DriverMessages_1.DRIVER_MESSAGES.AVAILABILITY_SCHEDULED,
                data,
            };
            res.status(HttpStatusCodes_1.HttpStatusCodes.CREATED).json(response);
            Logger_1.Logger.info("Availability scheduled successfully", { userId });
        }
        catch (error) {
            const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error);
            res.status(statusCode).json(response);
        }
    }
    async updateStatus(req, res) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleValidationErrors(errors.array());
                res.status(statusCode).json(response);
                return;
            }
            const dto = driver_1.UpdateStatusRequestDto.fromRequest(req.body);
            const driverId = dto.getDriverId();
            const result = await this.updateStatusUseCase.execute(dto);
            if (result.isFailure()) {
                const error = result.getError();
                const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error);
                res.status(statusCode).json(response);
                return;
            }
            const data = result.getValue();
            const response = {
                success: true,
                message: DriverMessages_1.DRIVER_MESSAGES.AVAILABILITY_STATUS_UPDATED,
                data,
            };
            res.status(HttpStatusCodes_1.HttpStatusCodes.OK).json(response);
            Logger_1.Logger.info("Availability status updated successfully", {
                driverId,
                newStatus: dto.getStatus(),
            });
        }
        catch (error) {
            const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error);
            res.status(statusCode).json(response);
        }
    }
    async updateLocation(req, res) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleValidationErrors(errors.array());
                res.status(statusCode).json(response);
                return;
            }
            const dto = driver_1.UpdateLocationRequestDto.fromRequest(req.body);
            const driverId = dto.getDriverId();
            const result = await this.updateLocationUseCase.execute(dto);
            if (result.isFailure()) {
                const error = result.getError();
                const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error);
                res.status(statusCode).json(response);
                return;
            }
            const data = result.getValue();
            const response = {
                success: true,
                message: DriverMessages_1.DRIVER_MESSAGES.DRIVER_LOCATION_UPDATED,
                data,
            };
            res.status(HttpStatusCodes_1.HttpStatusCodes.OK).json(response);
            Logger_1.Logger.info("Driver location updated successfully", { driverId });
        }
        catch (error) {
            const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error);
            res.status(statusCode).json(response);
        }
    }
    async addException(req, res) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleValidationErrors(errors.array());
                res.status(statusCode).json(response);
                return;
            }
            const userId = req.user?.userId;
            if (!userId) {
                res.status(HttpStatusCodes_1.HttpStatusCodes.UNAUTHORIZED).json({
                    success: false,
                    message: DriverMessages_1.DRIVER_MESSAGES.DRIVER_AUTH_REQUIRED,
                });
                return;
            }
            const dto = AddAvailabilityExceptionRequestDto_1.AddAvailabilityExceptionRequestDto.fromRequest(userId, req.body);
            const result = await this.addExceptionUseCase.execute(dto);
            if (result.isFailure()) {
                const error = result.getError();
                const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error);
                res.status(statusCode).json(response);
                return;
            }
            const data = result.getValue();
            const response = {
                success: true,
                message: DriverMessages_1.DRIVER_MESSAGES.EXCEPTION_ADDED,
                data,
            };
            res.status(HttpStatusCodes_1.HttpStatusCodes.CREATED).json(response);
            Logger_1.Logger.info("Exception added successfully", { userId });
        }
        catch (error) {
            const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error);
            res.status(statusCode).json(response);
        }
    }
    async editException(req, res) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleValidationErrors(errors.array());
                res.status(statusCode).json(response);
                return;
            }
            const userId = req.user?.userId;
            if (!userId) {
                res.status(HttpStatusCodes_1.HttpStatusCodes.UNAUTHORIZED).json({
                    success: false,
                    message: DriverMessages_1.DRIVER_MESSAGES.DRIVER_AUTH_REQUIRED,
                });
                return;
            }
            const exceptionId = req.params.exceptionId;
            const dto = EditAvailabilityExceptionRequestDto_1.EditAvailabilityExceptionRequestDto.fromRequest(userId, exceptionId, req.body);
            const result = await this.editExceptionUseCase.execute(dto);
            if (result.isFailure()) {
                const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(result.getError());
                res.status(statusCode).json(response);
                return;
            }
            const data = result.getValue();
            const response = {
                success: true,
                message: DriverMessages_1.DRIVER_MESSAGES.AVAILABILITY_EXCEPTION_UPDATED,
                data,
            };
            res.status(HttpStatusCodes_1.HttpStatusCodes.OK).json(response);
            Logger_1.Logger.info("Exception updated successfully", {
                userId,
                exceptionId,
            });
        }
        catch (error) {
            const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error);
            res.status(statusCode).json(response);
        }
    }
    async removeException(req, res) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleValidationErrors(errors.array());
                res.status(statusCode).json(response);
                return;
            }
            const userId = req.user?.userId;
            if (!userId) {
                res.status(HttpStatusCodes_1.HttpStatusCodes.UNAUTHORIZED).json({
                    success: false,
                    message: DriverMessages_1.DRIVER_MESSAGES.DRIVER_AUTH_REQUIRED,
                });
                return;
            }
            const exceptionId = req.params.exceptionId;
            const dto = RemoveAvailabilityExceptionRequestDto_1.RemoveAvailabilityExceptionRequestDto.fromRequest(userId, exceptionId);
            const result = await this.removeExceptionUseCase.execute(dto);
            if (result.isFailure()) {
                const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(result.getError());
                res.status(statusCode).json(response);
                return;
            }
            const data = result.getValue();
            const response = {
                success: true,
                message: DriverMessages_1.DRIVER_MESSAGES.AVAILABILITY_EXCEPTION_REMOVED,
                data,
            };
            res.status(HttpStatusCodes_1.HttpStatusCodes.OK).json(response);
            Logger_1.Logger.info("Exception removed successfully", {
                userId,
                exceptionId,
            });
        }
        catch (error) {
            const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error);
            res.status(statusCode).json(response);
        }
    }
    async updateBaseLocation(req, res) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleValidationErrors(errors.array());
                res.status(statusCode).json(response);
                return;
            }
            const dto = UpdateBaseLocationRequestDto_1.UpdateBaseLocationRequestDto.fromRequest(req.body);
            const driverId = dto.getDriverId();
            const result = await this.updateBaseLocationUseCase.execute(dto);
            if (result.isFailure()) {
                const error = result.getError();
                const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error);
                res.status(statusCode).json(response);
                return;
            }
            const data = result.getValue();
            const response = {
                success: true,
                message: DriverMessages_1.DRIVER_MESSAGES.DRIVER_BASE_LOCATION_UPDATED,
                data,
            };
            res.status(HttpStatusCodes_1.HttpStatusCodes.OK).json(response);
            Logger_1.Logger.info("Driver base location updated successfully", { driverId });
        }
        catch (error) {
            const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error);
            res.status(statusCode).json(response);
        }
    }
};
exports.DriverAvailabilityController = DriverAvailabilityController;
exports.DriverAvailabilityController = DriverAvailabilityController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.ScheduleRecurringAvailabilityUseCase)),
    __param(1, (0, inversify_1.inject)(DITypes_1.TYPES.UpdateAvailabilityStatusUseCase)),
    __param(2, (0, inversify_1.inject)(DITypes_1.TYPES.UpdateDriverLocationUseCase)),
    __param(3, (0, inversify_1.inject)(DITypes_1.TYPES.AddAvailabilityExceptionUseCase)),
    __param(4, (0, inversify_1.inject)(DITypes_1.TYPES.EditAvailabilityExceptionUseCase)),
    __param(5, (0, inversify_1.inject)(DITypes_1.TYPES.RemoveAvailabilityExceptionUseCase)),
    __param(6, (0, inversify_1.inject)(DITypes_1.TYPES.UpdateDriverBaseLocationUseCase)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object])
], DriverAvailabilityController);
//# sourceMappingURL=DriverAvailabilityController.js.map