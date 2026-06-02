import { Request, Response } from "express";
import { GetUserProfileDto } from "@application/dto/user/GetUserProfileDto";
import { UpdateUserProfileDto } from "@application/dto/user/UpdateUserProfileDto";
import { RegisterAsDriverRequestDto, RegisterAsDriverResponseDto, UserProfileUpdateResponseDto, UserResponseDto } from "@application/dto/user";
import { IUseCase } from "@application/use-cases/interfaces/IUseCase";
import { Result } from "@shared/utils/Result";
import { GetUserStatsRequestDto } from "@application/dto/user/GetUserStatsRequestDto";
import { GetUserStatsResponseDto } from "@application/dto/user/GetUserStatsResponseDto";
export declare class UserProfileController {
    private getUserProfileUseCase;
    private updateUserProfileUseCase;
    private registerUserAsDriverUseCase;
    private readonly getUserStatsUseCase;
    constructor(getUserProfileUseCase: IUseCase<GetUserProfileDto, Promise<Result<UserResponseDto>>>, updateUserProfileUseCase: IUseCase<UpdateUserProfileDto, Promise<Result<UserProfileUpdateResponseDto>>>, registerUserAsDriverUseCase: IUseCase<RegisterAsDriverRequestDto, Promise<Result<RegisterAsDriverResponseDto>>>, getUserStatsUseCase: IUseCase<GetUserStatsRequestDto, Promise<Result<GetUserStatsResponseDto>>>);
    private getUserId;
    getProfile(req: Request, res: Response): Promise<void>;
    updateProfile(req: Request, res: Response): Promise<void>;
    registerAsDriver(req: Request, res: Response): Promise<void>;
    getMyStats(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=UserProfileController.d.ts.map