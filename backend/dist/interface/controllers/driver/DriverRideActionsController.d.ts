import { Request, Response } from "express";
import { IUseCase } from "../../../application/use-cases/interfaces/IUseCase";
import { Result } from "../../../shared/utils/Result";
import { MarkRideAsArrivedDto } from "../../../application/dto/driver/MarkRideAsArrivedDto";
import { MarkRideAsArrivedResponseDto } from "../../../application/dto/driver/MarkRideAsArrivedResponseDto";
import { MarkRideAsStartedDto } from "../../../application/dto/driver/MarkRideAsStartedDto";
import { MarkRideAsStartedResponseDto } from "../../../application/dto/driver/MarkRideAsStartedResponseDto";
import { MarkRideAsCompletedDto } from "../../../application/dto/driver/MarkRideAsCompletedDto";
import { MarkRideAsCompletedResponseDto } from "../../../application/dto/driver/MarkRideAsCompletedResponseDto";
import { DriverCancelRideDto } from "../../../application/dto/driver/DriverCancelRideDto";
import { DriverCancelRideResponseDto } from "../../../application/dto/driver/DriverCancelRideResponseDto";
export declare class DriverRideActionsController {
    private markRideAsArrivedUseCase;
    private markRideAsStartedUseCase;
    private markRideAsCompletedUseCase;
    private readonly driverCancelRideUseCase;
    constructor(markRideAsArrivedUseCase: IUseCase<MarkRideAsArrivedDto, Promise<Result<MarkRideAsArrivedResponseDto>>>, markRideAsStartedUseCase: IUseCase<MarkRideAsStartedDto, Promise<Result<MarkRideAsStartedResponseDto>>>, markRideAsCompletedUseCase: IUseCase<MarkRideAsCompletedDto, Promise<Result<MarkRideAsCompletedResponseDto>>>, driverCancelRideUseCase: IUseCase<DriverCancelRideDto, Promise<Result<DriverCancelRideResponseDto>>>);
    private getUserId;
    markRideAsArrived(req: Request, res: Response): Promise<void>;
    markRideAsStarted(req: Request, res: Response): Promise<void>;
    markRideAsCompleted(req: Request, res: Response): Promise<void>;
    cancelRide(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=DriverRideActionsController.d.ts.map