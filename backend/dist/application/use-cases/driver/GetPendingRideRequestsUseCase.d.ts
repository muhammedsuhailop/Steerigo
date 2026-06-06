import { IUseCase } from "../interfaces/IUseCase";
import { GetPendingRideRequestsDto } from "../../dto/driver/GetPendingRideRequestsDto";
import { GetPendingRideRequestsResponseDto } from "../../dto/driver/GetPendingRideRequestsResponseDto";
import { IRideRequestRepository } from "../../../domain/repositories/IRideRequestRepository";
import { IDriverRepository } from "../../../domain/repositories/IDriverRepository";
import { Result } from "../../../shared/utils/Result";
export declare class GetPendingRideRequestsUseCase implements IUseCase<GetPendingRideRequestsDto, Promise<Result<GetPendingRideRequestsResponseDto>>> {
    private driverRepository;
    private rideRequestRepository;
    constructor(driverRepository: IDriverRepository, rideRequestRepository: IRideRequestRepository);
    execute(dto: GetPendingRideRequestsDto): Promise<Result<GetPendingRideRequestsResponseDto>>;
}
//# sourceMappingURL=GetPendingRideRequestsUseCase.d.ts.map