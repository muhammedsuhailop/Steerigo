import { Request, Response } from "express";
import { FindNearbyDriversRequestDto } from "@application/dto/user/FindNearbyDriversRequestDto";
import { IUseCase } from "@application/use-cases/interfaces/IUseCase";
import { FindNearbyDriversResponseDto } from "@application/dto/user/FindNearbyDriversResponseDto";
import { Result } from "@shared/utils/Result";
export declare class DriverSearchController {
    private findNearbyDriversUseCase;
    constructor(findNearbyDriversUseCase: IUseCase<FindNearbyDriversRequestDto, Promise<Result<FindNearbyDriversResponseDto>>>);
    private getUserId;
    findNearbyDrivers(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=DriverSearchController.d.ts.map