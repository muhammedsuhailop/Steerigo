"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendChatMessageSchema = exports.SendChatMessageDto = void 0;
const zod_1 = require("zod");
const sendChatMessageSchema = zod_1.z.object({
    chatRoomId: zod_1.z.string().trim().min(1, "Chat room ID is required"),
    content: zod_1.z.string().trim().min(1, "Message content is required").max(2000),
});
exports.sendChatMessageSchema = sendChatMessageSchema;
class SendChatMessageDto {
    constructor(userId, requestData) {
        this.userId = userId;
        this.data = sendChatMessageSchema.parse(requestData);
    }
    static fromRequest(userId, requestData) {
        return new SendChatMessageDto(userId, requestData);
    }
    getUserId() {
        return this.userId;
    }
    getChatRoomId() {
        return this.data.chatRoomId;
    }
    getContent() {
        return this.data.content;
    }
}
exports.SendChatMessageDto = SendChatMessageDto;
//# sourceMappingURL=SendChatMessageDto.js.map