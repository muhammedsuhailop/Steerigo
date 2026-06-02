import { Request, Response } from "express";
import { GetDriversRequestDto } from "../../../application/dto/admin/GetDriversRequestDto";
import { DriverActionRequestDto } from "../../../application/dto/admin/DriverActionRequestDto";
import { GetDriverProfileRequestDto } from "../../../application/dto/admin/GetDriverProfileRequestDto";
import { GetKycRequestsRequestDto } from "../../../application/dto/admin/GetKycRequestsRequestDto";
import { UpdateKycStatusRequestDto } from "../../../application/dto/admin/UpdateKycStatusRequestDto";
import { GetKycRequestByIdRequestDto } from "../../../application/dto/admin/GetKycRequestByIdRequestDto";
import { UpdateDriverKycStatusRequestDto } from "../../../application/dto/admin/UpdateDriverKycStatusRequestDto";
import { IUseCase } from "../../../application/use-cases/interfaces/IUseCase";
import { Result } from "../../../shared/utils/Result";
import { AdminGetDriverProfileResponseDto, GetDriversResponseDto } from "../../../application/dto/admin";
import { GetKycRequestByIdResponseDto } from "../../../application/dto/admin/GetKycRequestByIdResponseDto";
import { GetKycRequestsResponseDto } from "../../../application/dto/admin/GetKycRequestsResponseDto";
import { UpdateDriverKycStatusResponseDto } from "../../../application/dto/admin/UpdateDriverKycStatusResponseDto";
import { KycDocumentResponseDto } from "../../../application/dto/admin/KycDocumentResponseDto";
export declare class AdminDriverController {
    private getDriversUseCase;
    private driverActionUseCase;
    private getDriverProfileUseCase;
    private getKycRequestsUseCase;
    private updateKycStatusUseCase;
    private getKycRequestByIdUseCase;
    private updateDriverKycStatusUseCase;
    constructor(getDriversUseCase: IUseCase<GetDriversRequestDto, Promise<Result<GetDriversResponseDto>>>, driverActionUseCase: IUseCase<DriverActionRequestDto, Promise<Result<{
        message: string;
        driverId: string;
        newStatus: string;
    }>>>, getDriverProfileUseCase: IUseCase<GetDriverProfileRequestDto, Promise<Result<AdminGetDriverProfileResponseDto>>>, getKycRequestsUseCase: IUseCase<GetKycRequestsRequestDto, Promise<Result<GetKycRequestsResponseDto>>>, updateKycStatusUseCase: IUseCase<UpdateKycStatusRequestDto, Promise<Result<{
        message: string;
        kycDocument: KycDocumentResponseDto;
        driverKycStatusUpdated: boolean;
    }>>>, getKycRequestByIdUseCase: IUseCase<GetKycRequestByIdRequestDto, Promise<Result<GetKycRequestByIdResponseDto>>>, updateDriverKycStatusUseCase: IUseCase<UpdateDriverKycStatusRequestDto, Promise<Result<UpdateDriverKycStatusResponseDto>>>);
    getDrivers(req: Request, res: Response): Promise<void>;
    driverAction(req: Request, res: Response): Promise<void>;
    getDriverProfile(req: Request, res: Response): Promise<void>;
    getKycRequests(req: Request, res: Response): Promise<void>;
    updateKycStatus(req: Request, res: Response): Promise<void>;
    getKycRequestById(req: Request, res: Response): Promise<void>;
    updateDriverKycStatus(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=AdminDriverController.d.ts.map