import { Request, Response } from "express";
import { IUseCase } from "../../../application/use-cases/interfaces/IUseCase";
import { Result } from "../../../shared/utils/Result";
import { AcceptRideRequestDto } from "../../../application/dto/driver/AcceptRideRequestDto";
import { AcceptRideRequestResponseDto } from "../../../application/dto/driver/AcceptRideRequestResponseDto";
import { RejectRideRequestDto } from "../../../application/dto/driver/RejectRideRequestDto";
import { RejectRideRequestResponseDto } from "../../../application/dto/driver/RejectRideRequestResponseDto";
import { GetPendingRideRequestsDto } from "../../../application/dto/driver/GetPendingRideRequestsDto";
import { GetPendingRideRequestsResponseDto } from "../../../application/dto/driver/GetPendingRideRequestsResponseDto";
import { GetDriverRidesDto } from "../../../application/dto/driver/GetDriverRidesDto";
import { GetDriverRidesResponseDto } from "../../../application/dto/driver/GetDriverRidesResponseDto";
import { GetDriverRideByIdDto } from "../../../application/dto/driver/GetDriverRideByIdDto";
import { GetDriverRideByIdResponseDto } from "../../../application/dto/driver/GetDriverRideByIdResponseDto";
export declare class DriverRideController {
    private acceptRideRequestUseCase;
    private rejectRideRequestUseCase;
    private getPendingRideRequestsUseCase;
    private getDriverRidesUseCase;
    private getDriverRideByIdUseCase;
    constructor(acceptRideRequestUseCase: IUseCase<AcceptRideRequestDto, Promise<Result<AcceptRideRequestResponseDto>>>, rejectRideRequestUseCase: IUseCase<RejectRideRequestDto, Promise<Result<RejectRideRequestResponseDto>>>, getPendingRideRequestsUseCase: IUseCase<GetPendingRideRequestsDto, Promise<Result<GetPendingRideRequestsResponseDto>>>, getDriverRidesUseCase: IUseCase<GetDriverRidesDto, Promise<Result<GetDriverRidesResponseDto>>>, getDriverRideByIdUseCase: IUseCase<GetDriverRideByIdDto, Promise<Result<GetDriverRideByIdResponseDto>>>);
    private getUserId;
    acceptRideRequest(req: Request, res: Response): Promise<void>;
    rejectRideRequest(req: Request, res: Response): Promise<void>;
    getPendingRideRequests(req: Request, res: Response): Promise<void>;
    getDriverRides(req: Request, res: Response): Promise<void>;
    getDriverRideById(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=DriverRideController.d.ts.map