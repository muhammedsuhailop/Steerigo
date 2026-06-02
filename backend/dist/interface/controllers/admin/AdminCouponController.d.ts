import { Request, Response } from "express";
import { IUseCase } from "@application/use-cases/interfaces/IUseCase";
import { CreateCouponDto } from "@application/dto/admin/CreateCouponDto";
import { CreateCouponResponseDto } from "@application/dto/admin/CreateCouponResponseDto";
import { EditCouponDto } from "@application/dto/admin/EditCouponDto";
import { EditCouponResponseDto } from "@application/dto/admin/EditCouponResponseDto";
import { Result } from "@shared/utils/Result";
import { GetAdminCouponsDto } from "@application/dto/admin/GetAdminCouponsDto";
import { GetAdminCouponsResponseDto } from "@application/dto/admin/GetAdminCouponsResponseDto";
export declare class AdminCouponController {
    private readonly createCouponUseCase;
    private readonly editCouponUseCase;
    private readonly getAdminCouponsUseCase;
    constructor(createCouponUseCase: IUseCase<CreateCouponDto, Promise<Result<CreateCouponResponseDto>>>, editCouponUseCase: IUseCase<EditCouponDto, Promise<Result<EditCouponResponseDto>>>, getAdminCouponsUseCase: IUseCase<GetAdminCouponsDto, Promise<Result<GetAdminCouponsResponseDto>>>);
    getCoupons(req: Request, res: Response): Promise<void>;
    createCoupon(req: Request, res: Response): Promise<void>;
    editCoupon(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=AdminCouponController.d.ts.map