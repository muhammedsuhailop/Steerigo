import { IUseCase } from "../interfaces/IUseCase";
import { Result } from "@shared/utils/Result";
import { IRideRepository } from "@domain/repositories/IRideRepository";
import { IRatingRepository } from "@domain/repositories/IRatingRepository";
import { IUserRepository } from "@domain/repositories/IUserRepository";
import { GetAdminRideByIdDto } from "@application/dto/admin/GetAdminRideByIdDto";
import { GetAdminRideByIdResponseDto } from "@application/dto/admin/GetAdminRideByIdResponseDto";
import { IDriverRepository } from "@domain/repositories/IDriverRepository";
export declare class GetAdminRideByIdUseCase implements IUseCase<GetAdminRideByIdDto, Promise<Result<GetAdminRideByIdResponseDto>>> {
    private readonly rideRepository;
    private readonly ratingRepository;
    private readonly userRepository;
    private readonly driverRepository;
    constructor(rideRepository: IRideRepository, ratingRepository: IRatingRepository, userRepository: IUserRepository, driverRepository: IDriverRepository);
    execute(dto: GetAdminRideByIdDto): Promise<Result<GetAdminRideByIdResponseDto>>;
    private buildRideDetails;
    private buildRiderDetails;
    private buildDriverDetails;
}
//# sourceMappingURL=GetAdminRideByIdUseCase.d.ts.map