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
exports.AdminWalletController = void 0;
const inversify_1 = require("inversify");
const HttpStatusCodes_1 = require("../../../shared/enums/HttpStatusCodes");
const DITypes_1 = require("../../../shared/constants/DITypes");
const Logger_1 = require("../../../shared/utils/Logger");
const ErrorHandlerService_1 = require("../../../shared/utils/ErrorHandlerService");
const GetAdminWalletDto_1 = require("../../../application/dto/admin/GetAdminWalletDto");
let AdminWalletController = class AdminWalletController {
    constructor(getAdminWalletUseCase) {
        this.getAdminWalletUseCase = getAdminWalletUseCase;
    }
    async getWallet(req, res) {
        try {
            Logger_1.Logger.info("Admin get wallet request received", { query: req.query });
            const dto = GetAdminWalletDto_1.GetAdminWalletDto.fromRequest(req.query);
            const result = await this.getAdminWalletUseCase.execute(dto);
            if (result.isFailure()) {
                const error = result.getError();
                Logger_1.Logger.warn("Admin get wallet failed", { error: error?.message });
                const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error, "admin_get_wallet");
                res.status(statusCode).json(response);
                return;
            }
            res.status(HttpStatusCodes_1.HttpStatusCodes.OK).json(result.getValue());
        }
        catch (error) {
            Logger_1.Logger.error("AdminWalletController.getWallet error", {
                error: error instanceof Error ? error.message : String(error),
            });
            const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error, "admin_get_wallet");
            res.status(statusCode).json(response);
        }
    }
};
exports.AdminWalletController = AdminWalletController;
exports.AdminWalletController = AdminWalletController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.GetAdminWalletUseCase)),
    __metadata("design:paramtypes", [Object])
], AdminWalletController);
//# sourceMappingURL=AdminWalletController.js.map