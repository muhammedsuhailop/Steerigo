import { Request, Response } from "express";
import { IUseCase } from "../../../application/use-cases/interfaces/IUseCase";
import { ApprovePayoutDto } from "../../../application/dto/admin/ApprovePayoutDto";
import { ApprovePayoutResponseDto } from "../../../application/dto/admin/ApprovePayoutResponseDto";
import { RejectPayoutDto } from "../../../application/dto/admin/RejectPayoutDto";
import { RejectPayoutResponseDto } from "../../../application/dto/admin/RejectPayoutResponseDto";
import { GetAdminPayoutsDto } from "../../../application/dto/admin/GetAdminPayoutsDto";
import { GetPayoutsResponseDto } from "../../../application/dto/admin/GetPayoutsResponseDto";
import { Result } from "../../../shared/utils/Result";
export declare class AdminPayoutController {
    private readonly approvePayoutUseCase;
    private readonly rejectPayoutUseCase;
    private readonly getAdminPayoutsUseCase;
    constructor(approvePayoutUseCase: IUseCase<ApprovePayoutDto, Promise<Result<ApprovePayoutResponseDto>>>, rejectPayoutUseCase: IUseCase<RejectPayoutDto, Promise<Result<RejectPayoutResponseDto>>>, getAdminPayoutsUseCase: IUseCase<GetAdminPayoutsDto, Promise<Result<GetPayoutsResponseDto>>>);
    approvePayout(req: Request, res: Response): Promise<void>;
    rejectPayout(req: Request, res: Response): Promise<void>;
    getPayouts(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=AdminPayoutController.d.ts.map