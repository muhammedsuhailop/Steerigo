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
      .bind<IFutureRideExpiryService>(TYPES.FutureRideExpiryService)
      .to(FutureRideExpiryService)
      .inSingletonScope();

    container
      .bind<FutureRideExpiryWorker>(TYPES.FutureRideExpiryWorker)
      .to(FutureRideExpiryWorker)
      .inSingletonScope();
  }
}
