"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markChatMessagesReadSchema = exports.MarkChatMessagesReadDto = void 0;
const zod_1 = require("zod");
const markChatMessagesReadSchema = zod_1.z.object({
    chatRoomId: zod_1.z.string().trim().min(1, "Chat room ID is required"),
    messageId: zod_1.z.string().trim().min(1, "Message ID is required"),
});
exports.markChatMessagesReadSchema = markChatMessagesReadSchema;
class MarkChatMessagesReadDto {
    constructor(userId, requestData) {
        this.userId = userId;
        this.data = markChatMessagesReadSchema.parse(requestData);
    }
    static fromSocketPayload(userId, requestData) {
        return new MarkChatMessagesReadDto(userId, requestData);
    }
    getUserId() {
        return this.userId;
    }
    getChatRoomId() {
        return this.data.chatRoomId;
    }
    getMessageId() {
        return this.data.messageId;
    }
}
exports.MarkChatMessagesReadDto = MarkChatMessagesReadDto;
//# sourceMappingURL=MarkChatMessagesReadDto.js.map