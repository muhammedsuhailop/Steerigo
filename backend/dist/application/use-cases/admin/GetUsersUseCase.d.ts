import { IAdminUserRepository } from "../../../domain/repositories/IAdminUserRepository";
import { GetUsersRequestDto } from "../../dto/admin/GetUsersRequestDto";
import { Result } from "../../../shared/utils/Result";
import { IUseCase } from "../interfaces/IUseCase";
import { GetUsersResponseDto } from "../../dto/admin/GetUsersResponseDto";
import { IRideRepository } from "../../../domain/repositories/IRideRepository";
export declare class GetUsersUseCase implements IUseCase<GetUsersRequestDto, Promise<Result<GetUsersResponseDto>>> {
    private adminUserRepository;
    private readonly rideRepository;
    constructor(adminUserRepository: IAdminUserRepository, rideRepository: IRideRepository);
    execute(dto: GetUsersRequestDto): Promise<Result<GetUsersResponseDto>>;
}
//# sourceMappingURL=GetUsersUseCase.d.ts.map