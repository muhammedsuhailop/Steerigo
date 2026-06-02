import { Request, Response } from "express";
import { ResendOtpDto } from "@application/dto/auth/ResendOtpDto";
import { IUseCase } from "@application/use-cases/interfaces/IUseCase";
import { Result } from "@shared/utils/Result";
export declare class OtpController {
    private resendOtpUseCase;
    constructor(resendOtpUseCase: IUseCase<ResendOtpDto, Promise<Result<{
        expiresAt: Date;
    }>>>);
    resendOtp(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=OtpController.d.ts.map