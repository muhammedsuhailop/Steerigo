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
exports.DriverPayoutController = void 0;
const inversify_1 = require("inversify");
const RequestPayoutDto_1 = require("@application/dto/driver/RequestPayoutDto");
const GetDriverPayoutsDto_1 = require("@application/dto/driver/GetDriverPayoutsDto");
const HttpStatusCodes_1 = require("@shared/enums/HttpStatusCodes");
const DITypes_1 = require("@shared/constants/DITypes");
const Logger_1 = require("@shared/utils/Logger");
const ErrorHandlerService_1 = require("@shared/utils/ErrorHandlerService");
let DriverPayoutController = class DriverPayoutController {
    constructor(requestPayoutUseCase, getDriverPayoutsUseCase) {
        this.requestPayoutUseCase = requestPayoutUseCase;
        this.getDriverPayoutsUseCase = getDriverPayoutsUseCase;
    }
    async requestPayout(req, res) {
        try {
            const userId = req.user.userId;
            const { amount, method, destination } = req.body;
            const dto = RequestPayoutDto_1.RequestPayoutDto.create({
                userId,
                amount,
                method,
                destination,
            });
            const result = await this.requestPayoutUseCase.execute(dto);
            if (result.isFailure()) {
                const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(result.getError(), "driver_request_payout");
                res.status(statusCode).json(response);
                return;
            }
            res.status(HttpStatusCodes_1.HttpStatusCodes.CREATED).json(result.getValue());
        }
        catch (error) {
            Logger_1.Logger.error("DriverPayoutController.requestPayout error", { error });
            const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error, "driver_request_payout");
            res.status(statusCode).json(response);
        }
    }
    async getMyPayouts(req, res) {
        try {
            const userId = req.user.userId;
            const dto = GetDriverPayoutsDto_1.GetDriverPayoutsDto.create(userId);
            const result = await this.getDriverPayoutsUseCase.execute(dto);
            if (result.isFailure()) {
                const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(result.getError(), "driver_get_payouts");
                res.status(statusCode).json(response);
                return;
            }
            res.status(HttpStatusCodes_1.HttpStatusCodes.OK).json(result.getValue());
        }
        catch (error) {
            Logger_1.Logger.error("DriverPayoutController.getMyPayouts error", { error });
            const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error, "driver_get_payouts");
            res.status(statusCode).json(response);
        }
    }
};
exports.DriverPayoutController = DriverPayoutController;
exports.DriverPayoutController = DriverPayoutController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.RequestPayoutUseCase)),
    __param(1, (0, inversify_1.inject)(DITypes_1.TYPES.GetDriverPayoutsUseCase)),
    __metadata("design:paramtypes", [Object, Object])
], DriverPayoutController);
//# sourceMappingURL=DriverPayoutController.js.map