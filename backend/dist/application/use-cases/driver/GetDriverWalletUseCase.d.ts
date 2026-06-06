import { IUseCase } from "../interfaces/IUseCase";
import { GetDriverWalletDto } from "../../dto/driver/GetDriverWalletDto";
import { GetDriverWalletResponseDto } from "../../dto/driver/GetDriverWalletResponseDto";
import { IWalletRepository } from "../../../domain/repositories/IWalletRepository";
import { ITransactionRepository } from "../../../domain/repositories/ITransactionRepository";
import { IDriverRepository } from "../../../domain/repositories/IDriverRepository";
import { Result } from "../../../shared/utils/Result";
import { IIdGenerator } from "../../services/IIdGenerator";
export declare class GetDriverWalletUseCase implements IUseCase<GetDriverWalletDto, Promise<Result<GetDriverWalletResponseDto>>> {
    private readonly driverRepository;
    private readonly walletRepository;
    private readonly transactionRepository;
    private readonly idGenerator;
    constructor(driverRepository: IDriverRepository, walletRepository: IWalletRepository, transactionRepository: ITransactionRepository, idGenerator: IIdGenerator);
    execute(dto: GetDriverWalletDto): Promise<Result<GetDriverWalletResponseDto>>;
    private toTransactionItemData;
}
//# sourceMappingURL=GetDriverWalletUseCase.d.ts.map