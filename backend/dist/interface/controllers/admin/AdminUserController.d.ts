import { Request, Response } from "express";
import { GetUsersRequestDto } from "@application/dto/admin/GetUsersRequestDto";
import { UpdateUserStatusRequestDto } from "@application/dto/admin/UpdateUserStatusRequestDto";
import { IUseCase } from "@application/use-cases/interfaces/IUseCase";
import { GetUsersResponseDto, UpdateUserStatusResponseDto } from "@application/dto/admin";
import { Result } from "@shared/utils/Result";
import { GetUserProfileRequestDto } from "@application/dto/admin/GetUserProfileRequestDto";
import { GetUserProfileResponseDto } from "@application/dto/admin/GetUserProfileResponseDto";
export declare class AdminUserController {
    private getUsersUseCase;
    private updateUserStatusUseCase;
    private readonly getUserProfileUseCase;
    constructor(getUsersUseCase: IUseCase<GetUsersRequestDto, Promise<Result<GetUsersResponseDto>>>, updateUserStatusUseCase: IUseCase<UpdateUserStatusRequestDto, Promise<Result<UpdateUserStatusResponseDto>>>, getUserProfileUseCase: IUseCase<GetUserProfileRequestDto, Promise<Result<GetUserProfileResponseDto>>>);
    getUsers(req: Request, res: Response): Promise<void>;
    updateUserStatus(req: Request, res: Response): Promise<void>;
    getUserProfile(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=AdminUserController.d.ts.map