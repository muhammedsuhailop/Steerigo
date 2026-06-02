import { IUserRepository } from "@domain/repositories/IUserRepository";
import { UpdateUserProfileDto } from "@application/dto/user/UpdateUserProfileDto";
import { Result } from "@shared/utils/Result";
import { UserProfileUpdateResponseDto } from "@application/dto/user/UserProfileUpdateResponseDto";
import { IUseCase } from "../interfaces/IUseCase";
export declare class UpdateUserProfileUseCase implements IUseCase<UpdateUserProfileDto, Promise<Result<UserProfileUpdateResponseDto>>> {
    private userRepository;
    constructor(userRepository: IUserRepository);
    execute(dto: UpdateUserProfileDto): Promise<Result<UserProfileUpdateResponseDto>>;
}
//# sourceMappingURL=UpdateUserProfileUseCase.d.ts.map