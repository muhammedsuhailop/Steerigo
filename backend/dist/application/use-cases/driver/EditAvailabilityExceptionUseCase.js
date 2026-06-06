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
exports.EditAvailabilityExceptionUseCase = void 0;
const inversify_1 = require("inversify");
const Result_1 = require("../../../shared/utils/Result");
const Logger_1 = require("../../../shared/utils/Logger");
const DITypes_1 = require("../../../shared/constants/DITypes");
const DriverAvailabilityErrors_1 = require("../../../domain/errors/DriverAvailabilityErrors");
const DriverNotFoundError_1 = require("../../../domain/errors/DriverNotFoundError");
let EditAvailabilityExceptionUseCase = class EditAvailabilityExceptionUseCase {
    constructor(driverRepository, availabilityRepository) {
        this.driverRepository = driverRepository;
        this.availabilityRepository = availabilityRepository;
    }
    async execute(dto) {
        try {
            Logger_1.Logger.info("Editing availability exception", {
                userId: dto.getUserId(),
                exceptionId: dto.getExceptionId(),
            });
            const validationErrors = dto.validate();
            if (validationErrors.length > 0) {
                return Result_1.Result.failure(new DriverAvailabilityErrors_1.InvalidAvailabilityScheduleError(validationErrors.join(", ")));
            }
            if (!dto.hasChanges()) {
                return Result_1.Result.failure(new DriverAvailabilityErrors_1.InvalidAvailabilityScheduleError("No changes provided for update"));
            }
            const driver = await this.driverRepository.findByUserId(dto.getUserId());
            if (!driver) {
                return Result_1.Result.failure(new DriverNotFoundError_1.DriverNotFoundError(dto.getUserId()));
            }
            const driverId = driver.getId();
            const availability = await this.availabilityRepository.findActiveByDriverId(driverId);
            if (!availability) {
                return Result_1.Result.failure(new DriverAvailabilityErrors_1.DriverAvailabilityNotFoundError(driverId));
            }
            const currentExceptions = availability.getExceptions();
            const exceptionToUpdate = currentExceptions.find((e) => e.id === dto.getExceptionId());
            if (!exceptionToUpdate) {
                return Result_1.Result.failure(new DriverAvailabilityErrors_1.AvailabilityExceptionNotFoundError(dto.getExceptionId()));
            }
            const updates = {};
            if (dto.getType() !== undefined) {
                updates.type = dto.getType();
            }
            if (dto.getReason() !== undefined) {
                updates.reason = dto.getReason();
            }
            if (dto.getStartTime() !== undefined) {
                updates.startTime = dto.getStartTime();
            }
            if (dto.getEndTime() !== undefined) {
                updates.endTime = dto.getEndTime();
            }
            const updateSucceeded = availability.updateException(dto.getExceptionId(), updates);
            if (!updateSucceeded) {
                return Result_1.Result.failure(new DriverAvailabilityErrors_1.AvailabilityExceptionNotFoundError(dto.getExceptionId()));
            }
            await this.availabilityRepository.save(availability);
            Logger_1.Logger.info("Exception edited successfully", {
                driverId,
                exceptionId: dto.getExceptionId(),
            });
            const updatedException = availability
                .getExceptions()
                .find((e) => e.id === dto.getExceptionId());
            const responseDto = {
                id: updatedException.id,
                type: updatedException.type,
                reason: updatedException.reason,
                startTime: updatedException.startTime.toISOString(),
                endTime: updatedException.endTime.toISOString(),
                updatedAt: new Date().toISOString(),
            };
            return Result_1.Result.success(responseDto);
        }
        catch (error) {
            Logger_1.Logger.error("Error editing availability exception", {
                userId: dto.getUserId(),
                exceptionId: dto.getExceptionId(),
                error: error instanceof Error ? error.message : String(error),
            });
            return Result_1.Result.failure(error);
        }
    }
};
exports.EditAvailabilityExceptionUseCase = EditAvailabilityExceptionUseCase;
exports.EditAvailabilityExceptionUseCase = EditAvailabilityExceptionUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.DriverRepository)),
    __param(1, (0, inversify_1.inject)(DITypes_1.TYPES.DriverAvailabilityRepository)),
    __metadata("design:paramtypes", [Object, Object])
], EditAvailabilityExceptionUseCase);
//# sourceMappingURL=EditAvailabilityExceptionUseCase.js.map