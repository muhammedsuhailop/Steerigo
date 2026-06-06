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
exports.DriverActionUseCase = void 0;
const inversify_1 = require("inversify");
const Result_1 = require("../../../shared/utils/Result");
const Logger_1 = require("../../../shared/utils/Logger");
const DITypes_1 = require("../../../shared/constants/DITypes");
const DriverStatus_1 = require("../../../domain/value-objects/DriverStatus");
let DriverActionUseCase = class DriverActionUseCase {
    constructor(adminDriverRepository) {
        this.adminDriverRepository = adminDriverRepository;
    }
    async execute(dto) {
        try {
            const validationErrors = dto.validate();
            if (validationErrors.length > 0) {
                return Result_1.Result.failure(new Error(validationErrors.join(", ")));
            }
            const driver = await this.adminDriverRepository.findById(dto.getDriverId());
            if (!driver) {
                return Result_1.Result.failure(new Error("Driver not found"));
            }
            if (!driver.canBeActioned()) {
                return Result_1.Result.failure(new Error("Driver cannot be actioned in current status"));
            }
            Logger_1.Logger.info("Executing driver action", {
                driverId: dto.getDriverId(),
                action: dto.getAction(),
                currentStatus: driver.getStatus(),
            });
            let newStatus;
            let message;
            switch (dto.getAction()) {
                case "block":
                    driver.block(dto.getReason());
                    newStatus = DriverStatus_1.DriverStatus.BLOCKED;
                    message = "Driver blocked successfully";
                    break;
                case "suspend":
                    driver.suspend(dto.getReason());
                    newStatus = DriverStatus_1.DriverStatus.SUSPENDED;
                    message = "Driver suspended successfully";
                    break;
                case "activate":
                    driver.activate();
                    newStatus = DriverStatus_1.DriverStatus.ACTIVE;
                    message = "Driver activated successfully";
                    break;
                default:
                    return Result_1.Result.failure(new Error("Invalid action"));
            }
            const success = await this.adminDriverRepository.updateDriverStatus(dto.getDriverId(), newStatus, dto.getReason());
            if (!success) {
                return Result_1.Result.failure(new Error("Failed to update driver status"));
            }
            Logger_1.Logger.info("Driver action completed successfully", {
                driverId: dto.getDriverId(),
                action: dto.getAction(),
                newStatus,
            });
            return Result_1.Result.success({
                message,
                driverId: dto.getDriverId(),
                newStatus,
            });
        }
        catch (error) {
            Logger_1.Logger.error("Error executing driver action", error);
            return Result_1.Result.failure(error);
        }
    }
};
exports.DriverActionUseCase = DriverActionUseCase;
exports.DriverActionUseCase = DriverActionUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.AdminDriverRepository)),
    __metadata("design:paramtypes", [Object])
], DriverActionUseCase);
//# sourceMappingURL=DriverActionUseCase.js.map