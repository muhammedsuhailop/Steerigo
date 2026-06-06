import { Request, Response } from "express";
import { IUseCase } from "../../../application/use-cases/interfaces/IUseCase";
import { Result } from "../../../shared/utils/Result";
import { AcceptFutureRideRequestDto } from "../../../application/dto/driver/AcceptFutureRideRequestDto";
import { AcceptFutureRideRequestResponseDto } from "../../../application/dto/driver/AcceptFutureRideRequestResponseDto";
import { GetFutureRideRequestsDto } from "../../../application/dto/driver/GetFutureRideRequestsDto";
import { GetFutureRideRequestsResponseDto } from "../../../application/dto/driver/GetFutureRideRequestsResponseDto";
import { RejectFutureRideRequestDto } from "../../../application/dto/driver/RejectFutureRideRequestDto";
import { RejectFutureRideRequestResponseDto } from "../../../application/dto/driver/RejectFutureRideRequestResponseDto";
export declare class DriverScheduleRideController {
    private readonly acceptUseCase;
    private readonly getFutureRideRequestsUseCase;
    private readonly rejectUseCase;
    constructor(acceptUseCase: IUseCase<AcceptFutureRideRequestDto, Promise<Result<AcceptFutureRideRequestResponseDto>>>, getFutureRideRequestsUseCase: IUseCase<GetFutureRideRequestsDto, Promise<Result<GetFutureRideRequestsResponseDto>>>, rejectUseCase: IUseCase<RejectFutureRideRequestDto, Promise<Result<RejectFutureRideRequestResponseDto>>>);
    private getUserId;
    getFutureRideRequests(req: Request, res: Response): Promise<void>;
    acceptFutureRideRequest(req: Request, res: Response): Promise<void>;
    rejectFutureRideRequest(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=DriverScheduleRideController.d.ts.map