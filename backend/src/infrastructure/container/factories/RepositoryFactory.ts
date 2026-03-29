import { Container } from "inversify";
import { TYPES } from "@shared/constants/DITypes";
import { IUserRepository } from "@domain/repositories/IUserRepository";
import { IRefreshTokenRepository } from "@domain/repositories/IRefreshTokenRepository";
import { UserRepositoryImpl } from "@infrastructure/database/repositories/UserRepositoryImpl";
import { RefreshTokenRepositoryImpl } from "@infrastructure/database/repositories/RefreshTokenRepositoryImpl";
import { RideRequestRepositoryImpl } from "@infrastructure/database/repositories/RideRequestRepositoryImpl";
import { IRideRequestRepository } from "@domain/repositories/IRideRequestRepository";
import { IRideRepository } from "@domain/repositories/IRideRepository";
import { RideRepositoryImpl } from "@infrastructure/database/repositories/RideRepositoryImpl";
import { IDriverLocationRepository } from "@domain/repositories/IDriverLocationRepository";
import { DriverLocationRepository } from "@infrastructure/services/DriverLocationRepository";
import { IPaymentRepository } from "@domain/repositories/IPaymentRepository";
import { PaymentRepositoryImpl } from "@infrastructure/database/repositories/PaymentRepositoryImpl";
import { ITransactionRepository } from "@domain/repositories/ITransactionRepository";
import { TransactionRepositoryImpl } from "@infrastructure/database/repositories/TransactionRepositoryImpl";
import { IPayoutRepository } from "@domain/repositories/IPayoutRepository";
import { PayoutRepositoryImpl } from "@infrastructure/database/repositories/PayoutRepositoryImpl";
import { IWalletRepository } from "@domain/repositories/IWalletRepository";
import { WalletRepositoryImpl } from "@infrastructure/database/repositories/WalletRepositoryImpl";
import { IRatingRepository } from "@domain/repositories/IRatingRepository";
import { RatingRepositoryImpl } from "@infrastructure/database/repositories/RatingRepositoryImpl";

export class RepositoryFactory {
  static register(container: Container): void {
    container
      .bind<IUserRepository>(TYPES.UserRepository)
      .to(UserRepositoryImpl);
    container
      .bind<IRefreshTokenRepository>(TYPES.RefreshTokenRepository)
      .to(RefreshTokenRepositoryImpl);
    container
      .bind<IRideRequestRepository>(TYPES.RideRequestRepository)
      .to(RideRequestRepositoryImpl);
    container
      .bind<IRideRepository>(TYPES.RideRepository)
      .to(RideRepositoryImpl);
    container
      .bind<IDriverLocationRepository>(TYPES.DriverLocationRepository)
      .to(DriverLocationRepository);
    container
      .bind<IPaymentRepository>(TYPES.PaymentRepository)
      .to(PaymentRepositoryImpl);
    container
      .bind<ITransactionRepository>(TYPES.TransactionRepository)
      .to(TransactionRepositoryImpl);
    container
      .bind<IPayoutRepository>(TYPES.PayoutRepository)
      .to(PayoutRepositoryImpl);
    container
      .bind<IWalletRepository>(TYPES.WalletRepository)
      .to(WalletRepositoryImpl);
    container
      .bind<IRatingRepository>(TYPES.RatingRepository)
      .to(RatingRepositoryImpl);
  }
}
