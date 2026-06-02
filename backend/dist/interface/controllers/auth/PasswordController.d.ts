import { Request, Response } from "express";
import { ForgotPasswordRequestDto } from "@application/dto/auth/ForgotPasswordRequestDto";
import { ForgotPasswordVerifyDto } from "@application/dto/auth/ForgotPasswordVerifyDto";
import { UpdatePasswordDto } from "@application/dto/auth/UpdatePasswordDto";
import { IUseCase } from "@application/use-cases/interfaces/IUseCase";
import { Result } from "@shared/utils/Result";
export declare class PasswordController {
    private forgotPasswordRequestUseCase;
    private forgotPasswordVerifyUseCase;
    private updatePasswordUseCase;
    constructor(forgotPasswordRequestUseCase: IUseCase<ForgotPasswordRequestDto, Promise<Result<void>>>, forgotPasswordVerifyUseCase: IUseCase<ForgotPasswordVerifyDto, Promise<Result<void>>>, updatePasswordUseCase: IUseCase<UpdatePasswordDto, Promise<Result<void>>>);
    forgotPasswordRequest(req: Request, res: Response): Promise<void>;
    forgotPasswordVerify(req: Request, res: Response): Promise<void>;
    updatePassword(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=PasswordController.d.ts.map