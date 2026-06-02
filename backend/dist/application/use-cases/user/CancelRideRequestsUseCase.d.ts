import { IUseCase } from "../interfaces/IUseCase";
import { Result } from "@shared/utils/Result";
import { IRideRequestRepository } from "@domain/repositories/IRideRequestRepository";
import { CancelRideRequestDto } from "@application/dto/user/CancelRideRequestDto";
import { CancelRideRequestResponseDto } from "@application/dto/user/CancelRideRequestResponseDto";
import { DomainError } from "@domain/errors/DomainError";
export declare class CancelRideRequestsUseCase implements IUseCase<CancelRideRequestDto, Promise<Result<CancelRideRequestResponseDto, DomainError>>> {
    private readonly rideRequestRepository;
    constructor(rideRequestRepository: IRideRequestRepository);
    execute(dto: CancelRideRequestDto): Promise<Result<CancelRideRequestResponseDto, DomainError>>;
}
//# sourceMappingURL=CancelRideRequestsUseCase.d.ts.map