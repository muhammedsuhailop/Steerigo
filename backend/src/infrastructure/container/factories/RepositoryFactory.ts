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
import { IUnitOfWork } from "@domain/repositories/IUnitOfWork";
import { MongoUnitOfWork } from "@infrastructure/database/repositories/MongoUnitOfWork";
import { CouponRepositoryImpl } from "@infrastructure/database/repositories/CouponRepositoryImpl";
import { ICouponRepository } from "@domain/repositories/ICouponRepository";
import { CouponUsageRepositoryImpl } from "@infrastructure/database/repositories/CouponUsageRepositoryImpl";
import { ICouponUsageRepository } from "@domain/repositories/ICouponUsageRepository";
import { IRideRequestGroupRepository } from "@domain/repositories/IRideRequestGroupRepository";
import { RideRequestGroupRepositoryImpl } from "@infrastructure/database/repositories/RideRequestGroupRepositoryImpl";
import { IChatRoomRepository } from "@domain/repositories/IChatRoomRepository";
import { ChatRoomRepositoryImpl } from "@infrastructure/database/repositories/ChatRoomRepositoryImpl";
import { IMessageRepository } from "@domain/repositories/IMessageRepository";
import { MessageRepositoryImpl } from "@infrastructure/database/repositories/MessageRepositoryImpl";
import { IMessageStatusRepository } from "@domain/repositories/IMessageStatusRepository";
import { MessageStatusRepositoryImpl } from "@infrastructure/database/repositories/MessageStatusRepositoryImpl";
import { IUserChatRepository } from "@domain/repositories/IUserChatRepository";
import { UserChatRepositoryImpl } from "@infrastructure/database/repositories/UserChatRepositoryImpl";

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
    container.bind<IUnitOfWork>(TYPES.UnitOfWork).to(MongoUnitOfWork);
    container
      .bind<IWalletRepository>(TYPES.WalletRepository)
      .to(WalletRepositoryImpl);
    container
      .bind<IRatingRepository>(TYPES.RatingRepository)
      .to(RatingRepositoryImpl);
    container
      .bind<ICouponRepository>(TYPES.CouponRepository)
      .to(CouponRepositoryImpl);
    container
      .bind<ICouponUsageRepository>(TYPES.CouponUsageRepository)
      .to(CouponUsageRepositoryImpl);
    container
      .bind<IRideRequestGroupRepository>(TYPES.RideRequestGroupRepository)
      .to(RideRequestGroupRepositoryImpl);
    container
      .bind<IChatRoomRepository>(TYPES.ChatRoomRepository)
      .to(ChatRoomRepositoryImpl);
    container
      .bind<IMessageRepository>(TYPES.MessageRepository)
      .to(MessageRepositoryImpl);
    container
      .bind<IMessageStatusRepository>(TYPES.MessageStatusRepository)
      .to(MessageStatusRepositoryImpl);
    container
      .bind<IUserChatRepository>(TYPES.UserChatRepository)
      .to(UserChatRepositoryImpl);
  }
}
