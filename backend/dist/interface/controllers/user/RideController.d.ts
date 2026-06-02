import { Request, Response } from "express";
import { SendRideRequestDto } from "@application/dto/user/SendRideRequestDto";
import { IUseCase } from "@application/use-cases/interfaces/IUseCase";
import { Result } from "@shared/utils/Result";
import { SendRideRequestResponseDto } from "@application/dto/user/SendRideRequestResponseDto";
import { GetUserRideByIdDto } from "@application/dto/user/GetUserRideByIdDto";
import { GetUserRideByIdResponseDto } from "@application/dto/user/GetUserRideByIdResponseDto";
import { GetUserRidesDto } from "@application/dto/user/GetUserRidesDto";
import { GetUserRidesResponseDto } from "@application/dto/user/GetUserRidesResponseDto";
import { CancelRideDto } from "@application/dto/user/CancelRideDto";
import { CancelRideResponseDto } from "@application/dto/user/CancelRideResponseDto";
import { RateDriverDto } from "@application/dto/user/RateDriverDto";
import { RateDriverResponseDto } from "@application/dto/user/RateDriverResponseDto";
export declare class RideController {
    private sendRideRequestUseCase;
    private getUserRideByIdUseCase;
    private readonly getUserRidesUseCase;
    private readonly cancelRideUseCase;
    private readonly rateDriverUseCase;
    constructor(sendRideRequestUseCase: IUseCase<SendRideRequestDto, Promise<Result<SendRideRequestResponseDto>>>, getUserRideByIdUseCase: IUseCase<GetUserRideByIdDto, Promise<Result<GetUserRideByIdResponseDto>>>, getUserRidesUseCase: IUseCase<GetUserRidesDto, Promise<Result<GetUserRidesResponseDto>>>, cancelRideUseCase: IUseCase<CancelRideDto, Promise<Result<CancelRideResponseDto>>>, rateDriverUseCase: IUseCase<RateDriverDto, Promise<Result<RateDriverResponseDto>>>);
    private getUserId;
    sendRideRequest(req: Request, res: Response): Promise<void>;
    getUserRideById(req: Request, res: Response): Promise<void>;
    getUserRides(req: Request, res: Response): Promise<void>;
    cancelRide(req: Request, res: Response): Promise<void>;
    rateDriver(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=RideController.d.ts.map