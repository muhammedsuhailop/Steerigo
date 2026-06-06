import { Request, Response } from "express";
import { ScheduleRecurringAvailabilityRequestDto, UpdateStatusRequestDto, UpdateLocationRequestDto } from "../../../application/dto/driver";
import { IUseCase } from "../../../application/use-cases/interfaces/IUseCase";
import { Result } from "../../../shared/utils/Result";
import { DriverAvailabilityResponseDto } from "../../../application/dto/driver/DriverAvailabilityResponseDto";
import { UpdateAvailabilityStatusResponseDto } from "../../../application/dto/driver/UpdateAvailabilityStatusResponseDto";
import { UpdateDriverLocationResponseDto } from "../../../application/dto/driver/UpdateDriverLocationResponseDto";
import { AddAvailabilityExceptionRequestDto } from "../../../application/dto/driver/AddAvailabilityExceptionRequestDto";
import { AddAvailabilityExceptionResponseDto } from "../../../application/dto/driver/AddAvailabilityExceptionResponseDto";
import { EditAvailabilityExceptionRequestDto } from "../../../application/dto/driver/EditAvailabilityExceptionRequestDto";
import { EditAvailabilityExceptionResponseDto } from "../../../application/dto/driver/EditAvailabilityExceptionResponseDto";
import { RemoveAvailabilityExceptionRequestDto } from "../../../application/dto/driver/RemoveAvailabilityExceptionRequestDto";
import { RemoveAvailabilityExceptionResponseDto } from "../../../application/dto/driver/RemoveAvailabilityExceptionResponseDto";
import { UpdateBaseLocationRequestDto } from "../../../application/dto/driver/UpdateBaseLocationRequestDto";
import { UpdateDriverBaseLocationResponseDto } from "../../../application/dto/driver/UpdateDriverBaseLocationResponseDto";
export declare class DriverAvailabilityController {
    private scheduleAvailabilityUseCase;
    private updateStatusUseCase;
    private updateLocationUseCase;
    private addExceptionUseCase;
    private editExceptionUseCase;
    private removeExceptionUseCase;
    private readonly updateBaseLocationUseCase;
    constructor(scheduleAvailabilityUseCase: IUseCase<ScheduleRecurringAvailabilityRequestDto, Promise<Result<DriverAvailabilityResponseDto>>>, updateStatusUseCase: IUseCase<UpdateStatusRequestDto, Promise<Result<UpdateAvailabilityStatusResponseDto>>>, updateLocationUseCase: IUseCase<UpdateLocationRequestDto, Promise<Result<UpdateDriverLocationResponseDto>>>, addExceptionUseCase: IUseCase<AddAvailabilityExceptionRequestDto, Promise<Result<AddAvailabilityExceptionResponseDto>>>, editExceptionUseCase: IUseCase<EditAvailabilityExceptionRequestDto, Promise<Result<EditAvailabilityExceptionResponseDto>>>, removeExceptionUseCase: IUseCase<RemoveAvailabilityExceptionRequestDto, Promise<Result<RemoveAvailabilityExceptionResponseDto>>>, updateBaseLocationUseCase: IUseCase<UpdateBaseLocationRequestDto, Promise<Result<UpdateDriverBaseLocationResponseDto>>>);
    scheduleAvailability(req: Request, res: Response): Promise<void>;
    updateStatus(req: Request, res: Response): Promise<void>;
    updateLocation(req: Request, res: Response): Promise<void>;
    addException(req: Request, res: Response): Promise<void>;
    editException(req: Request, res: Response): Promise<void>;
    removeException(req: Request, res: Response): Promise<void>;
    updateBaseLocation(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=DriverAvailabilityController.d.ts.map