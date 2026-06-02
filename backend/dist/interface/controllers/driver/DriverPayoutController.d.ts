import { Request, Response } from "express";
import { IUseCase } from "@application/use-cases/interfaces/IUseCase";
import { RequestPayoutDto } from "@application/dto/driver/RequestPayoutDto";
import { RequestPayoutResponseDto } from "@application/dto/driver/RequestPayoutResponseDto";
import { GetDriverPayoutsDto } from "@application/dto/driver/GetDriverPayoutsDto";
import { GetPayoutsResponseDto } from "@application/dto/driver/GetPayoutsResponseDto";
import { Result } from "@shared/utils/Result";
export declare class DriverPayoutController {
    private readonly requestPayoutUseCase;
    private readonly getDriverPayoutsUseCase;
    constructor(requestPayoutUseCase: IUseCase<RequestPayoutDto, Promise<Result<RequestPayoutResponseDto>>>, getDriverPayoutsUseCase: IUseCase<GetDriverPayoutsDto, Promise<Result<GetPayoutsResponseDto>>>);
    requestPayout(req: Request, res: Response): Promise<void>;
    getMyPayouts(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=DriverPayoutController.d.ts.map