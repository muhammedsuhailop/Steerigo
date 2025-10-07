import { Container } from "inversify";
import { TYPES } from "@shared/constants/DITypes";
import { UserRepository } from "@application/repositories/UserRepository";
import { RefreshTokenRepository } from "@application/repositories/RefreshTokenRepository";
import { UserRepositoryImpl } from "@infrastructure/database/repositories/UserRepositoryImpl";
import { RefreshTokenRepositoryImpl } from "@infrastructure/database/repositories/RefreshTokenRepositoryImpl";

export class RepositoryFactory {
  static register(container: Container): void {
    container.bind<UserRepository>(TYPES.UserRepository).to(UserRepositoryImpl);
    container
      .bind<RefreshTokenRepository>(TYPES.RefreshTokenRepository)
      .to(RefreshTokenRepositoryImpl);
  }
}
