import { IUseCase } from "../interfaces/IUseCase";
import { GetFutureRideRequestsDto } from "@application/dto/driver/GetFutureRideRequestsDto";
import { GetFutureRideRequestsResponseDto } from "@application/dto/driver/GetFutureRideRequestsResponseDto";
import { IFutureRideRequestRepository } from "@domain/repositories/IFutureRideRequestRepository";
import { IDriverRepository } from "@domain/repositories/IDriverRepository";
import { Result } from "@shared/utils/Result";
export declare class GetFutureRideRequestsUseCase implements IUseCase<GetFutureRideRequestsDto, Promise<Result<GetFutureRideRequestsResponseDto>>> {
    private readonly driverRepository;
    private readonly futureRideRequestRepository;
    constructor(driverRepository: IDriverRepository, futureRideRequestRepository: IFutureRideRequestRepository);
    execute(dto: GetFutureRideRequestsDto): Promise<Result<GetFutureRideRequestsResponseDto>>;
}
//# sourceMappingURL=GetFutureRideRequestsUseCase.d.ts.map