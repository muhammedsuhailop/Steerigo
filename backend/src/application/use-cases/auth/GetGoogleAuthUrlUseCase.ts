import { injectable, inject } from "inversify";
import { GoogleAuthService } from "../../services/GoogleAuthService";
import { Result } from "@shared/utils/Result";
import { TYPES } from "@shared/constants/DITypes";
import { IUseCase } from "../interfaces/IUseCase";

@injectable()
export class GetGoogleAuthUrlUseCase
  implements IUseCase<void, Promise<Result<{ authUrl: string }>>>
{
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
