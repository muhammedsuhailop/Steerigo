import { IGoogleAuthService } from "../../services/IGoogleAuthService";
import { Result } from "@shared/utils/Result";
import { IUseCase } from "../interfaces/IUseCase";
export declare class GetGoogleAuthUrlUseCase implements IUseCase<void, Promise<Result<{
    authUrl: string;
}>>> {
    private googleAuthService;
    constructor(googleAuthService: IGoogleAuthService);
    execute(): Promise<Result<{
        authUrl: string;
    }>>;
}
//# sourceMappingURL=GetGoogleAuthUrlUseCase.d.ts.map