import { ApplyCouponDto } from "@application/dto/user/ApplyCouponDto";
import { ApplyCouponResponseDto } from "@application/dto/user/ApplyCouponResponseDto";
import { RemoveCouponDto } from "@application/dto/user/RemoveCouponDto";
import { RemoveCouponResponseDto } from "@application/dto/user/RemoveCouponResponseDto";
import { IUseCase } from "@application/use-cases/interfaces/IUseCase";
import { Result } from "@shared/utils/Result";
import { Request, Response } from "express";
import { GetUserCouponsDto } from "@application/dto/user/GetUserCouponsDto";
import { GetUserCouponsResponseDto } from "@application/dto/user/GetUserCouponsResponseDto";
export declare class CouponController {
    private readonly getUserCouponsUseCase;
    private readonly applyCouponUseCase;
    private readonly removeCouponUseCase;
    constructor(getUserCouponsUseCase: IUseCase<GetUserCouponsDto, Promise<Result<GetUserCouponsResponseDto>>>, applyCouponUseCase: IUseCase<ApplyCouponDto, Promise<Result<ApplyCouponResponseDto>>>, removeCouponUseCase: IUseCase<RemoveCouponDto, Promise<Result<RemoveCouponResponseDto>>>);
    private getUserId;
    getUserCoupons(req: Request, res: Response): Promise<void>;
    applyCoupon(req: Request, res: Response): Promise<void>;
    removeCoupon(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=CouponController.d.ts.map