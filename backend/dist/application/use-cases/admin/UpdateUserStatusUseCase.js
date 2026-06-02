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
exports.UpdateUserStatusUseCase = void 0;
const inversify_1 = require("inversify");
const Result_1 = require("@shared/utils/Result");
const Logger_1 = require("@shared/utils/Logger");
const DITypes_1 = require("@shared/constants/DITypes");
const AdminErrors_1 = require("@domain/errors/AdminErrors");
const AdminAction_1 = require("@domain/value-objects/AdminAction");
const UpdateUserStatusResponseDto_1 = require("@application/dto/admin/UpdateUserStatusResponseDto");
let UpdateUserStatusUseCase = class UpdateUserStatusUseCase {
    constructor(adminUserRepository) {
        this.adminUserRepository = adminUserRepository;
    }
    async execute(dto) {
        try {
            Logger_1.Logger.info("Executing UpdateUserStatusUseCase", {
                userId: dto.getUserId(),
                action: dto.getAction(),
            });
            // Check if user exists
            const user = await this.adminUserRepository.findById(dto.getUserId());
            if (!user) {
                return Result_1.Result.failure(new AdminErrors_1.AdminUserNotFoundError(dto.getUserId()));
            }
            // Validate action based on current user state
            const validationResult = this.validateAction(user, dto.getAction());
            if (validationResult.isFailure()) {
                return validationResult;
            }
            // Determine new status based on action
            const newStatus = this.mapActionToStatus(dto.getAction());
            // Update user status
            const updated = await this.adminUserRepository.updateUserStatus(dto.getUserId(), newStatus, dto.getReason());
            if (!updated) {
                return Result_1.Result.failure(new Error("Failed to update user status"));
            }
            Logger_1.Logger.info("User status updated successfully", {
                userId: dto.getUserId(),
                oldStatus: user.getStatus(),
                newStatus,
                action: dto.getAction(),
            });
            const response = new UpdateUserStatusResponseDto_1.UpdateUserStatusResponseDto(`User ${dto.getAction()}d successfully`, dto.getUserId(), newStatus);
            return Result_1.Result.success(response);
        }
        catch (error) {
            Logger_1.Logger.error("Error updating user status", error);
            return Result_1.Result.failure(error);
        }
    }
    validateAction(user, action) {
        const currentStatus = user.getStatus();
        switch (action) {
            case AdminAction_1.AdminUserAction.ACTIVATE:
                if (currentStatus === "Active") {
                    return Result_1.Result.failure(new AdminErrors_1.AdminUnauthorizedActionError(action, "User is already active"));
                }
                break;
            case AdminAction_1.AdminUserAction.DEACTIVATE:
                if (currentStatus === "Inactive") {
                    return Result_1.Result.failure(new AdminErrors_1.AdminUnauthorizedActionError(action, "User is already inactive"));
                }
                break;
            case AdminAction_1.AdminUserAction.SUSPEND:
                if (currentStatus === "Suspended") {
                    return Result_1.Result.failure(new AdminErrors_1.AdminUnauthorizedActionError(action, "User is already suspended"));
                }
                break;
            case AdminAction_1.AdminUserAction.DELETE:
                if (currentStatus === "Deleted") {
                    return Result_1.Result.failure(new AdminErrors_1.AdminUnauthorizedActionError(action, "User is already deleted"));
                }
                break;
        }
        return Result_1.Result.success(undefined);
    }
    mapActionToStatus(action) {
        switch (action) {
            case AdminAction_1.AdminUserAction.ACTIVATE:
                return "Active";
            case AdminAction_1.AdminUserAction.DEACTIVATE:
                return "Inactive";
            case AdminAction_1.AdminUserAction.SUSPEND:
                return "Suspended";
            case AdminAction_1.AdminUserAction.DELETE:
                return "Deleted";
            default:
                throw new Error(`Unmapped action: ${action}`);
        }
    }
};
exports.UpdateUserStatusUseCase = UpdateUserStatusUseCase;
exports.UpdateUserStatusUseCase = UpdateUserStatusUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.AdminUserRepository)),
    __metadata("design:paramtypes", [Object])
], UpdateUserStatusUseCase);
//# sourceMappingURL=UpdateUserStatusUseCase.js.map