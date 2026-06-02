"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerChatRoomHandlers = registerChatRoomHandlers;
const SocketEvents_1 = require("../constants/SocketEvents");
const Logger_1 = require("@shared/utils/Logger");
const MarkChatMessagesReadDto_1 = require("@application/dto/chat/MarkChatMessagesReadDto");
const DIContainer_1 = require("@infrastructure/container/DIContainer");
const DITypes_1 = require("@shared/constants/DITypes");
function registerChatRoomHandlers(socket) {
    const { userId, role } = socket.data;
    const markChatMessagesReadUseCase = DIContainer_1.container.get(DITypes_1.TYPES.MarkChatMessagesReadUseCase);
    socket.on(SocketEvents_1.SOCKET_EVENTS.CHAT_JOIN, (chatRoomId) => {
        if (!chatRoomId) {
            return;
        }
        socket.join(`chat:${chatRoomId}`);
        Logger_1.Logger.info("Socket joined chat room", {
            socketId: socket.id,
            userId,
            role,
            chatRoomId,
        });
    });
    socket.on(SocketEvents_1.SOCKET_EVENTS.CHAT_LEAVE, (chatRoomId) => {
        if (!chatRoomId) {
            return;
        }
        socket.leave(`chat:${chatRoomId}`);
        Logger_1.Logger.info("Socket left chat room", {
            socketId: socket.id,
            userId,
            role,
            chatRoomId,
        });
    });
    socket.on(SocketEvents_1.SOCKET_EVENTS.CHAT_MESSAGE_VIEWED, async (payload, ack) => {
        try {
            const dto = MarkChatMessagesReadDto_1.MarkChatMessagesReadDto.fromSocketPayload(userId, payload);
            const result = await markChatMessagesReadUseCase.execute(dto);
            if (result.isSuccessful()) {
                if (typeof ack === "function") {
                    ack(result.getValue());
                }
                return;
            }
            if (typeof ack === "function") {
                const error = result.getError();
                ack({
                    success: false,
                    message: error.message,
                });
            }
        }
        catch (error) {
            Logger_1.Logger.error("Failed to handle chat message viewed event", {
                socketId: socket.id,
                userId,
                role,
                payload,
                error: error instanceof Error ? error.message : String(error),
            });
            if (typeof ack === "function") {
                ack({
                    success: false,
                    message: "Failed to mark chat message as read",
                });
            }
        }
    });
}
//# sourceMappingURL=ChatRoomHandler.js.map