import { IUseCase } from "../interfaces/IUseCase";
import { GetUserRideByIdDto } from "@application/dto/user/GetUserRideByIdDto";
import { GetUserRideByIdResponseDto } from "@application/dto/user/GetUserRideByIdResponseDto";
import { IRideRepository } from "@domain/repositories/IRideRepository";
import { IDriverRepository } from "@domain/repositories/IDriverRepository";
import { IUserRepository } from "@domain/repositories/IUserRepository";
import { Result } from "@shared/utils/Result";
import { IRatingRepository } from "@domain/repositories/IRatingRepository";
export declare class GetUserRideByIdUseCase implements IUseCase<GetUserRideByIdDto, Promise<Result<GetUserRideByIdResponseDto>>> {
    private rideRepository;
    private driverRepository;
    private userRepository;
    private ratingRepository;
    constructor(rideRepository: IRideRepository, driverRepository: IDriverRepository, userRepository: IUserRepository, ratingRepository: IRatingRepository);
    execute(dto: GetUserRideByIdDto): Promise<Result<GetUserRideByIdResponseDto>>;
    private mapRideToDetails;
    private mapDriverToDetails;
}
//# sourceMappingURL=GetUserRideByIdUseCase.d.ts.map