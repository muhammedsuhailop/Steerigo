import { IUseCase } from "../../use-cases/interfaces/IUseCase";
import { Result } from "../../../shared/utils/Result";
import { ICouponRepository } from "../../../domain/repositories/ICouponRepository";
import { GetUserCouponsDto } from "../../dto/user/GetUserCouponsDto";
import { GetUserCouponsResponseDto } from "../../dto/user/GetUserCouponsResponseDto";
export declare class GetUserCouponsUseCase implements IUseCase<GetUserCouponsDto, Promise<Result<GetUserCouponsResponseDto>>> {
    private readonly couponRepository;
    constructor(couponRepository: ICouponRepository);
    execute(dto: GetUserCouponsDto): Promise<Result<GetUserCouponsResponseDto>>;
}
//# sourceMappingURL=GetUserCouponsUseCase.d.ts.map