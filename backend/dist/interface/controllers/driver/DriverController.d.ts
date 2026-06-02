import { Request, Response } from "express";
import { DriverRegistrationRequestDto } from "@application/dto/driver/DriverRegistrationRequestDto";
import { DriverProfileUpdateDto } from "@application/dto/driver/DriverProfileUpdateDto";
import { KYCSubmissionRequestDto } from "@application/dto/driver/KYCSubmissionRequestDto";
import { GetDriverDashboardDto } from "@application/dto/driver/GetDriverDashboardDto";
import { GetDriverProfileRequestDto } from "@application/dto/driver/GetDriverProfileRequestDto";
import { IUseCase } from "@application/use-cases/interfaces/IUseCase";
import { Result } from "@shared/utils/Result";
import { GetDriverProfileResponseDto } from "@application/dto/driver/GetDriverProfileResponseDto";
import { UpdateDriverProfileResponseDto } from "@application/dto/driver/UpdateDriverProfileResponseDto";
import { SubmitKYCResponseDto } from "@application/dto/driver/SubmitKYCResponseDto";
import { KYCResponseDto } from "@application/dto/driver/KYCResponseDto";
import { DriverDashboardResponseDto } from "@application/dto/driver/DriverDashboardResponseDto";
import { DriverStatusResponseDto } from "@application/dto/driver/DriverStatusResponseDto";
import { RegisterDriverResult } from "@application/use-cases/driver/RegisterDriverUseCase";
export declare class DriverController {
    private registerDriverUseCase;
    private getDetailedProfileUseCase;
    private updateDriverProfileUseCase;
    private SubmitKYCUseCase;
    private getKYCStatusUseCase;
    private getDashboardUseCase;
    private getStatusUseCase;
    constructor(registerDriverUseCase: IUseCase<DriverRegistrationRequestDto, Promise<Result<RegisterDriverResult>>>, getDetailedProfileUseCase: IUseCase<GetDriverProfileRequestDto, Promise<Result<GetDriverProfileResponseDto>>>, updateDriverProfileUseCase: IUseCase<DriverProfileUpdateDto, Promise<Result<UpdateDriverProfileResponseDto>>>, SubmitKYCUseCase: IUseCase<KYCSubmissionRequestDto, Promise<Result<SubmitKYCResponseDto>>>, getKYCStatusUseCase: IUseCase<string, Promise<Result<KYCResponseDto[]>>>, getDashboardUseCase: IUseCase<GetDriverDashboardDto, Promise<Result<DriverDashboardResponseDto>>>, getStatusUseCase: IUseCase<string, Promise<Result<DriverStatusResponseDto>>>);
    private getUserId;
    register(req: Request, res: Response): Promise<void>;
    updateProfile(req: Request, res: Response): Promise<void>;
    submitKYC(req: Request, res: Response): Promise<void>;
    getKYCStatus(req: Request, res: Response): Promise<void>;
    getDashboard(req: Request, res: Response): Promise<void>;
    getStatus(req: Request, res: Response): Promise<void>;
    getDetailedProfile(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=DriverController.d.ts.map