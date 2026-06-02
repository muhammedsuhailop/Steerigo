import { Request, Response } from "express";
import { IUseCase } from "../../../application/use-cases/interfaces/IUseCase";
import { GetDriverStatsRequestDto } from "../../../application/dto/driver/GetDriverStatsRequestDto";
import { GetDriverStatsResponseDto } from "../../../application/dto/driver/GetDriverStatsResponseDto";
import { Result } from "../../../shared/utils/Result";
export declare class DriverStatsController {
    private readonly getDriverStatsUseCase;
    constructor(getDriverStatsUseCase: IUseCase<GetDriverStatsRequestDto, Promise<Result<GetDriverStatsResponseDto>>>);
    getMyStats(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=DriverStatsController.d.ts.map