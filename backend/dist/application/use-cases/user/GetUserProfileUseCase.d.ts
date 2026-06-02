import { IUserRepository } from "@domain/repositories/IUserRepository";
import { UserResponseDto } from "@application/dto/user/UserResponseDto";
import { GetUserProfileDto } from "@application/dto/user/GetUserProfileDto";
import { Result } from "@shared/utils/Result";
import { IUseCase } from "../interfaces/IUseCase";
export declare class GetUserProfileUseCase implements IUseCase<GetUserProfileDto, Promise<Result<UserResponseDto>>> {
    private userRepository;
    constructor(userRepository: IUserRepository);
    execute(dto: GetUserProfileDto): Promise<Result<UserResponseDto>>;
}
//# sourceMappingURL=GetUserProfileUseCase.d.ts.map