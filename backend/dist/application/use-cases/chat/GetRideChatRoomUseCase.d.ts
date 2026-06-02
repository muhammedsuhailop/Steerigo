import { IUseCase } from "../interfaces/IUseCase";
import { Result } from "@shared/utils/Result";
import { IRideRepository } from "@domain/repositories/IRideRepository";
import { IChatRoomRepository } from "@domain/repositories/IChatRoomRepository";
import { GetRideChatRoomDto } from "@application/dto/chat/GetRideChatRoomDto";
import { GetRideChatRoomResponseDto } from "@application/dto/chat/response/GetRideChatRoomResponseDto";
import { IDriverRepository } from "@domain/repositories/IDriverRepository";
export declare class GetRideChatRoomUseCase implements IUseCase<GetRideChatRoomDto, Promise<Result<GetRideChatRoomResponseDto>>> {
    private readonly driverRepository;
    private readonly rideRepository;
    private readonly chatRoomRepository;
    constructor(driverRepository: IDriverRepository, rideRepository: IRideRepository, chatRoomRepository: IChatRoomRepository);
    execute(dto: GetRideChatRoomDto): Promise<Result<GetRideChatRoomResponseDto>>;
}
//# sourceMappingURL=GetRideChatRoomUseCase.d.ts.map