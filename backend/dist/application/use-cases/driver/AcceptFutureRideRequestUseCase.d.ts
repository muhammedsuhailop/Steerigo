import { IUseCase } from "../interfaces/IUseCase";
import { AcceptFutureRideRequestDto } from "@application/dto/driver/AcceptFutureRideRequestDto";
import { AcceptFutureRideRequestResponseDto } from "@application/dto/driver/AcceptFutureRideRequestResponseDto";
import { IFutureRideRequestRepository } from "@domain/repositories/IFutureRideRequestRepository";
import { IDriverRepository } from "@domain/repositories/IDriverRepository";
import { IFutureRideExpiryService } from "@application/services/ride-search/IFutureRideExpiryService";
import { IDistributedLockService } from "@application/services/IDistributedLockService";
import { IEventBus } from "@application/services/IEventBus";
import { Result } from "@shared/utils/Result";
import { IRideRepository } from "@domain/repositories/IRideRepository";
import { IIdGenerator } from "@application/services/IIdGenerator";
import { CreateRideChatRoomDto } from "@application/dto/chat/CreateRideChatRoomDto";
import { CreateRideChatRoomResponseDto } from "@application/dto/chat/response/CreateRideChatRoomResponseDto";
import { IOtpService } from "@application/services/IOtpService";
export declare class AcceptFutureRideRequestUseCase implements IUseCase<AcceptFutureRideRequestDto, Promise<Result<AcceptFutureRideRequestResponseDto>>> {
    private readonly driverRepository;
    private readonly futureRideRequestRepository;
    private readonly futureRideExpiryService;
    private readonly lockService;
    private readonly eventBus;
    private readonly rideRepository;
    private readonly uuIdGenerator;
    private readonly createRideChatRoomUseCase;
    private readonly idGenerator;
    private readonly otpService;
    private readonly LOCK_TTL_SECONDS;
    private readonly LOCK_KEY_PREFIX;
    constructor(driverRepository: IDriverRepository, futureRideRequestRepository: IFutureRideRequestRepository, futureRideExpiryService: IFutureRideExpiryService, lockService: IDistributedLockService, eventBus: IEventBus, rideRepository: IRideRepository, uuIdGenerator: IIdGenerator, createRideChatRoomUseCase: IUseCase<CreateRideChatRoomDto, Promise<Result<CreateRideChatRoomResponseDto>>>, idGenerator: IIdGenerator, otpService: IOtpService);
    execute(dto: AcceptFutureRideRequestDto): Promise<Result<AcceptFutureRideRequestResponseDto>>;
}
//# sourceMappingURL=AcceptFutureRideRequestUseCase.d.ts.map