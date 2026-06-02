import { IUserRepository } from "@domain/repositories/IUserRepository";
import { GetUserProfileRequestDto } from "@application/dto/admin/GetUserProfileRequestDto";
import { GetUserProfileResponseDto } from "@application/dto/admin/GetUserProfileResponseDto";
import { Result } from "@shared/utils/Result";
import { IUseCase } from "@application/use-cases/interfaces/IUseCase";
import { IRideRepository } from "@domain/repositories/IRideRepository";
export declare class GetUserProfileDetailsUseCase implements IUseCase<GetUserProfileRequestDto, Promise<Result<GetUserProfileResponseDto>>> {
    private readonly userRepository;
    private readonly rideRepository;
    constructor(userRepository: IUserRepository, rideRepository: IRideRepository);
    execute(dto: GetUserProfileRequestDto): Promise<Result<GetUserProfileResponseDto>>;
    private calculateJoinedDaysAgo;
    private isProfileComplete;
}
//# sourceMappingURL=GetUserProfileDetailsUseCase.d.ts.map