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
exports.OtpController = void 0;
const inversify_1 = require("inversify");
const ResendOtpDto_1 = require("../../../application/dto/auth/ResendOtpDto");
const Logger_1 = require("../../../shared/utils/Logger");
const ErrorHandlerService_1 = require("../../../shared/utils/ErrorHandlerService");
const AuthConstants_1 = require("../../../shared/constants/AuthConstants");
const DITypes_1 = require("../../../shared/constants/DITypes");
const HttpStatusCodes_1 = require("../../../shared/enums/HttpStatusCodes");
let OtpController = class OtpController {
    constructor(resendOtpUseCase) {
        this.resendOtpUseCase = resendOtpUseCase;
    }
    async resendOtp(req, res) {
        try {
            const dto = ResendOtpDto_1.ResendOtpDto.fromRequest(req.body);
            const result = await this.resendOtpUseCase.execute(dto);
            if (result.isFailure()) {
                const error = result.getError();
                const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error, "resend_otp");
                res.status(statusCode).json(response);
                return;
            }
            const data = result.getValue();
            const response = {
                success: true,
                message: AuthConstants_1.AuthMessages.OTP_RESEND_SUCCESS,
                data,
            };
            res.status(HttpStatusCodes_1.HttpStatusCodes.OK).json(response);
            Logger_1.Logger.info("Resend OTP completed successfully", {
                email: dto.getEmail(),
            });
        }
        catch (error) {
            Logger_1.Logger.error("Resend OTP controller error", { error });
            res.status(HttpStatusCodes_1.HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: AuthConstants_1.AuthMessages.INTERNAL_SERVER_ERROR,
            });
        }
    }
};
exports.OtpController = OtpController;
exports.OtpController = OtpController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.ResendOtpUseCase)),
    __metadata("design:paramtypes", [Object])
], OtpController);
//# sourceMappingURL=OtpController.js.map