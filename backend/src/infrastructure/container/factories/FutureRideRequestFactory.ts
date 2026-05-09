import { Container } from "inversify";
import { TYPES } from "@shared/constants/DITypes";
import { IFutureRideRequestRepository } from "@domain/repositories/IFutureRideRequestRepository";
import { FutureRideRequestRepositoryImpl } from "@infrastructure/database/repositories/FutureRideRequestRepositoryImpl";

export class FutureRideRequestFactory {
  static register(container: Container): void {
    container
      .bind<IFutureRideRequestRepository>(TYPES.FutureRideRequestRepository)
      .to(FutureRideRequestRepositoryImpl);
  }
}
