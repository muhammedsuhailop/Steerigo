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
exports.CreateRideChatRoomUseCase = void 0;
const inversify_1 = require("inversify");
const Result_1 = require("@shared/utils/Result");
const DITypes_1 = require("@shared/constants/DITypes");
const Logger_1 = require("@shared/utils/Logger");
const ChatErrors_1 = require("@domain/errors/ChatErrors");
const ChatRoom_1 = require("@domain/entities/ChatRoom");
const UserChat_1 = require("@domain/entities/UserChat");
const ChatRoomType_1 = require("@domain/value-objects/ChatRoomType");
const AuthConstants_1 = require("@shared/constants/AuthConstants");
const RideStatus_1 = require("@domain/value-objects/RideStatus");
const ChatMessages_1 = require("@shared/constants/ChatMessages");
let CreateRideChatRoomUseCase = class CreateRideChatRoomUseCase {
    constructor(rideRepository, chatRoomRepository, userChatRepository, driverRepository, idGenerator) {
        this.rideRepository = rideRepository;
        this.chatRoomRepository = chatRoomRepository;
        this.userChatRepository = userChatRepository;
        this.driverRepository = driverRepository;
        this.idGenerator = idGenerator;
    }
    async execute(dto) {
        try {
            const userId = dto.getUserId();
            const rideId = dto.getRideId();
            Logger_1.Logger.info("Creating ride chat room", { userId, rideId });
            const ride = await this.rideRepository.findByRideId(rideId);
            if (!ride) {
                return Result_1.Result.failure(ChatErrors_1.ChatErrors.rideNotFound(rideId));
            }
            const riderIdFromRide = ride.getRiderId();
            const driverIdFromRide = ride.getDriverId();
            const driverProfile = await this.driverRepository.findByUserId(userId);
            const resolvedDriverId = driverProfile ? driverProfile.getId() : null;
            const isRideParticipant = String(riderIdFromRide) === String(userId) ||
                (resolvedDriverId !== null &&
                    String(driverIdFromRide) === String(resolvedDriverId));
            if (!isRideParticipant) {
                return Result_1.Result.failure(ChatErrors_1.ChatErrors.unauthorizedRideChatAccess(rideId, userId));
            }
            const eligibleStatuses = [
                RideStatus_1.RideStatus.ACCEPTED,
                RideStatus_1.RideStatus.ARRIVED,
                RideStatus_1.RideStatus.STARTED,
                RideStatus_1.RideStatus.COMPLETED,
            ];
            if (!eligibleStatuses.includes(ride.getStatus())) {
                return Result_1.Result.failure(ChatErrors_1.ChatErrors.rideNotEligibleForChat(rideId, ride.getStatus()));
            }
            const existingRoom = await this.chatRoomRepository.findByRideId(rideId);
            if (existingRoom) {
                const response = {
                    success: true,
                    message: ChatMessages_1.CHAT_MESSAGES.CHAT_ROOM.EXISTS,
                    data: {
                        chatRoomId: existingRoom.getId(),
                        rideId,
                        type: existingRoom.getType(),
                        status: existingRoom.getStatus(),
                        participants: existingRoom.getParticipants().map((participant) => ({
                            userId: participant.userId,
                            role: participant.role,
                        })),
                        createdAt: existingRoom.getCreatedAt().toISOString(),
                        updatedAt: existingRoom.getUpdatedAt().toISOString(),
                    },
                };
                return Result_1.Result.success(response);
            }
            const chatRoom = ChatRoom_1.ChatRoom.create({
                id: this.idGenerator.generate(),
                type: ChatRoomType_1.ChatRoomType.RIDE,
                rideId,
                participants: [
                    {
                        userId: ride.getDriverId(),
                        role: AuthConstants_1.UserRole.DRIVER,
                    },
                    {
                        userId: ride.getRiderId(),
                        role: AuthConstants_1.UserRole.RIDER,
                    },
                ],
            });
            const savedChatRoom = await this.chatRoomRepository.save(chatRoom);
            const driverUserChat = UserChat_1.UserChat.create({
                id: this.idGenerator.generate(),
                userId: ride.getDriverId(),
                chatRoomId: savedChatRoom.getId(),
            });
            const riderUserChat = UserChat_1.UserChat.create({
                id: this.idGenerator.generate(),
                userId: ride.getRiderId(),
                chatRoomId: savedChatRoom.getId(),
            });
            await this.userChatRepository.save(driverUserChat);
            await this.userChatRepository.save(riderUserChat);
            const response = {
                success: true,
                message: ChatMessages_1.CHAT_MESSAGES.CHAT_ROOM.CREATED,
                data: {
                    chatRoomId: savedChatRoom.getId(),
                    rideId,
                    type: savedChatRoom.getType(),
                    status: savedChatRoom.getStatus(),
                    participants: savedChatRoom.getParticipants().map((participant) => ({
                        userId: participant.userId,
                        role: participant.role,
                    })),
                    createdAt: savedChatRoom.getCreatedAt().toISOString(),
                    updatedAt: savedChatRoom.getUpdatedAt().toISOString(),
                },
            };
            return Result_1.Result.success(response);
        }
        catch (error) {
            Logger_1.Logger.error("CreateRideChatRoomUseCase failed", {
                userId: dto.getUserId(),
                rideId: dto.getRideId(),
                error: error instanceof Error ? error.message : String(error),
            });
            return Result_1.Result.failure(error);
        }
    }
};
exports.CreateRideChatRoomUseCase = CreateRideChatRoomUseCase;
exports.CreateRideChatRoomUseCase = CreateRideChatRoomUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.RideRepository)),
    __param(1, (0, inversify_1.inject)(DITypes_1.TYPES.ChatRoomRepository)),
    __param(2, (0, inversify_1.inject)(DITypes_1.TYPES.UserChatRepository)),
    __param(3, (0, inversify_1.inject)(DITypes_1.TYPES.DriverRepository)),
    __param(4, (0, inversify_1.inject)(DITypes_1.TYPES.IDGenerator)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], CreateRideChatRoomUseCase);
//# sourceMappingURL=CreateRideChatRoomUseCase.js.map