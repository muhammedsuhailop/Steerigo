import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { GetCurrentUserDto } from "../../dto/auth/GetCurrentUserDto";
import { GetCurrentUserResponseDto } from "../../dto/auth/GetCurrentUserResponseDto";
import { Result } from "../../../shared/utils/Result";
import { IUseCase } from "../interfaces/IUseCase";
export declare class GetCurrentUserUseCase implements IUseCase<GetCurrentUserDto, Promise<Result<GetCurrentUserResponseDto>>> {
    private userRepository;
    constructor(userRepository: IUserRepository);
    execute(dto: GetCurrentUserDto): Promise<Result<GetCurrentUserResponseDto>>;
}
//# sourceMappingURL=GetCurrentUserUseCase.d.ts.map