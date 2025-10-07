import { injectable, inject } from "inversify";
import { UserRepository } from "@application/repositories/UserRepository";
import { User } from "@domain/entities/User";
import { UserAlreadyExistsError } from "@domain/errors";
import { SignupRequestDto } from "../../dto/auth/SignupRequestDto";
import { Result } from "@shared/utils/Result";
import { v4 as uuid } from "uuid";
import { Email } from "@domain/value-objects/Email";
import { TYPES } from "@shared/constants/DITypes";
import { EmailService } from "@application/services/EmailService";
import { PasswordService } from "@application/services/PasswordService";
import { OtpService } from "@application/services/OtpService";
import { Logger } from "@shared/utils/Logger";
import { Password } from "@domain/value-objects/Password";

@injectable()
export class SignupRequestUseCase {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: UserRepository,
    @inject(TYPES.PasswordService) private passwordService: PasswordService,
    @inject(TYPES.EmailService) private emailService: EmailService,
    @inject(TYPES.OtpService) private otpService: OtpService
  ) {}

  async execute(dto: SignupRequestDto): Promise<Result<void>> {
    try {
      // Check if verified user exists
      const existingUser = await this.userRepository.findByEmail(
        dto.getEmailValue()
      );

      let user: User;

      if (existingUser && existingUser.getIsVerified()) {
        return Result.failure(new UserAlreadyExistsError());
      } else if (existingUser && !existingUser.getIsVerified()) {
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

        // Hash password
        const passwordHash = await this.passwordService.hash(dto.getPassword());
        user.updatePassword(Password.createFromHash(passwordHash));
        Logger.info("Creating new user", {
          email: dto.getEmailValue(),
          userId: user.getId(),
        });
      }

      // Generate and set OTP
      const otp = this.otpService.generate();
      const otpHash = await this.otpService.hash(otp);
      const otpExpires = new Date(
        Date.now() + parseInt(process.env.OTP_TTL_SECONDS || "300") * 1000
      );

      user.setOtpDetails(otpHash, otpExpires);

      // Save user
      await this.userRepository.save(user);

      Logger.info("OTP Generated:", otp); // for dev
      Logger.info("OTP expires at:", otpExpires); // for dev

      // Send OTP email
      await this.emailService.sendVerificationOtp(
        dto.getEmailValue(),
        otp,
        user.getName()
      );

      return Result.success();
    } catch (error) {
      return Result.failure(error as Error);
    }
  }
}
