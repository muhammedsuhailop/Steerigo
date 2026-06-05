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
exports.AdminDriverController = void 0;
const inversify_1 = require("inversify");
const GetDriversRequestDto_1 = require("../../../application/dto/admin/GetDriversRequestDto");
const DriverActionRequestDto_1 = require("../../../application/dto/admin/DriverActionRequestDto");
const GetDriverProfileRequestDto_1 = require("../../../application/dto/admin/GetDriverProfileRequestDto");
const GetKycRequestsRequestDto_1 = require("../../../application/dto/admin/GetKycRequestsRequestDto");
const UpdateKycStatusRequestDto_1 = require("../../../application/dto/admin/UpdateKycStatusRequestDto");
const GetKycRequestByIdRequestDto_1 = require("../../../application/dto/admin/GetKycRequestByIdRequestDto");
const ErrorHandlerService_1 = require("../../../shared/utils/ErrorHandlerService");
const DITypes_1 = require("../../../shared/constants/DITypes");
const AdminMessages_1 = require("../../../shared/constants/AdminMessages");
const HttpStatusCodes_1 = require("../../../shared/enums/HttpStatusCodes");
const UpdateDriverKycStatusRequestDto_1 = require("../../../application/dto/admin/UpdateDriverKycStatusRequestDto");
let AdminDriverController = class AdminDriverController {
    constructor(getDriversUseCase, driverActionUseCase, getDriverProfileUseCase, getKycRequestsUseCase, updateKycStatusUseCase, getKycRequestByIdUseCase, updateDriverKycStatusUseCase) {
        this.getDriversUseCase = getDriversUseCase;
        this.driverActionUseCase = driverActionUseCase;
        this.getDriverProfileUseCase = getDriverProfileUseCase;
        this.getKycRequestsUseCase = getKycRequestsUseCase;
        this.updateKycStatusUseCase = updateKycStatusUseCase;
        this.getKycRequestByIdUseCase = getKycRequestByIdUseCase;
        this.updateDriverKycStatusUseCase = updateDriverKycStatusUseCase;
    }
    async getDrivers(req, res) {
        try {
            const dto = GetDriversRequestDto_1.GetDriversRequestDto.fromRequest(req.query);
            const result = await this.getDriversUseCase.execute(dto);
            if (result.isFailure()) {
                const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(result.getError());
                res.status(statusCode).json(response);
                return;
            }
            res.status(HttpStatusCodes_1.HttpStatusCodes.OK).json({
                success: true,
                message: AdminMessages_1.ADMIN_MESSAGES.DRIVER.DRIVERS_FETCHED,
                data: result.getValue(),
            });
        }
        catch (error) {
            const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error);
            res.status(statusCode).json(response);
        }
    }
    async driverAction(req, res) {
        try {
            const dto = DriverActionRequestDto_1.DriverActionRequestDto.fromRequest(req.params.driverId, req.body);
            const result = await this.driverActionUseCase.execute(dto);
            if (result.isFailure()) {
                const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(result.getError());
                res.status(statusCode).json(response);
                return;
            }
            const data = result.getValue();
            res.status(HttpStatusCodes_1.HttpStatusCodes.OK).json({
                success: true,
                message: data.message,
                data: {
                    driverId: data.driverId,
                    newStatus: data.newStatus,
                },
            });
        }
        catch (error) {
            const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error);
            res.status(statusCode).json(response);
        }
    }
    async getDriverProfile(req, res) {
        try {
            const dto = GetDriverProfileRequestDto_1.GetDriverProfileRequestDto.fromData({
                driverId: req.params.driverId,
            });
            const result = await this.getDriverProfileUseCase.execute(dto);
            if (result.isFailure()) {
                const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(result.getError());
                res.status(statusCode).json(response);
                return;
            }
            res.status(HttpStatusCodes_1.HttpStatusCodes.OK).json({
                success: true,
                message: AdminMessages_1.ADMIN_MESSAGES.DRIVER.DRIVER_PROFILE_FETCHED,
                data: result.getValue(),
            });
        }
        catch (error) {
            const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error);
            res.status(statusCode).json(response);
        }
    }
    async getKycRequests(req, res) {
        try {
            const dto = GetKycRequestsRequestDto_1.GetKycRequestsRequestDto.fromRequest(req.query);
            const result = await this.getKycRequestsUseCase.execute(dto);
            if (result.isFailure()) {
                const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(result.getError(), "get_kyc_requests");
                res.status(statusCode).json(response);
                return;
            }
            res.status(HttpStatusCodes_1.HttpStatusCodes.OK).json({
                success: true,
                message: AdminMessages_1.ADMIN_MESSAGES.DRIVER.KYC_REQUESTS_FETCHED,
                data: result.getValue(),
            });
        }
        catch (error) {
            const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error);
            res.status(statusCode).json(response);
        }
    }
    async updateKycStatus(req, res) {
        try {
            const dto = UpdateKycStatusRequestDto_1.UpdateKycStatusRequestDto.fromRequest(req.params.kycId, req.body);
            const result = await this.updateKycStatusUseCase.execute(dto);
            if (result.isFailure()) {
                const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(result.getError());
                res.status(statusCode).json(response);
                return;
            }
            const data = result.getValue();
            res.status(HttpStatusCodes_1.HttpStatusCodes.OK).json({
                success: true,
                message: data.message,
                data: {
                    kycDocument: data.kycDocument,
                    driverKycStatusUpdated: data.driverKycStatusUpdated,
                },
            });
        }
        catch (error) {
            const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error);
            res.status(statusCode).json(response);
        }
    }
    async getKycRequestById(req, res) {
        try {
            const dto = GetKycRequestByIdRequestDto_1.GetKycRequestByIdRequestDto.fromRequest({
                kycId: req.params.kycId,
            });
            const result = await this.getKycRequestByIdUseCase.execute(dto);
            if (result.isFailure()) {
                const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(result.getError());
                res.status(statusCode).json(response);
                return;
            }
            res.status(HttpStatusCodes_1.HttpStatusCodes.OK).json({
                success: true,
                message: AdminMessages_1.ADMIN_MESSAGES.DRIVER.KYC_DOCUMENT_FETCHED,
                data: result.getValue(),
            });
        }
        catch (error) {
            const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error);
            res.status(statusCode).json(response);
        }
    }
    async updateDriverKycStatus(req, res) {
        try {
            const dto = UpdateDriverKycStatusRequestDto_1.UpdateDriverKycStatusRequestDto.fromRequest(req.params.driverId, req.body);
            const result = await this.updateDriverKycStatusUseCase.execute(dto);
            if (result.isFailure()) {
                const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(result.getError());
                res.status(statusCode).json(response);
                return;
            }
            const data = result.getValue();
            res.status(HttpStatusCodes_1.HttpStatusCodes.OK).json({
                success: true,
                message: data.message,
                data: {
                    driverId: data.driverId,
                    previousKycStatus: data.previousKycStatus,
                    newKycStatus: data.newKycStatus,
                },
            });
        }
        catch (error) {
            const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error);
            res.status(statusCode).json(response);
        }
    }
};
exports.AdminDriverController = AdminDriverController;
exports.AdminDriverController = AdminDriverController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.GetDriversUseCase)),
    __param(1, (0, inversify_1.inject)(DITypes_1.TYPES.DriverActionUseCase)),
    __param(2, (0, inversify_1.inject)(DITypes_1.TYPES.GetDriverProfileUseCase)),
    __param(3, (0, inversify_1.inject)(DITypes_1.TYPES.GetKycRequestsUseCase)),
    __param(4, (0, inversify_1.inject)(DITypes_1.TYPES.UpdateKycStatusUseCase)),
    __param(5, (0, inversify_1.inject)(DITypes_1.TYPES.GetKycRequestByIdUseCase)),
    __param(6, (0, inversify_1.inject)(DITypes_1.TYPES.UpdateDriverKycStatusUseCase)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object])
], AdminDriverController);
//# sourceMappingURL=AdminDriverController.js.map