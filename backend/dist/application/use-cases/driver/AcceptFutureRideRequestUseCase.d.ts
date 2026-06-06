import { IUseCase } from "../interfaces/IUseCase";
import { AcceptFutureRideRequestDto } from "../../dto/driver/AcceptFutureRideRequestDto";
import { AcceptFutureRideRequestResponseDto } from "../../dto/driver/AcceptFutureRideRequestResponseDto";
import { IFutureRideRequestRepository } from "../../../domain/repositories/IFutureRideRequestRepository";
import { IDriverRepository } from "../../../domain/repositories/IDriverRepository";
import { IFutureRideExpiryService } from "../../services/ride-search/IFutureRideExpiryService";
import { IDistributedLockService } from "../../services/IDistributedLockService";
import { IEventBus } from "../../services/IEventBus";
import { Result } from "../../../shared/utils/Result";
import { IRideRepository } from "../../../domain/repositories/IRideRepository";
import { IIdGenerator } from "../../services/IIdGenerator";
import { CreateRideChatRoomDto } from "../../dto/chat/CreateRideChatRoomDto";
import { CreateRideChatRoomResponseDto } from "../../dto/chat/response/CreateRideChatRoomResponseDto";
import { IOtpService } from "../../services/IOtpService";
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