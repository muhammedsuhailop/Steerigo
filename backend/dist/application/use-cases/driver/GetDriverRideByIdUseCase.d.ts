import { IUseCase } from "../interfaces/IUseCase";
import { GetDriverRideByIdDto } from "../../dto/driver/GetDriverRideByIdDto";
import { GetDriverRideByIdResponseDto } from "../../dto/driver/GetDriverRideByIdResponseDto";
import { IRideRepository } from "../../../domain/repositories/IRideRepository";
import { IDriverRepository } from "../../../domain/repositories/IDriverRepository";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { Result } from "../../../shared/utils/Result";
import { IRatingRepository } from "../../../domain/repositories/IRatingRepository";
export declare class GetDriverRideByIdUseCase implements IUseCase<GetDriverRideByIdDto, Promise<Result<GetDriverRideByIdResponseDto>>> {
    private driverRepository;
    private rideRepository;
    private userRepository;
    private ratingRepository;
    constructor(driverRepository: IDriverRepository, rideRepository: IRideRepository, userRepository: IUserRepository, ratingRepository: IRatingRepository);
    execute(dto: GetDriverRideByIdDto): Promise<Result<GetDriverRideByIdResponseDto>>;
    private mapRideToDetails;
    private mapRiderToDetails;
}
//# sourceMappingURL=GetDriverRideByIdUseCase.d.ts.map