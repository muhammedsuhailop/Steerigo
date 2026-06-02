import { IRefreshTokenRepository } from "../../../domain/repositories/IRefreshTokenRepository";
import { RefreshTokenDto } from "../../dto/auth/RefreshTokenDto";
import { Result } from "../../../shared/utils/Result";
import { IUseCase } from "../interfaces/IUseCase";
/**
 * Logout Use Case
 *
 * Handles user logout by revoking the refresh token.
 * Implements IUseCase interface with RefreshTokenDto input and void output.
 *
 * @implements IUseCase<RefreshTokenDto, Promise<Result<void, Error>>>
 */
export declare class LogoutUseCase implements IUseCase<RefreshTokenDto, Promise<Result<void, Error>>> {
    private refreshTokenRepository;
    constructor(refreshTokenRepository: IRefreshTokenRepository);
    execute(dto: RefreshTokenDto): Promise<Result<void, Error>>;
}
//# sourceMappingURL=LogoutUseCase.d.ts.map