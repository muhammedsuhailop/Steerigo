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
exports.DriverWalletController = void 0;
const inversify_1 = require("inversify");
const GetDriverWalletDto_1 = require("@application/dto/driver/GetDriverWalletDto");
const HttpStatusCodes_1 = require("@shared/enums/HttpStatusCodes");
const DITypes_1 = require("@shared/constants/DITypes");
const Logger_1 = require("@shared/utils/Logger");
const ErrorHandlerService_1 = require("@shared/utils/ErrorHandlerService");
const DriverMessages_1 = require("@shared/constants/DriverMessages");
let DriverWalletController = class DriverWalletController {
    constructor(getDriverWalletUseCase) {
        this.getDriverWalletUseCase = getDriverWalletUseCase;
    }
    async getWallet(req, res) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                res.status(HttpStatusCodes_1.HttpStatusCodes.UNAUTHORIZED).json({
                    success: false,
                    message: DriverMessages_1.DRIVER_MESSAGES.UNAUTHORIZED,
                });
                return;
            }
            Logger_1.Logger.info("Driver wallet fetch request received", {
                userId,
                query: req.query,
            });
            const dto = GetDriverWalletDto_1.GetDriverWalletDto.fromRequest(userId, req.query);
            const result = await this.getDriverWalletUseCase.execute(dto);
            if (result.isFailure()) {
                const error = result.getError();
                Logger_1.Logger.warn("Driver wallet fetch failed", {
                    userId,
                    error: error.message,
                });
                const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error, "get_driver_wallet");
                res.status(statusCode).json(response);
                return;
            }
            res.status(HttpStatusCodes_1.HttpStatusCodes.OK).json(result.getValue());
        }
        catch (error) {
            Logger_1.Logger.error("Driver wallet controller error", {
                userId: req.user?.userId,
                error: error instanceof Error ? error.message : String(error),
                stack: error instanceof Error ? error.stack : undefined,
            });
            res.status(HttpStatusCodes_1.HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: DriverMessages_1.DRIVER_MESSAGES.INTERNAL_SERVER_ERROR,
            });
        }
    }
};
exports.DriverWalletController = DriverWalletController;
exports.DriverWalletController = DriverWalletController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.GetDriverWalletUseCase)),
    __metadata("design:paramtypes", [Object])
], DriverWalletController);
//# sourceMappingURL=DriverWalletController.js.map