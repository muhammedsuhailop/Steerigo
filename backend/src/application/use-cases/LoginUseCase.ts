import { injectable, inject } from "inversify";
import { IUserRepository } from "@domain/repositories/IUserRepository";
import { IPasswordService } from "@domain/services/IPasswordService";
import { ITokenService } from "@domain/services/ITokenService";
import { InvalidCredentialsError, DomainError } from "@domain/errors";
import { LoginDto } from "../dto/LoginDto";
import { Result } from "@shared/utils/Result";

@injectable()
export class LoginUseCase {
    constructor(
        @inject("IUserRepository") private userRepository: IUserRepository,
        @inject("IPasswordService") private passwordService: IPasswordService,
        @inject("ITokenService") private tokenService: ITokenService
    ) { }

    async execute(dto: LoginDto): Promise<Result<{ token: string; user: any }>> {
        try {
            const user = await this.userRepository.findByEmail(dto.email);

            if (!user) {
                return Result.failure(new InvalidCredentialsError());
            }

            if (!user.getIsVerified()) {
                return Result.failure(
                    new DomainError("Please verify your email before logging in")
                );
            }

            // Verify password
            const isPasswordValid = await this.passwordService.compare(
                dto.password,
                user.getPassword()
            );

            if (!isPasswordValid) {
                return Result.failure(new InvalidCredentialsError());
            }

            // Generate JWT token
            const token = this.tokenService.generate({
                userId: user.getId(),
                role: user.getRole(),
            });

            return Result.success({
                token,
                user: {
                    id: user.getId(),
                    name: user.getName(),
                    email: user.getEmail(),
                    role: user.getRole(),
                    status: user.getStatus(),
                },
            });
        } catch (error) {
            return Result.failure(error as Error);
        }
    }
}
