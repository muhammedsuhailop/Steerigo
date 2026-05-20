import { Container } from "inversify";
import { TYPES } from "@shared/constants/DITypes";
import { IFutureRideRequestRepository } from "@domain/repositories/IFutureRideRequestRepository";
import { FutureRideRequestRepositoryImpl } from "@infrastructure/database/repositories/FutureRideRequestRepositoryImpl";
import { IUseCase } from "@application/use-cases/interfaces/IUseCase";
import { ScheduleFutureRideDto } from "@application/dto/user/ScheduleFutureRideDto";
import { Result } from "@shared/utils/Result";
import { ScheduleFutureRideResponseDto } from "@application/dto/user/ScheduleFutureRideResponseDto";
import { ScheduleFutureRideRequestUseCase } from "@application/use-cases/user/ScheduleFutureRideRequestUseCase";
import { CancelFutureRideDto } from "@application/dto/user/CancelFutureRideDto";
import { CancelFutureRideResponseDto } from "@application/dto/user/CancelFutureRideResponseDto";
import { CancelFutureRideRequestUseCase } from "@application/use-cases/user/CancelFutureRideRequestUseCase";
import { FutureRideExpiryJobData } from "@infrastructure/queues/FutureRideExpiryQueue";
import { IFutureRideExpiryService } from "@application/services/ride-search/IFutureRideExpiryService";
import { FutureRideExpiryService } from "@infrastructure/services/FutureRideExpiryService";
import { FutureRideExpiryWorker } from "@infrastructure/workers/FutureRideExpiryWorker";
import { Queue } from "bullmq";
import { AppConstants } from "@shared/constants/AppConstants";
import { getBullMQConnection } from "@infrastructure/queues/BullMQConnection";
import { AcceptFutureRideRequestDto } from "@application/dto/driver/AcceptFutureRideRequestDto";
import { AcceptFutureRideRequestResponseDto } from "@application/dto/driver/AcceptFutureRideRequestResponseDto";
import { AcceptFutureRideRequestUseCase } from "@application/use-cases/driver/AcceptFutureRideRequestUseCase";
import { DriverScheduleRideController } from "@interface/controllers/driver/DriverScheduleRideController";
import { GetFutureRideRequestsDto } from "@application/dto/driver/GetFutureRideRequestsDto";
import { GetFutureRideRequestsResponseDto } from "@application/dto/driver/GetFutureRideRequestsResponseDto";
import { GetFutureRideRequestsUseCase } from "@application/use-cases/driver/GetFutureRideRequestsUseCase";
import { RejectFutureRideRequestDto } from "@application/dto/driver/RejectFutureRideRequestDto";
import { RejectFutureRideRequestResponseDto } from "@application/dto/driver/RejectFutureRideRequestResponseDto";
import { RejectFutureRideRequestUseCase } from "@application/use-cases/driver/RejectFutureRideRequestUseCase";

export class FutureRideRequestFactory {
  static register(container: Container): void {
    container
      .bind<IFutureRideRequestRepository>(TYPES.FutureRideRequestRepository)
      .to(FutureRideRequestRepositoryImpl);

    const futureRideExpiryQueue = new Queue<FutureRideExpiryJobData>(
      AppConstants.FUTURE_RIDE_EXPIRY_QUEUE_NAME,
      { connection: getBullMQConnection() },
    );

    container
      .bind<Queue<FutureRideExpiryJobData>>(TYPES.FutureRideExpiryQueue)
      .toConstantValue(futureRideExpiryQueue);

    // Use Cases
    container
      .bind<
        IUseCase<
          ScheduleFutureRideDto,
          Promise<Result<ScheduleFutureRideResponseDto>>
        >
      >(TYPES.ScheduleFutureRideRequestUseCase)
      .to(ScheduleFutureRideRequestUseCase);

    container
      .bind<
        IUseCase<
          CancelFutureRideDto,
          Promise<Result<CancelFutureRideResponseDto>>
        >
      >(TYPES.CancelFutureRideRequestUseCase)
      .to(CancelFutureRideRequestUseCase);

    container
      .bind<
        IUseCase<
          GetFutureRideRequestsDto,
          Promise<Result<GetFutureRideRequestsResponseDto>>
        >
      >(TYPES.GetFutureRideRequestsUseCase)
      .to(GetFutureRideRequestsUseCase);

    container
      .bind<
        IUseCase<
          AcceptFutureRideRequestDto,
          Promise<Result<AcceptFutureRideRequestResponseDto>>
        >
      >(TYPES.AcceptFutureRideRequestUseCase)
      .to(AcceptFutureRideRequestUseCase);

    container
      .bind<
        IUseCase<
          RejectFutureRideRequestDto,
          Promise<Result<RejectFutureRideRequestResponseDto>>
        >
      >(TYPES.RejectFutureRideRequestUseCase)
      .to(RejectFutureRideRequestUseCase);

    container
      .bind<IFutureRideExpiryService>(TYPES.FutureRideExpiryService)
      .to(FutureRideExpiryService)
      .inSingletonScope();

    container
      .bind<FutureRideExpiryWorker>(TYPES.FutureRideExpiryWorker)
      .to(FutureRideExpiryWorker)
      .inSingletonScope();

    container
      .bind<DriverScheduleRideController>(TYPES.DriverScheduleRideController)
      .to(DriverScheduleRideController)
      .inSingletonScope();
  }
}
