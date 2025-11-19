import { Container } from "inversify";
import { TYPES } from "@shared/constants/DITypes";
import { UserRepository } from "@application/repositories/UserRepository";
import { RefreshTokenRepository } from "@application/repositories/RefreshTokenRepository";
import { UserRepositoryImpl } from "@infrastructure/database/repositories/UserRepositoryImpl";
import { RefreshTokenRepositoryImpl } from "@infrastructure/database/repositories/RefreshTokenRepositoryImpl";
import { RideRequestRepositoryImpl } from "@infrastructure/database/repositories/RideRequestRepositoryImpl";
import { RideRequestRepository } from "@application/repositories/RideRequestRepository";

export class RepositoryFactory {
  static register(container: Container): void {
    container.bind<UserRepository>(TYPES.UserRepository).to(UserRepositoryImpl);
    container
      .bind<RefreshTokenRepository>(TYPES.RefreshTokenRepository)
      .to(RefreshTokenRepositoryImpl);
    container
      .bind<RideRequestRepository>(TYPES.RideRequestRepository)
      .to(RideRequestRepositoryImpl);
  }
}
