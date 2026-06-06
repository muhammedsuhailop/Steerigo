import { Request, Response } from "express";
import { GetCurrentUserDto, GetCurrentUserResponseDto, LoginRequestDto, LoginResponseDto } from "../../../application/dto/auth";
import { IUseCase } from "../../../application/use-cases/interfaces/IUseCase";
import { Result } from "../../../shared/utils/Result";
export declare class UserAuthController {
    private loginUseCase;
    private getCurrentUserUseCase;
    constructor(loginUseCase: IUseCase<LoginRequestDto, Promise<Result<LoginResponseDto, Error>>>, getCurrentUserUseCase: IUseCase<GetCurrentUserDto, Promise<Result<GetCurrentUserResponseDto>>>);
    login(req: Request, res: Response): Promise<void>;
    getCurrentUser(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=UserAuthController.d.ts.map