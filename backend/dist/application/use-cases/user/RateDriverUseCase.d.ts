import { IUseCase } from "../interfaces/IUseCase";
import { Result } from "@shared/utils/Result";
import { IRideRepository } from "@domain/repositories/IRideRepository";
import { IDriverRepository } from "@domain/repositories/IDriverRepository";
import { IRatingRepository } from "@domain/repositories/IRatingRepository";
import { RateDriverDto } from "@application/dto/user/RateDriverDto";
import { RateDriverResponseDto } from "@application/dto/user/RateDriverResponseDto";
import { IUserRepository } from "@domain/repositories";
import { IIdGenerator } from "@application/services/IIdGenerator";
import { IUnitOfWork } from "@domain/repositories/IUnitOfWork";
export declare class RateDriverUseCase implements IUseCase<RateDriverDto, Promise<Result<RateDriverResponseDto>>> {
    private readonly rideRepository;
    private readonly driverRepository;
    private readonly ratingRepository;
    private readonly userRepository;
    private readonly idGenerator;
    private readonly unitOfWork;
    constructor(rideRepository: IRideRepository, driverRepository: IDriverRepository, ratingRepository: IRatingRepository, userRepository: IUserRepository, idGenerator: IIdGenerator, unitOfWork: IUnitOfWork);
    execute(dto: RateDriverDto): Promise<Result<RateDriverResponseDto>>;
}
//# sourceMappingURL=RateDriverUseCase.d.ts.map