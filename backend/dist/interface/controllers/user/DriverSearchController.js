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
exports.DriverSearchController = void 0;
const inversify_1 = require("inversify");
const FindNearbyDriversRequestDto_1 = require("../../../application/dto/user/FindNearbyDriversRequestDto");
const HttpStatusCodes_1 = require("../../../shared/enums/HttpStatusCodes");
const Logger_1 = require("../../../shared/utils/Logger");
const DITypes_1 = require("../../../shared/constants/DITypes");
const ErrorHandlerService_1 = require("../../../shared/utils/ErrorHandlerService");
const UserMessages_1 = require("../../../shared/constants/UserMessages");
let DriverSearchController = class DriverSearchController {
    constructor(findNearbyDriversUseCase) {
        this.findNearbyDriversUseCase = findNearbyDriversUseCase;
    }
    getUserId(req) {
        const user = req.user;
        return user?.userId ?? null;
    }
    async findNearbyDrivers(req, res) {
        try {
            const userId = this.getUserId(req);
            if (!userId) {
                res.status(HttpStatusCodes_1.HttpStatusCodes.UNAUTHORIZED).json({
                    success: false,
                    message: UserMessages_1.USER_MESSAGES.DRIVER_SEARCH.UNAUTHORIZED,
                });
                return;
            }
            const { latitude, longitude, searchDate, timeRequired, radiusKm, gearType, bodyType, } = req.body;
            Logger_1.Logger.info("Find nearby drivers request received", {
                userId,
                latitude,
                longitude,
                searchDate,
                radiusKm,
                timeRequired,
                gearType,
                bodyType,
            });
            const dto = FindNearbyDriversRequestDto_1.FindNearbyDriversRequestDto.fromRequest(req.body);
            const result = await this.findNearbyDriversUseCase.execute(dto);
            if (result.isSuccessful()) {
                const responseData = result.getValue();
                const count = responseData.drivers.length;
                res.status(HttpStatusCodes_1.HttpStatusCodes.OK).json({
                    success: true,
                    message: count > 0
                        ? UserMessages_1.USER_MESSAGES.DRIVER_SEARCH.FOUND_DRIVERS(count)
                        : UserMessages_1.USER_MESSAGES.DRIVER_SEARCH.NO_DRIVERS_FOUND,
                    data: {
                        drivers: responseData.drivers,
                        estimatedFare: responseData.estimatedFare?.toJSON(),
                        summary: {
                            totalFound: responseData.totalFound,
                            searchedAt: responseData.searchedAt,
                            searchCriteria: responseData.searchCriteria,
                        },
                    },
                });
                Logger_1.Logger.info("Find nearby drivers request successful", {
                    userId,
                    driversFound: count,
                });
            }
            else {
                const error = result.getError();
                const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error);
                res.status(statusCode).json(response);
                Logger_1.Logger.warn("Find nearby drivers request failed", {
                    userId,
                    error: error?.message,
                });
            }
        }
        catch (error) {
            Logger_1.Logger.error("Find nearby drivers controller error", {
                error,
                userId: this.getUserId(req),
            });
            const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error);
            res.status(statusCode).json(response);
        }
    }
};
exports.DriverSearchController = DriverSearchController;
exports.DriverSearchController = DriverSearchController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.FindNearbyDriversUseCase)),
    __metadata("design:paramtypes", [Object])
], DriverSearchController);
//# sourceMappingURL=DriverSearchController.js.map