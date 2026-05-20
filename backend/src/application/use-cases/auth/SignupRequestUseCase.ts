import { injectable, inject } from "inversify";
import { IUserRepository } from "@domain/repositories/IUserRepository";
import { User } from "@domain/entities/User";
import { UserAlreadyExistsError } from "@domain/errors";
import { SignupRequestDto } from "../../dto/auth/SignupRequestDto";
import { Result } from "@shared/utils/Result";
import { v4 as uuid } from "uuid";
import { TYPES } from "@shared/constants/DITypes";
import { IEmailService } from "@application/services/IEmailService";
import { IPasswordService } from "@application/services/IPasswordService";
import { IOtpService } from "@application/services/IOtpService";
import { Logger } from "@shared/utils/Logger";
import { Password } from "@domain/value-objects/Password";
import { IUseCase } from "../interfaces/IUseCase";

@injectable()
export class SignupRequestUseCase implements IUseCase<
  SignupRequestDto,
  Promise<Result<void>>
> {
  constructor(
    @inject(TYPES.UserRepository)
    private userRepository: IUserRepository,
    @inject(TYPES.PasswordService)
    private passwordService: IPasswordService,
    @inject(TYPES.EmailService)
    private emailService: IEmailService,
    @inject(TYPES.OtpService)
    private otpService: IOtpService,
  ) {}

  async execute(dto: SignupRequestDto): Promise<Result<void>> {
    try {
      const existingUser = await this.userRepository.findByEmail(
        dto.getEmailValue(),
      );

      const existingMobileUser = await this.userRepository.findByMobile(
        dto.getMobile(),
      );

      let user: User;

      if (existingUser && existingUser.getIsVerified()) {
        return Result.failure(
          new UserAlreadyExistsError("Email already registered"),
        );
      }

      if (existingMobileUser && existingMobileUser.getIsVerified()) {
        return Result.failure(
          new UserAlreadyExistsError("Mobile number already registered"),
        );
      }

      if (existingUser && !existingUser.getIsVerified()) {
        user = existingUser;

        const passwordHash = await this.passwordService.hash(dto.getPassword());

        user.updatePassword(Password.createFromHash(passwordHash));

        Logger.info("Updating existing unverified user", {
          email: dto.getEmailValue(),
          userId: user.getId(),
        });
      } else {
        user = User.create({
          id: uuid(),
          name: dto.getName(),
          email: dto.getEmailValue(),
          password: dto.getPassword(),
          mobile: dto.getMobile(),
          role: dto.getRole(),
        });

        const passwordHash = await this.passwordService.hash(dto.getPassword());

        user.updatePassword(Password.createFromHash(passwordHash));

        Logger.info("Creating new user", {
          email: dto.getEmailValue(),
          userId: user.getId(),
        });
      }

      const otp = this.otpService.generate();

      const otpHash = await this.otpService.hash(otp);

      const otpExpires = new Date(
        Date.now() + parseInt(process.env.OTP_TTL_SECONDS || "300") * 1000,
      );

      user.setOtpDetails(otpHash, otpExpires);

      await this.userRepository.save(user);

      Logger.info("OTP Generated:", otp); // DEV ONLY
      Logger.info("OTP expires at:", otpExpires); // DEV ONLY

      await this.emailService.sendVerificationOtp(
        dto.getEmailValue(),
        otp,
        user.getName(),
      );

      return Result.success();
    } catch (error) {
      return Result.failure(error as Error);
    }
  }
}
