import { IUseCase } from "../interfaces/IUseCase";
import { Result } from "../../../shared/utils/Result";
import { ICouponRepository } from "../../../domain/repositories/ICouponRepository";
import { CreateCouponDto } from "../../dto/admin/CreateCouponDto";
import { CreateCouponResponseDto } from "../../dto/admin/CreateCouponResponseDto";
import { IIdGenerator } from "../../services/IIdGenerator";
export declare class CreateCouponUseCase implements IUseCase<CreateCouponDto, Promise<Result<CreateCouponResponseDto>>> {
    private readonly couponRepository;
    private readonly idGenerator;
    constructor(couponRepository: ICouponRepository, idGenerator: IIdGenerator);
    execute(dto: CreateCouponDto): Promise<Result<CreateCouponResponseDto>>;
}
//# sourceMappingURL=CreateCouponUseCase.d.ts.map