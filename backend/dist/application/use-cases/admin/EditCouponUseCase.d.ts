import { IUseCase } from "../interfaces/IUseCase";
import { Result } from "../../../shared/utils/Result";
import { ICouponRepository } from "../../../domain/repositories/ICouponRepository";
import { EditCouponDto } from "../../dto/admin/EditCouponDto";
import { EditCouponResponseDto } from "../../dto/admin/EditCouponResponseDto";
export declare class EditCouponUseCase implements IUseCase<EditCouponDto, Promise<Result<EditCouponResponseDto>>> {
    private readonly couponRepository;
    constructor(couponRepository: ICouponRepository);
    execute(dto: EditCouponDto): Promise<Result<EditCouponResponseDto>>;
}
//# sourceMappingURL=EditCouponUseCase.d.ts.map