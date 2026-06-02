import { IUseCase } from "../interfaces/IUseCase";
import { GetAdminRidesDto } from "@application/dto/admin/GetAdminRidesDto";
import { GetAdminRidesResponseDto } from "@application/dto/admin/GetAdminRidesResponseDto";
import { IRideRepository } from "@domain/repositories/IRideRepository";
import { IDriverRepository } from "@domain/repositories/IDriverRepository";
import { IUserRepository } from "@domain/repositories/IUserRepository";
import { Result } from "@shared/utils/Result";
export declare class GetAdminRidesUseCase implements IUseCase<GetAdminRidesDto, Promise<Result<GetAdminRidesResponseDto>>> {
    private readonly rideRepository;
    private readonly driverRepository;
    private readonly userRepository;
    constructor(rideRepository: IRideRepository, driverRepository: IDriverRepository, userRepository: IUserRepository);
    execute(dto: GetAdminRidesDto): Promise<Result<GetAdminRidesResponseDto>>;
}
//# sourceMappingURL=GetAdminRidesUseCase.d.ts.map