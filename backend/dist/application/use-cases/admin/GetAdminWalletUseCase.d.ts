import { IUseCase } from "../interfaces/IUseCase";
import { Result } from "@shared/utils/Result";
import { IWalletRepository } from "@domain/repositories/IWalletRepository";
import { ITransactionRepository } from "@domain/repositories/ITransactionRepository";
import { IIdGenerator } from "@application/services/IIdGenerator";
import { GetAdminWalletDto } from "@application/dto/admin/GetAdminWalletDto";
import { GetAdminWalletResponseDto } from "@application/dto/admin/GetAdminWalletResponseDto";
export declare class GetAdminWalletUseCase implements IUseCase<GetAdminWalletDto, Promise<Result<GetAdminWalletResponseDto>>> {
    private readonly walletRepository;
    private readonly transactionRepository;
    private readonly idGenerator;
    constructor(walletRepository: IWalletRepository, transactionRepository: ITransactionRepository, idGenerator: IIdGenerator);
    execute(dto: GetAdminWalletDto): Promise<Result<GetAdminWalletResponseDto>>;
    private toTransactionItemData;
}
//# sourceMappingURL=GetAdminWalletUseCase.d.ts.map