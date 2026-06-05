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
exports.GetChatMessagesUseCase = void 0;
const inversify_1 = require("inversify");
const Result_1 = require("../../../shared/utils/Result");
const DITypes_1 = require("../../../shared/constants/DITypes");
const Logger_1 = require("../../../shared/utils/Logger");
const ChatErrors_1 = require("../../../domain/errors/ChatErrors");
let GetChatMessagesUseCase = class GetChatMessagesUseCase {
    constructor(chatRoomRepository, messageRepository, messageStatusRepository, userChatRepository, driverRepository) {
        this.chatRoomRepository = chatRoomRepository;
        this.messageRepository = messageRepository;
        this.messageStatusRepository = messageStatusRepository;
        this.userChatRepository = userChatRepository;
        this.driverRepository = driverRepository;
    }
    async execute(dto) {
        try {
            const userId = dto.getUserId();
            const chatRoomId = dto.getChatRoomId();
            const chatRoom = await this.chatRoomRepository.findById(chatRoomId);
            if (!chatRoom) {
                return Result_1.Result.failure(ChatErrors_1.ChatErrors.chatRoomNotFound(chatRoomId));
            }
            let activeParticipantId = userId;
            let isAuthorized = chatRoom.isParticipant(userId);
            if (!isAuthorized) {
                const driverProfile = await this.driverRepository.findByUserId(userId);
                if (driverProfile) {
                    activeParticipantId = driverProfile.getId();
                    isAuthorized = chatRoom.isParticipant(activeParticipantId);
                }
            }
            if (!isAuthorized) {
                return Result_1.Result.failure(ChatErrors_1.ChatErrors.unauthorizedChatAccess(chatRoomId, userId));
            }
            const paginatedMessages = await this.messageRepository.findPaginatedByChatRoomId(chatRoomId, {
                page: dto.getPage(),
                limit: dto.getLimit(),
                sortOrder: dto.getSortOrder(),
            });
            const participants = chatRoom.getParticipants();
            const otherParticipant = participants.find((p) => p.userId !== activeParticipantId);
            const otherParticipantId = otherParticipant?.userId;
            const messageIds = paginatedMessages.data.map((m) => m.getId());
            const [myStatuses, theirStatuses] = await Promise.all([
                this.messageStatusRepository.findByMessageIdsAndUserId(messageIds, activeParticipantId),
                otherParticipantId
                    ? this.messageStatusRepository.findByMessageIdsAndUserId(messageIds, otherParticipantId)
                    : Promise.resolve([]),
            ]);
            const statusMap = new Map();
            myStatuses.forEach((s) => statusMap.set(`${s.getMessageId()}_${activeParticipantId}`, s.getStatus()));
            if (otherParticipantId) {
                theirStatuses.forEach((s) => statusMap.set(`${s.getMessageId()}_${otherParticipantId}`, s.getStatus()));
            }
            const userChat = await this.userChatRepository.findByUserIdAndChatRoomId(userId, chatRoomId);
            const totalUnreadCount = await this.userChatRepository.getTotalUnreadCountByUserId(userId);
            const response = {
                messages: paginatedMessages.data.map((message) => {
                    const senderId = message.getSenderId();
                    const messageId = message.getId();
                    const relevantUserId = senderId === activeParticipantId
                        ? otherParticipantId
                        : activeParticipantId;
                    const status = relevantUserId
                        ? statusMap.get(`${messageId}_${relevantUserId}`)
                        : undefined;
                    return {
                        id: messageId,
                        chatRoomId: message.getChatRoomId(),
                        senderId: senderId,
                        content: message.getContent(),
                        type: message.getType(),
                        createdAt: message.getCreatedAt().toISOString(),
                        updatedAt: message.getUpdatedAt().toISOString(),
                        isDeleted: message.isDeleted(),
                        messageStatus: status ? { status } : null,
                    };
                }),
                unreadCount: userChat ? userChat.getUnreadCount() : 0,
                totalUnreadCount,
                pagination: {
                    total: paginatedMessages.total,
                    page: paginatedMessages.page,
                    limit: paginatedMessages.limit,
                    totalPages: paginatedMessages.totalPages,
                },
            };
            return Result_1.Result.success(response);
        }
        catch (error) {
            Logger_1.Logger.error("GetChatMessagesUseCase failed", { error });
            return Result_1.Result.failure(error);
        }
    }
};
exports.GetChatMessagesUseCase = GetChatMessagesUseCase;
exports.GetChatMessagesUseCase = GetChatMessagesUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.ChatRoomRepository)),
    __param(1, (0, inversify_1.inject)(DITypes_1.TYPES.MessageRepository)),
    __param(2, (0, inversify_1.inject)(DITypes_1.TYPES.MessageStatusRepository)),
    __param(3, (0, inversify_1.inject)(DITypes_1.TYPES.UserChatRepository)),
    __param(4, (0, inversify_1.inject)(DITypes_1.TYPES.DriverRepository)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], GetChatMessagesUseCase);
//# sourceMappingURL=GetChatMessagesUseCase.js.map