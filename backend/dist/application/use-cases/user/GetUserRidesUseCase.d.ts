import { IUseCase } from "../interfaces/IUseCase";
import { GetUserRidesDto } from "@application/dto/user/GetUserRidesDto";
import { GetUserRidesResponseDto } from "@application/dto/user/GetUserRidesResponseDto";
import { IRideRepository } from "@domain/repositories/IRideRepository";
import { IDriverRepository } from "@domain/repositories/IDriverRepository";
import { IUserRepository } from "@domain/repositories/IUserRepository";
import { Result } from "@shared/utils/Result";
export declare class GetUserRidesUseCase implements IUseCase<GetUserRidesDto, Promise<Result<GetUserRidesResponseDto>>> {
    private readonly rideRepository;
    private readonly driverRepository;
    private readonly userRepository;
    constructor(rideRepository: IRideRepository, driverRepository: IDriverRepository, userRepository: IUserRepository);
    execute(dto: GetUserRidesDto): Promise<Result<GetUserRidesResponseDto>>;
}
//# sourceMappingURL=GetUserRidesUseCase.d.ts.map