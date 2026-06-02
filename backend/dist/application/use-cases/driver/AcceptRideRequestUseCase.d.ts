import { IUseCase } from "../interfaces/IUseCase";
import { AcceptRideRequestDto } from "@application/dto/driver/AcceptRideRequestDto";
import { AcceptRideRequestResponseDto } from "@application/dto/driver/AcceptRideRequestResponseDto";
import { IRideRequestRepository } from "@domain/repositories/IRideRequestRepository";
import { IRideRepository } from "@domain/repositories/IRideRepository";
import { IDriverRepository } from "@domain/repositories/IDriverRepository";
import { IDriverAvailabilityRepository } from "@domain/repositories/IDriverAvailabilityRepository";
import { IRideRequestGroupRepository } from "@domain/repositories/IRideRequestGroupRepository";
import { Result } from "@shared/utils/Result";
import { IDistributedLockService } from "@application/services/IDistributedLockService";
import { IEventBus } from "@application/services/IEventBus";
import { IRideSearchDispatchService } from "@application/services/IRideSearchDispatchService";
import { CreateRideChatRoomResponseDto } from "@application/dto/chat/response/CreateRideChatRoomResponseDto";
import { CreateRideChatRoomDto } from "@application/dto/chat/CreateRideChatRoomDto";
import { IIdGenerator } from "@application/services/IIdGenerator";
import { IOtpService } from "@application/services/IOtpService";
export declare class AcceptRideRequestUseCase implements IUseCase<AcceptRideRequestDto, Promise<Result<AcceptRideRequestResponseDto>>> {
    private driverRepository;
    private rideRequestRepository;
    private rideRepository;
    private driverAvailabilityRepository;
    private rideRequestGroupRepository;
    private rideSearchDispatchService;
    private lockService;
    private eventBus;
    private readonly createRideChatRoomUseCase;
    private readonly uuIdGenerator;
    private readonly idGenerator;
    private readonly otpService;
    private readonly LOCK_TTL_SECONDS;
    private readonly LOCK_KEY_PREFIX;
    constructor(driverRepository: IDriverRepository, rideRequestRepository: IRideRequestRepository, rideRepository: IRideRepository, driverAvailabilityRepository: IDriverAvailabilityRepository, rideRequestGroupRepository: IRideRequestGroupRepository, rideSearchDispatchService: IRideSearchDispatchService, lockService: IDistributedLockService, eventBus: IEventBus, createRideChatRoomUseCase: IUseCase<CreateRideChatRoomDto, Promise<Result<CreateRideChatRoomResponseDto>>>, uuIdGenerator: IIdGenerator, idGenerator: IIdGenerator, otpService: IOtpService);
    execute(dto: AcceptRideRequestDto): Promise<Result<AcceptRideRequestResponseDto>>;
    private markDriverAsBusy;
}
//# sourceMappingURL=AcceptRideRequestUseCase.d.ts.map