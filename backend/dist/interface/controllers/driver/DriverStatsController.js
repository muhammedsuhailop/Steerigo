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
exports.DriverStatsController = void 0;
const inversify_1 = require("inversify");
const GetDriverStatsRequestDto_1 = require("../../../application/dto/driver/GetDriverStatsRequestDto");
const HttpStatusCodes_1 = require("../../../shared/enums/HttpStatusCodes");
const DITypes_1 = require("../../../shared/constants/DITypes");
const Logger_1 = require("../../../shared/utils/Logger");
const ErrorHandlerService_1 = require("../../../shared/utils/ErrorHandlerService");
const DriverMessages_1 = require("../../../shared/constants/DriverMessages");
let DriverStatsController = class DriverStatsController {
    constructor(getDriverStatsUseCase) {
        this.getDriverStatsUseCase = getDriverStatsUseCase;
    }
    async getMyStats(req, res) {
        try {
            const userId = req.user.userId;
            const dto = GetDriverStatsRequestDto_1.GetDriverStatsRequestDto.fromRequest(userId, req.query);
            const result = await this.getDriverStatsUseCase.execute(dto);
            if (result.isFailure()) {
                const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(result.getError(), "driver_get_stats");
                res.status(statusCode).json(response);
                return;
            }
            res.status(HttpStatusCodes_1.HttpStatusCodes.OK).json({
                success: true,
                message: DriverMessages_1.DRIVER_MESSAGES.STATS_FETCHED,
                data: result.getValue(),
            });
        }
        catch (error) {
            Logger_1.Logger.error("DriverStatsController.getMyStats error", { error });
            const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error, "driver_get_stats");
            res.status(statusCode).json(response);
        }
    }
};
exports.DriverStatsController = DriverStatsController;
exports.DriverStatsController = DriverStatsController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.GetDriverStatsUseCase)),
    __metadata("design:paramtypes", [Object])
], DriverStatsController);
//# sourceMappingURL=DriverStatsController.js.map