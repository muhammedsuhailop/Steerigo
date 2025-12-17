import { Container } from "inversify";
import { TYPES } from "@shared/constants/DITypes";
import { IUserRepository } from "@domain/repositories/IUserRepository";
import { IRefreshTokenRepository } from "@domain/repositories/IRefreshTokenRepository";
import { UserRepositoryImpl } from "@infrastructure/database/repositories/UserRepositoryImpl";
import { RefreshTokenRepositoryImpl } from "@infrastructure/database/repositories/RefreshTokenRepositoryImpl";
import { RideRequestRepositoryImpl } from "@infrastructure/database/repositories/RideRequestRepositoryImpl";
import { IRideRequestRepository } from "@domain/repositories/IRideRequestRepository";

export class RepositoryFactory {
  static register(container: Container): void {
    container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepositoryImpl);
    container
      .bind<IRefreshTokenRepository>(TYPES.RefreshTokenRepository)
      .to(RefreshTokenRepositoryImpl);
    container
      .bind<IRideRequestRepository>(TYPES.RideRequestRepository)
      .to(RideRequestRepositoryImpl);
  }
}
