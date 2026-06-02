import { IUseCase } from "../interfaces/IUseCase";
import { Result } from "@shared/utils/Result";
import { ICouponRepository } from "@domain/repositories/ICouponRepository";
import { GetAdminCouponsDto } from "@application/dto/admin/GetAdminCouponsDto";
import { GetAdminCouponsResponseDto } from "@application/dto/admin/GetAdminCouponsResponseDto";
export declare class GetAdminCouponsUseCase implements IUseCase<GetAdminCouponsDto, Promise<Result<GetAdminCouponsResponseDto>>> {
    private readonly couponRepository;
    constructor(couponRepository: ICouponRepository);
    execute(dto: GetAdminCouponsDto): Promise<Result<GetAdminCouponsResponseDto>>;
}
//# sourceMappingURL=GetAdminCouponsUseCase.d.ts.map