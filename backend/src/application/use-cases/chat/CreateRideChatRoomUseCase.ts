import { inject, injectable } from "inversify";
import { IUseCase } from "../interfaces/IUseCase";
import { Result } from "@shared/utils/Result";
import { TYPES } from "@shared/constants/DITypes";
import { Logger } from "@shared/utils/Logger";
import { IRideRepository } from "@domain/repositories/IRideRepository";
import { IChatRoomRepository } from "@domain/repositories/IChatRoomRepository";
import { IUserChatRepository } from "@domain/repositories/IUserChatRepository";
import { CreateRideChatRoomDto } from "@application/dto/chat/CreateRideChatRoomDto";
import { ChatErrors } from "@domain/errors/ChatErrors";
import { ChatRoom } from "@domain/entities/ChatRoom";
import { UserChat } from "@domain/entities/UserChat";
import { ChatRoomType } from "@domain/value-objects/ChatRoomType";
import { UserRole } from "@shared/constants/AuthConstants";
import { RideStatus } from "@domain/value-objects/RideStatus";
import { CreateRideChatRoomResponseDto } from "@application/dto/chat/response/CreateRideChatRoomResponseDto";
import { IIdGenerator } from "@application/services/IIdGenerator";
import { IDriverRepository } from "@domain/repositories/IDriverRepository";

@injectable()
export class CreateRideChatRoomUseCase
  implements
    IUseCase<
      CreateRideChatRoomDto,
      Promise<Result<CreateRideChatRoomResponseDto>>
    >
{
  constructor(
    @inject(TYPES.RideRepository)
    private readonly rideRepository: IRideRepository,
    @inject(TYPES.ChatRoomRepository)
    private readonly chatRoomRepository: IChatRoomRepository,
    @inject(TYPES.UserChatRepository)
    private readonly userChatRepository: IUserChatRepository,
    @inject(TYPES.DriverRepository)
    private readonly driverRepository: IDriverRepository,
    @inject(TYPES.IDGenerator)
    private readonly idGenerator: IIdGenerator,
  ) {}

  async execute(
    dto: CreateRideChatRoomDto,
  ): Promise<Result<CreateRideChatRoomResponseDto>> {
    try {
      const userId = dto.getUserId();
      const rideId = dto.getRideId();

      Logger.info("Creating ride chat room", { userId, rideId });

      const ride = await this.rideRepository.findByRideId(rideId);
      if (!ride) {
        return Result.failure(ChatErrors.rideNotFound(rideId));
      }

      const riderIdFromRide = ride.getRiderId();
      const driverIdFromRide = ride.getDriverId();

      const driverProfile = await this.driverRepository.findByUserId(userId);
      const resolvedDriverId = driverProfile ? driverProfile.getId() : null;

      const isRideParticipant =
        String(riderIdFromRide) === String(userId) ||
        (resolvedDriverId !== null &&
          String(driverIdFromRide) === String(resolvedDriverId));

      if (!isRideParticipant) {
        return Result.failure(
          ChatErrors.unauthorizedRideChatAccess(rideId, userId),
        );
      }

      const eligibleStatuses: RideStatus[] = [
        RideStatus.ACCEPTED,
        RideStatus.ARRIVED,
        RideStatus.STARTED,
        RideStatus.COMPLETED,
      ];

      if (!eligibleStatuses.includes(ride.getStatus())) {
        return Result.failure(
          ChatErrors.rideNotEligibleForChat(rideId, ride.getStatus()),
        );
      }

      const existingRoom = await this.chatRoomRepository.findByRideId(rideId);
      if (existingRoom) {
        const response: CreateRideChatRoomResponseDto = {
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
        };

        return Result.success(response);
      }

      const chatRoom = ChatRoom.create({
        id: this.idGenerator.generate(),
        type: ChatRoomType.RIDE,
        rideId,
        participants: [
          {
            userId: ride.getDriverId(),
            role: UserRole.DRIVER,
          },
          {
            userId: ride.getRiderId(),
            role: UserRole.RIDER,
          },
        ],
      });

      const savedChatRoom = await this.chatRoomRepository.save(chatRoom);

      const driverUserChat = UserChat.create({
        id: this.idGenerator.generate(),
        userId: ride.getDriverId(),
        chatRoomId: savedChatRoom.getId(),
      });

      const riderUserChat = UserChat.create({
        id: this.idGenerator.generate(),
        userId: ride.getRiderId(),
        chatRoomId: savedChatRoom.getId(),
      });

      await this.userChatRepository.save(driverUserChat);
      await this.userChatRepository.save(riderUserChat);

      const response: CreateRideChatRoomResponseDto = {
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
      };

      return Result.success(response);
    } catch (error) {
      Logger.error("CreateRideChatRoomUseCase failed", {
        userId: dto.getUserId(),
        rideId: dto.getRideId(),
        error: error instanceof Error ? error.message : String(error),
      });

      return Result.failure(error as Error);
    }
  }
}
