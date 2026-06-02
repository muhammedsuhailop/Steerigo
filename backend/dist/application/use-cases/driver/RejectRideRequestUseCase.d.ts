import { IUseCase } from "../interfaces/IUseCase";
import { RejectRideRequestDto } from "@application/dto/driver/RejectRideRequestDto";
import { RejectRideRequestResponseDto } from "@application/dto/driver/RejectRideRequestResponseDto";
import { IRideRequestRepository } from "@domain/repositories/IRideRequestRepository";
import { IDriverRepository } from "@domain/repositories/IDriverRepository";
import { IRideRequestGroupRepository } from "@domain/repositories/IRideRequestGroupRepository";
import { Result } from "@shared/utils/Result";
import { IDistributedLockService } from "@application/services/IDistributedLockService";
import { IRideSearchDispatchService } from "@application/services/IRideSearchDispatchService";
export declare class RejectRideRequestUseCase implements IUseCase<RejectRideRequestDto, Promise<Result<RejectRideRequestResponseDto>>> {
    private driverRepository;
    private rideRequestRepository;
    private rideRequestGroupRepository;
    private rideSearchDispatchService;
    private lockService;
    private readonly LOCK_TTL_SECONDS;
    private readonly LOCK_KEY_PREFIX;
    constructor(driverRepository: IDriverRepository, rideRequestRepository: IRideRequestRepository, rideRequestGroupRepository: IRideRequestGroupRepository, rideSearchDispatchService: IRideSearchDispatchService, lockService: IDistributedLockService);
    execute(dto: RejectRideRequestDto): Promise<Result<RejectRideRequestResponseDto>>;
}
//# sourceMappingURL=RejectRideRequestUseCase.d.ts.map