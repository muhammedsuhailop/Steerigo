"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatFactory = void 0;
const DITypes_1 = require("@shared/constants/DITypes");
const ChatRoomController_1 = require("@interface/controllers/chat/ChatRoomController");
const ChatMessageController_1 = require("@interface/controllers/chat/ChatMessageController");
const CreateRideChatRoomUseCase_1 = require("@application/use-cases/chat/CreateRideChatRoomUseCase");
const GetRideChatRoomUseCase_1 = require("@application/use-cases/chat/GetRideChatRoomUseCase");
const GetChatMessagesUseCase_1 = require("@application/use-cases/chat/GetChatMessagesUseCase");
const SendChatMessageUseCase_1 = require("@application/use-cases/chat/SendChatMessageUseCase");
const EditChatMessageUseCase_1 = require("@application/use-cases/chat/EditChatMessageUseCase");
const DeleteChatMessageUseCase_1 = require("@application/use-cases/chat/DeleteChatMessageUseCase");
const ChatRealtimeService_1 = require("@infrastructure/realtime/services/ChatRealtimeService");
const InMemoryChatEventBus_1 = require("@infrastructure/events/InMemoryChatEventBus");
const MarkChatMessagesReadUseCase_1 = require("@application/use-cases/chat/MarkChatMessagesReadUseCase");
const ChatRoomExpiryQueue_1 = require("@infrastructure/queues/ChatRoomExpiryQueue");
const ChatRoomExpiryService_1 = require("@infrastructure/services/ChatRoomExpiryService");
const ChatRoomExpiryWorker_1 = require("@infrastructure/workers/ChatRoomExpiryWorker");
class ChatFactory {
    static register(container) {
        container
            .bind(DITypes_1.TYPES.ChatRoomExpiryQueue)
            .toConstantValue((0, ChatRoomExpiryQueue_1.createChatRoomExpiryQueue)());
        //Controllers
        container
            .bind(DITypes_1.TYPES.ChatRoomController)
            .to(ChatRoomController_1.ChatRoomController);
        container
            .bind(DITypes_1.TYPES.ChatMessageController)
            .to(ChatMessageController_1.ChatMessageController);
        container
            .bind(DITypes_1.TYPES.ChatRealtimeService)
            .to(ChatRealtimeService_1.ChatRealtimeService)
            .inSingletonScope();
        container
            .bind(DITypes_1.TYPES.ChatEventBus)
            .to(InMemoryChatEventBus_1.InMemoryChatEventBus)
            .inSingletonScope();
        //Use Cases
        container
            .bind(DITypes_1.TYPES.CreateRideChatRoomUseCase)
            .to(CreateRideChatRoomUseCase_1.CreateRideChatRoomUseCase);
        container
            .bind(DITypes_1.TYPES.GetRideChatRoomUseCase)
            .to(GetRideChatRoomUseCase_1.GetRideChatRoomUseCase);
        container
            .bind(DITypes_1.TYPES.GetChatMessagesUseCase)
            .to(GetChatMessagesUseCase_1.GetChatMessagesUseCase);
        container
            .bind(DITypes_1.TYPES.SendChatMessageUseCase)
            .to(SendChatMessageUseCase_1.SendChatMessageUseCase);
        container
            .bind(DITypes_1.TYPES.EditChatMessageUseCase)
            .to(EditChatMessageUseCase_1.EditChatMessageUseCase);
        container
            .bind(DITypes_1.TYPES.DeleteChatMessageUseCase)
            .to(DeleteChatMessageUseCase_1.DeleteChatMessageUseCase);
        container
            .bind(DITypes_1.TYPES.MarkChatMessagesReadUseCase)
            .to(MarkChatMessagesReadUseCase_1.MarkChatMessagesReadUseCase);
        // Service
        container
            .bind(DITypes_1.TYPES.ChatRoomExpiryService)
            .to(ChatRoomExpiryService_1.ChatRoomExpiryService)
            .inSingletonScope();
        // Worker
        container
            .bind(DITypes_1.TYPES.ChatRoomExpiryWorker)
            .to(ChatRoomExpiryWorker_1.ChatRoomExpiryWorker)
            .inSingletonScope();
    }
}
exports.ChatFactory = ChatFactory;
//# sourceMappingURL=ChatFactory.js.map