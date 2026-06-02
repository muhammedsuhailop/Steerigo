import { Request, Response } from "express";
import { IUseCase } from "../../../application/use-cases/interfaces/IUseCase";
import { GetAdminRidesDto } from "../../../application/dto/admin/GetAdminRidesDto";
import { GetAdminRidesResponseDto } from "../../../application/dto/admin/GetAdminRidesResponseDto";
import { Result } from "../../../shared/utils/Result";
import { GetAdminRatingsDto } from "../../../application/dto/admin/GetAdminRatingsDto";
import { GetAdminRatingsResponseDto } from "../../../application/dto/admin/GetAdminRatingsResponseDto";
import { GetAdminRideByIdDto } from "../../../application/dto/admin/GetAdminRideByIdDto";
import { GetAdminRideByIdResponseDto } from "../../../application/dto/admin/GetAdminRideByIdResponseDto";
export declare class AdminRideController {
    private readonly getAdminRidesUseCase;
    private readonly getAdminRatingsUseCase;
    private readonly getAdminRideByIdUseCase;
    constructor(getAdminRidesUseCase: IUseCase<GetAdminRidesDto, Promise<Result<GetAdminRidesResponseDto>>>, getAdminRatingsUseCase: IUseCase<GetAdminRatingsDto, Promise<Result<GetAdminRatingsResponseDto>>>, getAdminRideByIdUseCase: IUseCase<GetAdminRideByIdDto, Promise<Result<GetAdminRideByIdResponseDto>>>);
    getRides(req: Request, res: Response): Promise<void>;
    getRatings(req: Request, res: Response): Promise<void>;
    getRideById(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=AdminRideController.d.ts.map