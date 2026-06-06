import { inject, injectable } from "inversify";
import { IUseCase } from "../interfaces/IUseCase";
import { Result } from "@shared/utils/Result";
import { TYPES } from "@shared/constants/DITypes";
import { Logger } from "@shared/utils/Logger";
import { IRideRepository } from "@domain/repositories/IRideRepository";
import { IChatRoomRepository } from "@domain/repositories/IChatRoomRepository";
import { GetRideChatRoomDto } from "@application/dto/chat/GetRideChatRoomDto";
import { GetRideChatRoomResponseDto } from "@application/dto/chat/response/GetRideChatRoomResponseDto";
import { ChatErrors } from "@domain/errors/ChatErrors";
import { IDriverRepository } from "@domain/repositories/IDriverRepository";

@injectable()
export class GetRideChatRoomUseCase
  implements
    IUseCase<GetRideChatRoomDto, Promise<Result<GetRideChatRoomResponseDto>>>
{
  constructor(
    @inject(TYPES.DriverRepository)
    private readonly driverRepository: IDriverRepository,
    @inject(TYPES.RideRepository)
    private readonly rideRepository: IRideRepository,
    @inject(TYPES.ChatRoomRepository)
    private readonly chatRoomRepository: IChatRoomRepository,
  ) {}

  async execute(
    dto: GetRideChatRoomDto,
  ): Promise<Result<GetRideChatRoomResponseDto>> {
    try {
      const userId = dto.getUserId();
      const rideId = dto.getRideId();

      Logger.info("Fetching ride chat room", { userId, rideId });

      const ride = await this.rideRepository.findByRideId(rideId);
      if (!ride) {
        return Result.failure(ChatErrors.rideNotFound(rideId));
      }

      let isRideParticipant = String(ride.getRiderId()) === String(userId);

      if (!isRideParticipant) {
        const driverProfile = await this.driverRepository.findByUserId(userId);

        if (driverProfile) {
          const resolvedDriverId = driverProfile.getId();
          isRideParticipant =
            String(ride.getDriverId()) === String(resolvedDriverId);

          Logger.debug("Ride participant verified via Driver Profile", {
            userId,
            resolvedDriverId,
            rideId,
          });
        }
      }

      if (!isRideParticipant) {
        return Result.failure(
          ChatErrors.unauthorizedRideChatAccess(rideId, userId),
        );
      }

      const chatRoom = await this.chatRoomRepository.findByRideId(rideId);
      if (!chatRoom) {
        return Result.failure(ChatErrors.chatRoomNotFoundByRide(rideId));
      }

      const response: GetRideChatRoomResponseDto = {
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
      };

      return Result.success(response);
    } catch (error) {
      Logger.error("GetRideChatRoomUseCase failed", {
        userId: dto.getUserId(),
        rideId: dto.getRideId(),
        error: error instanceof Error ? error.message : String(error),
      });

      return Result.failure(error as Error);
    }
  }
}
