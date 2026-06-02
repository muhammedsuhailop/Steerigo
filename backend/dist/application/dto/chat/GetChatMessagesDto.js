"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChatMessagesSchema = exports.GetChatMessagesDto = void 0;
const zod_1 = require("zod");
const getChatMessagesSchema = zod_1.z.object({
    chatRoomId: zod_1.z.string().trim().min(1, "Chat room ID is required"),
    page: zod_1.z.number().int().min(1).default(1),
    limit: zod_1.z.number().int().min(1).max(100).default(20),
    sortOrder: zod_1.z.enum(["asc", "desc"]).default("desc"),
});
exports.getChatMessagesSchema = getChatMessagesSchema;
class GetChatMessagesDto {
    constructor(userId, requestData) {
        this.userId = userId;
        this.data = getChatMessagesSchema.parse(requestData);
    }
    static fromRequest(userId, requestData) {
        return new GetChatMessagesDto(userId, requestData);
    }
    getUserId() {
        return this.userId;
    }
    getChatRoomId() {
        return this.data.chatRoomId;
    }
    getPage() {
        return this.data.page;
    }
    getLimit() {
        return this.data.limit;
    }
    getSortOrder() {
        return this.data.sortOrder;
    }
}
exports.GetChatMessagesDto = GetChatMessagesDto;
//# sourceMappingURL=GetChatMessagesDto.js.map