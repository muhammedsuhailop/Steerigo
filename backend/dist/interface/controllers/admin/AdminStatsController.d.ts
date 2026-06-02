import { Request, Response } from "express";
import { IUseCase } from "../../../application/use-cases/interfaces/IUseCase";
import { GetUserStatsRequestDto } from "../../../application/dto/admin/GetUserStatsRequestDto";
import { GetUserStatsResponseDto } from "../../../application/dto/admin/GetUserStatsResponseDto";
import { Result } from "../../../shared/utils/Result";
import { GetAdminRideStatsRequestDto } from "../../../application/dto/admin/GetAdminRideStatsRequestDto";
import { GetAdminRideStatsResponseDto } from "../../../application/dto/admin/GetAdminRideStatsResponseDto";
import { GetAdminDriverStatsRequestDto } from "../../../application/dto/admin/GetAdminDriverStatsRequestDto";
import { GetAdminDriverStatsResponseDto } from "../../../application/dto/admin/GetAdminDriverStatsResponseDto";
export declare class AdminStatsController {
    private readonly getAdminUserStatsUseCase;
    private readonly getAdminRideStatsUseCase;
    private readonly getAdminDriverStatsUseCase;
    constructor(getAdminUserStatsUseCase: IUseCase<GetUserStatsRequestDto, Promise<Result<GetUserStatsResponseDto>>>, getAdminRideStatsUseCase: IUseCase<GetAdminRideStatsRequestDto, Promise<Result<GetAdminRideStatsResponseDto>>>, getAdminDriverStatsUseCase: IUseCase<GetAdminDriverStatsRequestDto, Promise<Result<GetAdminDriverStatsResponseDto>>>);
    getUserStats(req: Request, res: Response): Promise<void>;
    getRideStats(req: Request, res: Response): Promise<void>;
    getDriverStats(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=AdminStatsController.d.ts.map