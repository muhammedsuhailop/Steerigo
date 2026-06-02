"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.editChatMessageSchema = exports.EditChatMessageDto = void 0;
const zod_1 = require("zod");
const editChatMessageSchema = zod_1.z.object({
    messageId: zod_1.z.string().trim().min(1, "Message ID is required"),
    content: zod_1.z.string().trim().min(1, "Message content is required"),
});
exports.editChatMessageSchema = editChatMessageSchema;
class EditChatMessageDto {
    constructor(userId, requestData) {
        this.userId = userId;
        this.data = editChatMessageSchema.parse(requestData);
    }
    static fromRequest(userId, requestData) {
        return new EditChatMessageDto(userId, requestData);
    }
    getUserId() {
        return this.userId;
    }
    getMessageId() {
        return this.data.messageId;
    }
    getContent() {
        return this.data.content;
    }
}
exports.EditChatMessageDto = EditChatMessageDto;
//# sourceMappingURL=EditChatMessageDto.js.map