import { IUseCase } from "../interfaces/IUseCase";
import { Result } from "@shared/utils/Result";
import { IRideRepository } from "@domain/repositories/IRideRepository";
import { IChatRoomRepository } from "@domain/repositories/IChatRoomRepository";
import { IUserChatRepository } from "@domain/repositories/IUserChatRepository";
import { CreateRideChatRoomDto } from "@application/dto/chat/CreateRideChatRoomDto";
import { CreateRideChatRoomResponseDto } from "@application/dto/chat/response/CreateRideChatRoomResponseDto";
import { IIdGenerator } from "@application/services/IIdGenerator";
import { IDriverRepository } from "@domain/repositories/IDriverRepository";
export declare class CreateRideChatRoomUseCase implements IUseCase<CreateRideChatRoomDto, Promise<Result<CreateRideChatRoomResponseDto>>> {
    private readonly rideRepository;
    private readonly chatRoomRepository;
    private readonly userChatRepository;
    private readonly driverRepository;
    private readonly idGenerator;
    constructor(rideRepository: IRideRepository, chatRoomRepository: IChatRoomRepository, userChatRepository: IUserChatRepository, driverRepository: IDriverRepository, idGenerator: IIdGenerator);
    execute(dto: CreateRideChatRoomDto): Promise<Result<CreateRideChatRoomResponseDto>>;
}
//# sourceMappingURL=CreateRideChatRoomUseCase.d.ts.map