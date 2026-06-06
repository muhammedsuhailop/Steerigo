import { Request, Response } from "express";
import { RefreshTokenDto } from "../../../application/dto/auth";
import { IUseCase } from "../../../application/use-cases/interfaces/IUseCase";
import { Result } from "../../../shared/utils/Result";
export declare class TokenController {
    private logoutUseCase;
    private refreshTokenUseCase;
    constructor(logoutUseCase: IUseCase<RefreshTokenDto, Promise<Result<void, Error>>>, refreshTokenUseCase: IUseCase<RefreshTokenDto, Promise<Result<{
        accessToken: string;
        refreshToken: string;
    }, Error>>>);
    logout(req: Request, res: Response): Promise<void>;
    refreshToken(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=TokenController.d.ts.map