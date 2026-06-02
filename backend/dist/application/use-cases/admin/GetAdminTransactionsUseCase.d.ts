import { IUseCase } from "../interfaces/IUseCase";
import { Result } from "../../../shared/utils/Result";
import { ITransactionRepository } from "../../../domain/repositories/ITransactionRepository";
import { GetAdminTransactionsDto } from "../../dto/admin/GetAdminTransactionsDto";
import { GetAdminTransactionsResponseDto } from "../../dto/admin/GetAdminTransactionsResponseDto";
export declare class GetAdminTransactionsUseCase implements IUseCase<GetAdminTransactionsDto, Promise<Result<GetAdminTransactionsResponseDto>>> {
    private readonly transactionRepository;
    constructor(transactionRepository: ITransactionRepository);
    execute(dto: GetAdminTransactionsDto): Promise<Result<GetAdminTransactionsResponseDto>>;
}
//# sourceMappingURL=GetAdminTransactionsUseCase.d.ts.map