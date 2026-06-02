import { Request, Response } from "express";
import { AutoSearchAndRequestDto } from "../../../application/dto/user/AutoSearchAndRequestDto";
import { IUseCase } from "../../../application/use-cases/interfaces/IUseCase";
import { AutoSearchAndRequestResponseDto } from "../../../application/dto/user/AutoSearchAndRequestResponseDto";
import { Result } from "../../../shared/utils/Result";
import { CancelRideRequestDto } from "../../../application/dto/user/CancelRideRequestDto";
import { CancelRideRequestResponseDto } from "../../../application/dto/user/CancelRideRequestResponseDto";
import { ScheduleFutureRideDto } from "../../../application/dto/user/ScheduleFutureRideDto";
import { ScheduleFutureRideResponseDto } from "../../../application/dto/user/ScheduleFutureRideResponseDto";
import { CancelFutureRideDto } from "../../../application/dto/user/CancelFutureRideDto";
import { CancelFutureRideResponseDto } from "../../../application/dto/user/CancelFutureRideResponseDto";
export declare class AutoRideController {
    private autoSearchAndSendUseCase;
    private readonly cancelRideRequestsUseCase;
    private readonly scheduleUseCase;
    private readonly cancelUseCase;
    constructor(autoSearchAndSendUseCase: IUseCase<AutoSearchAndRequestDto, Promise<Result<AutoSearchAndRequestResponseDto>>>, cancelRideRequestsUseCase: IUseCase<CancelRideRequestDto, Promise<Result<CancelRideRequestResponseDto>>>, scheduleUseCase: IUseCase<ScheduleFutureRideDto, Promise<Result<ScheduleFutureRideResponseDto>>>, cancelUseCase: IUseCase<CancelFutureRideDto, Promise<Result<CancelFutureRideResponseDto>>>);
    private getUserId;
    autoSearchAndSendRequests(req: Request, res: Response): Promise<void>;
    cancelRideRequests(req: Request, res: Response): Promise<void>;
    scheduleFutureRide(req: Request, res: Response): Promise<void>;
    cancelFutureRide(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=AutoRideController.d.ts.map