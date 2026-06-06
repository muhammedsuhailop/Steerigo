import { IUseCase } from "../interfaces/IUseCase";
import { GetDriverRidesDto } from "../../dto/driver/GetDriverRidesDto";
import { GetDriverRidesResponseDto } from "../../dto/driver/GetDriverRidesResponseDto";
import { IRideRepository } from "../../../domain/repositories/IRideRepository";
import { IDriverRepository } from "../../../domain/repositories/IDriverRepository";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { Result } from "../../../shared/utils/Result";
export declare class GetDriverRidesUseCase implements IUseCase<GetDriverRidesDto, Promise<Result<GetDriverRidesResponseDto>>> {
    private driverRepository;
    private rideRepository;
    private userRepository;
    constructor(driverRepository: IDriverRepository, rideRepository: IRideRepository, userRepository: IUserRepository);
    execute(dto: GetDriverRidesDto): Promise<Result<GetDriverRidesResponseDto>>;
}
//# sourceMappingURL=GetDriverRidesUseCase.d.ts.map