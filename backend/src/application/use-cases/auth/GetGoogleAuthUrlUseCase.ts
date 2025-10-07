import { injectable, inject } from "inversify";
import { IGoogleAuthService } from "@domain/services/IGoogleAuthService";
import { GoogleAuthService } from "../../services/GoogleAuthService";
import { Result } from "@shared/utils/Result";
import { TYPES } from "@shared/constants/DITypes";

@injectable()
export class GetGoogleAuthUrlUseCase {
  constructor(
    @inject(TYPES.GoogleAuthService)
    private googleAuthService: GoogleAuthService
  ) {}

  async execute(): Promise<Result<{ authUrl: string }>> {
    try {
      const authUrl = this.googleAuthService.generateAuthUrl();
      return Result.success({ authUrl });
    } catch (error) {
      return Result.failure(error as Error);
    }
  }
}
