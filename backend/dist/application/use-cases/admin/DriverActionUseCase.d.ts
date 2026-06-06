import { IAdminDriverRepository } from "../../../domain/repositories/IAdminDriverRepository";
import { DriverActionRequestDto } from "../../dto/admin/DriverActionRequestDto";
import { Result } from "../../../shared/utils/Result";
import { IUseCase } from "../interfaces/IUseCase";
export declare class DriverActionUseCase implements IUseCase<DriverActionRequestDto, Promise<Result<{
    message: string;
    driverId: string;
    newStatus: string;
}>>> {
    private adminDriverRepository;
    constructor(adminDriverRepository: IAdminDriverRepository);
    execute(dto: DriverActionRequestDto): Promise<Result<{
        message: string;
        driverId: string;
        newStatus: string;
    }>>;
}
//# sourceMappingURL=DriverActionUseCase.d.ts.map