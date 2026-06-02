import { Request, Response } from "express";
import { GetCurrentUserDto } from "@application/dto/auth/GetCurrentUserDto";
import { IUseCase } from "@application/use-cases/interfaces/IUseCase";
import { GetCurrentUserResponseDto } from "@application/dto/auth";
import { Result } from "@shared/utils/Result";
export declare class AuthUserController {
    private getCurrentUserUseCase;
    constructor(getCurrentUserUseCase: IUseCase<GetCurrentUserDto, Promise<Result<GetCurrentUserResponseDto>>>);
    getCurrentUser(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=AuthUserController.d.ts.map