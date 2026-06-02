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
exports.ChatMessageController = void 0;
const inversify_1 = require("inversify");
const DITypes_1 = require("../../../shared/constants/DITypes");
const Logger_1 = require("../../../shared/utils/Logger");
const ErrorHandlerService_1 = require("../../../shared/utils/ErrorHandlerService");
const HttpStatusCodes_1 = require("../../../shared/enums/HttpStatusCodes");
const GetChatMessagesDto_1 = require("../../../application/dto/chat/GetChatMessagesDto");
const SendChatMessageDto_1 = require("../../../application/dto/chat/SendChatMessageDto");
const EditChatMessageDto_1 = require("../../../application/dto/chat/EditChatMessageDto");
const DeleteChatMessageDto_1 = require("../../../application/dto/chat/DeleteChatMessageDto");
let ChatMessageController = class ChatMessageController {
    constructor(getChatMessagesUseCase, sendChatMessageUseCase, editChatMessageUseCase, deleteChatMessageUseCase) {
        this.getChatMessagesUseCase = getChatMessagesUseCase;
        this.sendChatMessageUseCase = sendChatMessageUseCase;
        this.editChatMessageUseCase = editChatMessageUseCase;
        this.deleteChatMessageUseCase = deleteChatMessageUseCase;
    }
    getUserId(req) {
        const user = req.user;
        return user?.userId ?? null;
    }
    async getMessages(req, res) {
        try {
            const userId = this.getUserId(req);
            const chatRoomId = req.params.chatRoomId;
            const page = req.query.page ? parseInt(req.query.page, 10) : 1;
            const limit = req.query.limit
                ? parseInt(req.query.limit, 10)
                : 20;
            const sortOrder = req.query.sortOrder === "asc" ? "asc" : "desc";
            const dto = GetChatMessagesDto_1.GetChatMessagesDto.fromRequest(userId, {
                chatRoomId,
                page,
                limit,
                sortOrder,
            });
            const result = await this.getChatMessagesUseCase.execute(dto);
            if (result.isFailure()) {
                const error = result.getError();
                const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error, "get_chat_messages");
                res.status(statusCode).json(response);
                return;
            }
            res.status(HttpStatusCodes_1.HttpStatusCodes.OK).json(result.getValue());
        }
        catch (error) {
            Logger_1.Logger.error("Get chat messages controller error", {
                userId: this.getUserId(req),
                chatRoomId: req.params.chatRoomId,
                error: error instanceof Error ? error.message : String(error),
            });
            const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error, "get_chat_messages");
            res.status(statusCode).json(response);
        }
    }
    async sendMessage(req, res) {
        try {
            const userId = this.getUserId(req);
            const chatRoomId = req.params.chatRoomId;
            const content = typeof req.body?.content === "string" ? req.body.content : "";
            const dto = SendChatMessageDto_1.SendChatMessageDto.fromRequest(userId, {
                chatRoomId,
                content,
            });
            const result = await this.sendChatMessageUseCase.execute(dto);
            if (result.isFailure()) {
                const error = result.getError();
                const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error, "send_chat_message");
                res.status(statusCode).json(response);
                return;
            }
            res.status(HttpStatusCodes_1.HttpStatusCodes.OK).json(result.getValue());
        }
        catch (error) {
            Logger_1.Logger.error("Send chat message controller error", {
                userId: this.getUserId(req),
                chatRoomId: req.params.chatRoomId,
                error: error instanceof Error ? error.message : String(error),
            });
            const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error, "send_chat_message");
            res.status(statusCode).json(response);
        }
    }
    async editMessage(req, res) {
        try {
            const userId = this.getUserId(req);
            const messageId = req.params.messageId;
            const content = typeof req.body?.content === "string" ? req.body.content : "";
            const dto = EditChatMessageDto_1.EditChatMessageDto.fromRequest(userId, {
                messageId,
                content,
            });
            const result = await this.editChatMessageUseCase.execute(dto);
            if (result.isFailure()) {
                const error = result.getError();
                const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error, "edit_chat_message");
                res.status(statusCode).json(response);
                return;
            }
            res.status(HttpStatusCodes_1.HttpStatusCodes.OK).json(result.getValue());
        }
        catch (error) {
            const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error, "edit_chat_message");
            res.status(statusCode).json(response);
        }
    }
    async deleteMessage(req, res) {
        try {
            const userId = this.getUserId(req);
            const messageId = req.params.messageId;
            const dto = DeleteChatMessageDto_1.DeleteChatMessageDto.fromRequest(userId, {
                messageId,
            });
            const result = await this.deleteChatMessageUseCase.execute(dto);
            if (result.isFailure()) {
                const error = result.getError();
                const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error, "delete_chat_message");
                res.status(statusCode).json(response);
                return;
            }
            res.status(HttpStatusCodes_1.HttpStatusCodes.OK).json(result.getValue());
        }
        catch (error) {
            const { response, statusCode } = ErrorHandlerService_1.ErrorHandlerService.handleError(error, "delete_chat_message");
            res.status(statusCode).json(response);
        }
    }
};
exports.ChatMessageController = ChatMessageController;
exports.ChatMessageController = ChatMessageController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.GetChatMessagesUseCase)),
    __param(1, (0, inversify_1.inject)(DITypes_1.TYPES.SendChatMessageUseCase)),
    __param(2, (0, inversify_1.inject)(DITypes_1.TYPES.EditChatMessageUseCase)),
    __param(3, (0, inversify_1.inject)(DITypes_1.TYPES.DeleteChatMessageUseCase)),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], ChatMessageController);
//# sourceMappingURL=ChatMessageController.js.map