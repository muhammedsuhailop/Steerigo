import { Request, Response } from "express";
import { SignupRequestDto } from "@application/dto/auth/SignupRequestDto";
import { SignupVerifyDto } from "@application/dto/auth/SignupVerifyDto";
import { IUseCase } from "@application/use-cases/interfaces/IUseCase";
import { Result } from "@shared/utils/Result";
import { SignupVerifyResponseDto } from "@application/dto/auth";
export declare class SignupController {
    private signupRequestUseCase;
    private signupVerifyUseCase;
    constructor(signupRequestUseCase: IUseCase<SignupRequestDto, Promise<Result<void, Error>>>, signupVerifyUseCase: IUseCase<SignupVerifyDto, Promise<Result<SignupVerifyResponseDto, Error>>>);
    signup(req: Request, res: Response): Promise<void>;
    verify(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=SignupController.d.ts.map