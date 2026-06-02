import { IRideRequestRepository } from "@domain/repositories/IRideRequestRepository";
import { IDriverRepository } from "@domain/repositories/IDriverRepository";
import { IUserRepository } from "@domain/repositories/IUserRepository";
import { SendRideRequestDto } from "@application/dto/user/SendRideRequestDto";
import { SendRideRequestResponseDto } from "@application/dto/user/SendRideRequestResponseDto";
import { Result } from "@shared/utils/Result";
import { IUseCase } from "../interfaces/IUseCase";
export declare class SendRideRequestUseCase implements IUseCase<SendRideRequestDto, Promise<Result<SendRideRequestResponseDto>>> {
    private readonly rideRequestRepository;
    private readonly driverRepository;
    private readonly userRepository;
    constructor(rideRequestRepository: IRideRequestRepository, driverRepository: IDriverRepository, userRepository: IUserRepository);
    execute(dto: SendRideRequestDto): Promise<Result<SendRideRequestResponseDto>>;
}
//# sourceMappingURL=SendRideRequestUseCase.d.ts.map