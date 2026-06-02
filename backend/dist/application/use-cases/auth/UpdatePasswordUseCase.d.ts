import { IUserRepository } from "@domain/repositories/IUserRepository";
import { IPasswordService } from "@application/services/IPasswordService";
import { UpdatePasswordDto } from "../../dto/auth/UpdatePasswordDto";
import { Result } from "@shared/utils/Result";
import { IUseCase } from "../interfaces/IUseCase";
export declare class UpdatePasswordUseCase implements IUseCase<UpdatePasswordDto, Promise<Result<void>>> {
    private userRepository;
    private passwordService;
    constructor(userRepository: IUserRepository, passwordService: IPasswordService);
    execute(dto: UpdatePasswordDto): Promise<Result<void>>;
}
//# sourceMappingURL=UpdatePasswordUseCase.d.ts.map