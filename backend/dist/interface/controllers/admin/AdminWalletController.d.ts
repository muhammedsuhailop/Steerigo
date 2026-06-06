import { Request, Response } from "express";
import { IUseCase } from "../../../application/use-cases/interfaces/IUseCase";
import { Result } from "../../../shared/utils/Result";
import { GetAdminWalletDto } from "../../../application/dto/admin/GetAdminWalletDto";
import { GetAdminWalletResponseDto } from "../../../application/dto/admin/GetAdminWalletResponseDto";
export declare class AdminWalletController {
    private readonly getAdminWalletUseCase;
    constructor(getAdminWalletUseCase: IUseCase<GetAdminWalletDto, Promise<Result<GetAdminWalletResponseDto>>>);
    getWallet(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=AdminWalletController.d.ts.map