import { injectable, inject } from "inversify";
import { IGoogleAuthService } from "@domain/services/IGoogleAuthService";
import { Result } from "@shared/utils/Result";

@injectable()
export class GetGoogleAuthUrlUseCase {
  constructor(
    @inject("IGoogleAuthService") private googleAuthService: IGoogleAuthService
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
