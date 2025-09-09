import { inject, injectable } from "inversify";
import { IUserRepository } from "@domain/repositories";
import { IPasswordService } from "@domain/services";
import { InvalidCredentialsError, DomainError } from "@domain/errors";
import { UpdatePasswordDto } from "@application/dto";
import { Result } from "@shared/utils/Result";

@injectable()
export class UpdatePasswordUseCase {
    constructor(
        @inject('IUserRepository') private userRepocitory: IUserRepository,
        @inject('IPasswordService') private passwordService: IPasswordService
    ) { }

    async execute(userId: string, dto: UpdatePasswordDto): Promise<Result<void>> {
        try {
            const user = await this.userRepocitory.findById(userId);
            if (!user) {
                return Result.failure(new DomainError('User not found'));
            }
            if (!user.getIsVerified()) {
                return Result.failure(new DomainError('User account is not verified'))
            }

            //Verify current password
            const isCurrentPasswordValid = await this.passwordService.compare(dto.currentPassword, user.getPassword());
            if (!isCurrentPasswordValid) {
                return Result.failure(new InvalidCredentialsError());
            }

            // Check if new password is different from current
            const isSamePassword = await this.passwordService.compare(dto.newPassword, user.getPassword())
            if (isSamePassword) {
                return Result.failure(new DomainError('New Password should be different from previous password'))
            }

            // Hash new password
            const newPassword = await this.passwordService.hash(dto.newPassword);

            user.updatePassword(newPassword);

            await this.userRepocitory.save(user);

            return Result.success();
        } catch (error) {
            return Result.failure(error as Error)
        }
    }
}