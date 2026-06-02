import { Request, Response } from "express";
import { IUseCase } from "@application/use-cases/interfaces/IUseCase";
import { GetDriverWalletDto } from "@application/dto/driver/GetDriverWalletDto";
import { GetDriverWalletResponseDto } from "@application/dto/driver/GetDriverWalletResponseDto";
import { Result } from "@shared/utils/Result";
export declare class DriverWalletController {
    private readonly getDriverWalletUseCase;
    constructor(getDriverWalletUseCase: IUseCase<GetDriverWalletDto, Promise<Result<GetDriverWalletResponseDto>>>);
    getWallet(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=DriverWalletController.d.ts.map