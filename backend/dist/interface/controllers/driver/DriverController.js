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
exports.DriverController = void 0;
const inversify_1 = require("inversify");
const DriverRegistrationRequestDto_1 = require("../../../application/dto/driver/DriverRegistrationRequestDto");
const DriverProfileUpdateDto_1 = require("../../../application/dto/driver/DriverProfileUpdateDto");
const KYCSubmissionRequestDto_1 = require("../../../application/dto/driver/KYCSubmissionRequestDto");
const HttpStatusCodes_1 = require("../../../shared/enums/HttpStatusCodes");
const Logger_1 = require("../../../shared/utils/Logger");
const DITypes_1 = require("../../../shared/constants/DITypes");
const DocumentType_1 = require("../../../domain/value-objects/DocumentType");
const GetDriverDashboardDto_1 = require("../../../application/dto/driver/GetDriverDashboardDto");
const ErrorHandlerService_1 = require("../../../shared/utils/ErrorHandlerService");
const GetDriverProfileRequestDto_1 = require("../../../application/dto/driver/GetDriverProfileRequestDto");
const DriverMessages_1 = require("../../../shared/constants/DriverMessages");
let DriverController = class DriverController {
    constructor(registerDriverUseCase, getDetailedProfileUseCase, updateDriverProfileUseCase, SubmitKYCUseCase, getKYCStatusUseCase, getDashboardUseCase, getStatusUseCase) {
        this.registerDriverUseCase = registerDriverUseCase;
        this.getDetailedProfileUseCase = getDetailedProfileUseCase;
        this.updateDriverProfileUseCase = updateDriverProfileUseCase;
        this.SubmitKYCUseCase = SubmitKYCUseCase;
        this.getKYCStatusUseCase = getKYCStatusUseCase;
        this.getDashboardUseCase = getDashboardUseCase;
        this.getStatusUseCase = getStatusUseCase;
    }
    getUserId(req) {
        const user = req.user;
        return user?.userId ?? null;
    }
    async register(req, res) {
        try {
            const userId = this.getUserId(req);
            if (!userId) {
                res.status(HttpStatusCodes_1.HttpStatusCodes.UNAUTHORIZED).json({
                    success: false,
                    message: DriverMessages_1.DRIVER_MESSAGES.UNAUTHORIZED,
                });
                return;
            }
            const body = req.body;
            const dto = DriverRegistrationRequestDto_1.DriverRegistrationRequestDto.fromRequest(userId, body);
            Logger_1.Logger.info("Driver registration request received", {
                userId,
                name: body.name,
                mobile: body.mobile,
                licenseCategory: body.licenseCategory,
            });
            const result = await this.registerDriverUseCase.execute(dto);
            if (result.isSuccessful()) {
                const responseData = result.getValue();
                Logger_1.Logger.info("Driver registration successful", {
                    userId,
                    driverId: responseData.driver.id,
                    licenseKycId: responseData.kycDocumentsCreated.license,
                    idKycId: responseData.kycDocumentsCreated.idDocument,
                });
                const response = {
                    success: true,
                    message: DriverMessages_1.DRIVER_MESSAGES.DRIVER_REGISTRATION_SUCCESS,
                    data: responseData,
                };
                res.status(HttpStatusCodes_1.HttpStatusCodes.CREATED).json(response);
            }
            else {
                const error = result.getError();
                Logger_1.Logger.warn("Driver registration failed", {
                    userId,
                    error: error.message,
                });
                res.status(HttpStatusCodes_1.HttpStatusCodes.BAD_REQUEST).json({
                    success: false,
                    message: error.message,
                });
            }
        }
        catch (error) {
            Logger_1.Logger.error("Driver registration controller error", {
                userId: this.getUserId(req),
                error: error instanceof Error ? error.message : String(error),
                stack: error instanceof Error ? error.stack : undefined,
            });
            res.status(HttpStatusCodes_1.HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: DriverMessages_1.DRIVER_MESSAGES.INTERNAL_SERVER_ERROR,
            });
        }
    }
    async updateProfile(req, res) {
        try {
            const userId = this.getUserId(req);
            if (!userId) {
                res
                    .status(HttpStatusCodes_1.HttpStatusCodes.UNAUTHORIZED)
                    .json({ success: false, message: DriverMessages_1.DRIVER_MESSAGES.UNAUTHORIZED });
                return;
            }
            const body = req.body;
            Logger_1.Logger.info("Driver profile update request received", {
                userId,
                fields: Object.keys(body || {}),
            });
            const dto = DriverProfileUpdateDto_1.DriverProfileUpdateDto.fromRequest(userId, body);
            Logger_1.Logger.info("Driver profile update DTO created", {
                userId,
                hasUserUpdates: dto.hasUserProfileUpdates(),
                hasVehicleUpdates: dto.hasVehicleTypeUpdates(),
            });
            const result = await this.updateDriverProfileUseCase.execute(dto);
            if (result.isFailure()) {
                const error = result.getError();
                Logger_1.Logger.warn("Driver profile update failed", {
                    userId,
                    error: error.message,
                });
                const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error);
                res.status(statusCode).json(response);
                return;
            }
            const responseData = result.getValue();
            Logger_1.Logger.info("Driver profile update successful", {
                userId,
                userUpdated: responseData.userUpdated,
                vehiclesUpdated: responseData.vehiclesUpdated,
                kycStatusUpdated: responseData.kycStatusUpdated,
            });
            const response = {
                success: true,
                message: DriverMessages_1.DRIVER_MESSAGES.PROFILE_UPDATE_SUCCESS,
                data: responseData,
            };
            res.status(HttpStatusCodes_1.HttpStatusCodes.OK).json(response);
        }
        catch (error) {
            Logger_1.Logger.error("Update driver profile controller error", {
                userId: this.getUserId(req),
                error: error instanceof Error ? error.message : String(error),
            });
            const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error);
            res.status(statusCode).json(response);
        }
    }
    async submitKYC(req, res) {
        try {
            const userId = this.getUserId(req);
            if (!userId) {
                res.status(HttpStatusCodes_1.HttpStatusCodes.UNAUTHORIZED).json({
                    success: false,
                    message: DriverMessages_1.DRIVER_MESSAGES.STATUS_USERID_NOT_FOUND,
                });
                return;
            }
            const docType = req.body.docType;
            const VALID_DOC_TYPES = [
                DocumentType_1.DocumentType.LICENSE,
                DocumentType_1.DocumentType.AADHAAR,
                DocumentType_1.DocumentType.PAN,
                DocumentType_1.DocumentType.PASSPORT,
            ];
            if (!docType || !VALID_DOC_TYPES.includes(docType)) {
                res.status(HttpStatusCodes_1.HttpStatusCodes.BAD_REQUEST).json({
                    success: false,
                    message: `${DriverMessages_1.DRIVER_MESSAGES.INVALID_MISSING_DOC_TYPE} Accepted: ${VALID_DOC_TYPES.join(", ")}`,
                });
                return;
            }
            Logger_1.Logger.info("KYC submission request received", {
                userId,
                docType,
                body: Object.keys(req.body),
            });
            let dto;
            if (docType === DocumentType_1.DocumentType.LICENSE) {
                const licenseBody = req.body;
                dto = KYCSubmissionRequestDto_1.KYCSubmissionRequestDto.fromLicenseRequest(userId, licenseBody);
            }
            else {
                const genericBody = req.body;
                dto = KYCSubmissionRequestDto_1.KYCSubmissionRequestDto.fromGenericRequest(userId, docType, genericBody);
            }
            Logger_1.Logger.info("KYC submission DTO created", {
                userId,
                docType,
                hasLicense: dto.hasLicenseUpdate(),
                hasId: dto.hasIdUpdate(),
                hasImages: dto.hasImages(),
            });
            const result = await this.SubmitKYCUseCase.execute(dto);
            if (result.isFailure()) {
                const error = result.getError();
                Logger_1.Logger.warn("KYC submission failed", {
                    userId,
                    docType,
                    error: error.message,
                });
                const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error);
                res.status(statusCode).json(response);
                return;
            }
            const responseData = result.getValue();
            Logger_1.Logger.info("KYC submission successful", {
                userId,
                docType,
                licenseUpdated: responseData.licenseUpdated,
                idUpdated: responseData.idUpdated,
                driverUpdated: responseData.driverUpdated,
            });
            const response = {
                success: true,
                message: responseData.message,
                data: {
                    kycDocuments: responseData.kycDocuments,
                    licenseUpdated: responseData.licenseUpdated,
                    idUpdated: responseData.idUpdated,
                    driverUpdated: responseData.driverUpdated,
                },
            };
            res.status(HttpStatusCodes_1.HttpStatusCodes.OK).json(response);
        }
        catch (error) {
            Logger_1.Logger.error("KYC submission controller error", {
                userId: this.getUserId(req),
                error: error instanceof Error ? error.message : String(error),
            });
            const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error);
            res.status(statusCode).json(response);
        }
    }
    async getKYCStatus(req, res) {
        try {
            const userId = this.getUserId(req);
            if (!userId) {
                res
                    .status(HttpStatusCodes_1.HttpStatusCodes.UNAUTHORIZED)
                    .json({ success: false, message: DriverMessages_1.DRIVER_MESSAGES.UNAUTHORIZED });
                return;
            }
            const result = await this.getKYCStatusUseCase.execute(userId);
            if (result.isFailure()) {
                const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(result.getError());
                res.status(statusCode).json(response);
                return;
            }
            const response = {
                success: true,
                message: DriverMessages_1.DRIVER_MESSAGES.KYC_STATUS_RETRIEVED,
                data: result.getValue(),
            };
            res.status(HttpStatusCodes_1.HttpStatusCodes.OK).json(response);
        }
        catch (error) {
            Logger_1.Logger.error("Get KYC status controller error", { error });
            res.status(HttpStatusCodes_1.HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: DriverMessages_1.DRIVER_MESSAGES.INTERNAL_SERVER_ERROR,
            });
        }
    }
    async getDashboard(req, res) {
        try {
            const userId = this.getUserId(req);
            if (!userId) {
                res
                    .status(HttpStatusCodes_1.HttpStatusCodes.UNAUTHORIZED)
                    .json({ success: false, message: DriverMessages_1.DRIVER_MESSAGES.UNAUTHORIZED });
                return;
            }
            const dto = GetDriverDashboardDto_1.GetDriverDashboardDto.fromRequest(userId);
            const result = await this.getDashboardUseCase.execute(dto);
            if (result.isFailure()) {
                const error = result.getError();
                const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error);
                res.status(statusCode).json(response);
                return;
            }
            const dashboardResponse = result.getValue();
            const response = {
                success: true,
                message: DriverMessages_1.DRIVER_MESSAGES.DASHBOARD_DATA_RETRIEVED,
                data: dashboardResponse,
            };
            res.status(HttpStatusCodes_1.HttpStatusCodes.OK).json(response);
            Logger_1.Logger.info(DriverMessages_1.DRIVER_MESSAGES.DRIVER_DASHBOARD_RETURNED, { userId });
        }
        catch (error) {
            const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error);
            res.status(statusCode).json(response);
        }
    }
    async getStatus(req, res) {
        try {
            const userId = this.getUserId(req);
            if (!userId) {
                res.status(HttpStatusCodes_1.HttpStatusCodes.UNAUTHORIZED).json({
                    success: false,
                    message: DriverMessages_1.DRIVER_MESSAGES.STATUS_USERID_NOT_FOUND,
                });
                return;
            }
            Logger_1.Logger.info("Getting driver status", { userId });
            const result = await this.getStatusUseCase.execute(userId);
            if (result.isFailure()) {
                const error = result.getError();
                const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error);
                res.status(statusCode).json(response);
                return;
            }
            const statusResponse = result.getValue();
            const response = {
                success: true,
                message: DriverMessages_1.DRIVER_MESSAGES.DRIVER_STATUS_RETRIEVED,
                data: statusResponse,
            };
            res.status(HttpStatusCodes_1.HttpStatusCodes.OK).json(response);
            Logger_1.Logger.info("Driver status returned successfully", { userId });
        }
        catch (error) {
            Logger_1.Logger.error("Get driver status controller error", { error });
            const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error);
            res.status(statusCode).json(response);
        }
    }
    async getDetailedProfile(req, res) {
        try {
            const userId = this.getUserId(req);
            if (!userId) {
                res
                    .status(HttpStatusCodes_1.HttpStatusCodes.UNAUTHORIZED)
                    .json({ success: false, message: DriverMessages_1.DRIVER_MESSAGES.UNAUTHORIZED });
                return;
            }
            Logger_1.Logger.info("Get detailed driver profile request", {
                userId,
                ip: req.ip,
                timestamp: new Date().toISOString(),
            });
            const dto = new GetDriverProfileRequestDto_1.GetDriverProfileRequestDto(userId);
            const result = await this.getDetailedProfileUseCase.execute(dto);
            if (result.isFailure()) {
                const error = result.getError();
                Logger_1.Logger.warn(DriverMessages_1.DRIVER_MESSAGES.DRIVER_DETAILED_PROFILE_FETCH_FAILED, {
                    userId,
                    error: error.message,
                });
                const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error);
                res.status(statusCode).json(response);
                return;
            }
            const profileResponse = result.getValue();
            const response = {
                success: true,
                message: DriverMessages_1.DRIVER_MESSAGES.DRIVER_DETAILED_PROFILE_RETURNED,
                data: profileResponse,
            };
            res.status(HttpStatusCodes_1.HttpStatusCodes.OK).json(response);
        }
        catch (error) {
            Logger_1.Logger.error("Get detailed driver profile controller error", {
                userId: req.params.userId,
                error: error instanceof Error ? error.message : String(error),
                stack: error instanceof Error ? error.stack : undefined,
            });
            const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error);
            res.status(statusCode).json(response);
        }
    }
};
exports.DriverController = DriverController;
exports.DriverController = DriverController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.RegisterDriverUseCase)),
    __param(1, (0, inversify_1.inject)(DITypes_1.TYPES.GetDriverDetailedProfileUseCase)),
    __param(2, (0, inversify_1.inject)(DITypes_1.TYPES.UpdateDriverProfileUseCase)),
    __param(3, (0, inversify_1.inject)(DITypes_1.TYPES.SubmitKYCUseCase)),
    __param(4, (0, inversify_1.inject)(DITypes_1.TYPES.GetKYCStatusUseCase)),
    __param(5, (0, inversify_1.inject)(DITypes_1.TYPES.GetDriverDashboardUseCase)),
    __param(6, (0, inversify_1.inject)(DITypes_1.TYPES.GetDriverStatusUseCase)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object])
], DriverController);
//# sourceMappingURL=DriverController.js.map