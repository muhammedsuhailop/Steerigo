"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteChatMessageSchema = exports.DeleteChatMessageDto = void 0;
const zod_1 = require("zod");
const deleteChatMessageSchema = zod_1.z.object({
    messageId: zod_1.z.string().trim().min(1, "Message ID is required"),
});
exports.deleteChatMessageSchema = deleteChatMessageSchema;
class DeleteChatMessageDto {
    constructor(userId, requestData) {
        this.userId = userId;
        this.data = deleteChatMessageSchema.parse(requestData);
    }
    static fromRequest(userId, requestData) {
        return new DeleteChatMessageDto(userId, requestData);
    }
    getUserId() {
        return this.userId;
    }
    getMessageId() {
        return this.data.messageId;
    }
}
exports.DeleteChatMessageDto = DeleteChatMessageDto;
//# sourceMappingURL=DeleteChatMessageDto.js.map