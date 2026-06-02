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
exports.GetRideChatRoomUseCase = void 0;
const inversify_1 = require("inversify");
const Result_1 = require("@shared/utils/Result");
const DITypes_1 = require("@shared/constants/DITypes");
const Logger_1 = require("@shared/utils/Logger");
const ChatErrors_1 = require("@domain/errors/ChatErrors");
const ChatMessages_1 = require("@shared/constants/ChatMessages");
let GetRideChatRoomUseCase = class GetRideChatRoomUseCase {
    constructor(driverRepository, rideRepository, chatRoomRepository) {
        this.driverRepository = driverRepository;
        this.rideRepository = rideRepository;
        this.chatRoomRepository = chatRoomRepository;
    }
    async execute(dto) {
        try {
            const userId = dto.getUserId();
            const rideId = dto.getRideId();
            Logger_1.Logger.info("Fetching ride chat room", { userId, rideId });
            const ride = await this.rideRepository.findByRideId(rideId);
            if (!ride) {
                return Result_1.Result.failure(ChatErrors_1.ChatErrors.rideNotFound(rideId));
            }
            let isRideParticipant = String(ride.getRiderId()) === String(userId);
            if (!isRideParticipant) {
                const driverProfile = await this.driverRepository.findByUserId(userId);
                if (driverProfile) {
                    const resolvedDriverId = driverProfile.getId();
                    isRideParticipant =
                        String(ride.getDriverId()) === String(resolvedDriverId);
                    Logger_1.Logger.debug("Ride participant verified via Driver Profile", {
                        userId,
                        resolvedDriverId,
                        rideId,
                    });
                }
            }
            if (!isRideParticipant) {
                return Result_1.Result.failure(ChatErrors_1.ChatErrors.unauthorizedRideChatAccess(rideId, userId));
            }
            const chatRoom = await this.chatRoomRepository.findByRideId(rideId);
            if (!chatRoom) {
                return Result_1.Result.failure(ChatErrors_1.ChatErrors.chatRoomNotFoundByRide(rideId));
            }
            const response = {
                success: true,
                message: ChatMessages_1.CHAT_MESSAGES.CHAT_ROOM.RIDE_ROOM_FETCHED,
                data: {
                    chatRoomId: chatRoom.getId(),
                    rideId,
                    type: chatRoom.getType(),
                    status: chatRoom.getStatus(),
                    participants: chatRoom.getParticipants().map((participant) => ({
                        userId: participant.userId,
                        role: participant.role,
                    })),
                    lastMessageId: chatRoom.getLastMessageId(),
                    lastMessageAt: chatRoom.getLastMessageAt()?.toISOString(),
                    createdAt: chatRoom.getCreatedAt().toISOString(),
                    updatedAt: chatRoom.getUpdatedAt().toISOString(),
                },
            };
            return Result_1.Result.success(response);
        }
        catch (error) {
            Logger_1.Logger.error("GetRideChatRoomUseCase failed", {
                userId: dto.getUserId(),
                rideId: dto.getRideId(),
                error: error instanceof Error ? error.message : String(error),
            });
            return Result_1.Result.failure(error);
        }
    }
};
exports.GetRideChatRoomUseCase = GetRideChatRoomUseCase;
exports.GetRideChatRoomUseCase = GetRideChatRoomUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.DriverRepository)),
    __param(1, (0, inversify_1.inject)(DITypes_1.TYPES.RideRepository)),
    __param(2, (0, inversify_1.inject)(DITypes_1.TYPES.ChatRoomRepository)),
    __metadata("design:paramtypes", [Object, Object, Object])
], GetRideChatRoomUseCase);
//# sourceMappingURL=GetRideChatRoomUseCase.js.map