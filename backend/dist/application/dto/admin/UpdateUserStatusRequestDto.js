"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserStatusRequestDto = void 0;
const zod_1 = require("zod");
const AdminAction_1 = require("../../../domain/value-objects/AdminAction");
const updateUserStatusRequestSchema = zod_1.z.object({
    userId: zod_1.z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId format"),
    action: zod_1.z.enum([
        AdminAction_1.AdminUserAction.ACTIVATE,
        AdminAction_1.AdminUserAction.DEACTIVATE,
        AdminAction_1.AdminUserAction.SUSPEND,
        AdminAction_1.AdminUserAction.DELETE,
    ]),
    reason: zod_1.z.string().min(3).max(500).optional(),
});
class UpdateUserStatusRequestDto {
    constructor(requestData) {
        this.data = updateUserStatusRequestSchema.parse(requestData);
    }
    static fromRequest(userId, requestBody) {
        const body = (requestBody ?? {});
        return new UpdateUserStatusRequestDto({
            userId,
            action: body.action,
            reason: body.reason,
        });
    }
    getUserId() {
        return this.data.userId;
    }
    getAction() {
        return this.data.action;
    }
    getReason() {
        return this.data.reason;
    }
}
exports.UpdateUserStatusRequestDto = UpdateUserStatusRequestDto;
//# sourceMappingURL=UpdateUserStatusRequestDto.js.map