import { Request, Response } from "express";
import { IUseCase } from "../../../application/use-cases/interfaces/IUseCase";
import { Result } from "../../../shared/utils/Result";
import { GetAdminTransactionsDto } from "../../../application/dto/admin/GetAdminTransactionsDto";
import { GetAdminTransactionsResponseDto } from "../../../application/dto/admin/GetAdminTransactionsResponseDto";
export declare class AdminTransactionController {
    private readonly getAdminTransactionsUseCase;
    constructor(getAdminTransactionsUseCase: IUseCase<GetAdminTransactionsDto, Promise<Result<GetAdminTransactionsResponseDto>>>);
    getTransactions(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=AdminTransactionController.d.ts.map