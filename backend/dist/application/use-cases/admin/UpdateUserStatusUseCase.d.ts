import { IAdminUserRepository } from "@domain/repositories/IAdminUserRepository";
import { UpdateUserStatusRequestDto } from "@application/dto/admin/UpdateUserStatusRequestDto";
import { Result } from "@shared/utils/Result";
import { IUseCase } from "../interfaces/IUseCase";
import { UpdateUserStatusResponseDto } from "@application/dto/admin/UpdateUserStatusResponseDto";
export declare class UpdateUserStatusUseCase implements IUseCase<UpdateUserStatusRequestDto, Promise<Result<UpdateUserStatusResponseDto>>> {
    private adminUserRepository;
    constructor(adminUserRepository: IAdminUserRepository);
    execute(dto: UpdateUserStatusRequestDto): Promise<Result<UpdateUserStatusResponseDto>>;
    private validateAction;
    private mapActionToStatus;
}
//# sourceMappingURL=UpdateUserStatusUseCase.d.ts.map