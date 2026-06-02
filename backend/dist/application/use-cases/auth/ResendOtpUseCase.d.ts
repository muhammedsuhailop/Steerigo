import { IUserRepository } from "@domain/repositories/IUserRepository";
import { IOtpService } from "@application/services/IOtpService";
import { IEmailService } from "@application/services/IEmailService";
import { ResendOtpDto } from "../../dto/auth/ResendOtpDto";
import { Result } from "@shared/utils/Result";
import { IUseCase } from "../interfaces/IUseCase";
export declare class ResendOtpUseCase implements IUseCase<ResendOtpDto, Promise<Result<{
    expiresAt: Date;
}>>> {
    private userRepository;
    private otpService;
    private emailService;
    constructor(userRepository: IUserRepository, otpService: IOtpService, emailService: IEmailService);
    execute(dto: ResendOtpDto): Promise<Result<{
        expiresAt: Date;
    }>>;
}
//# sourceMappingURL=ResendOtpUseCase.d.ts.map