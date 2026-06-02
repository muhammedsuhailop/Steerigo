"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepositoryFactory = void 0;
const DITypes_1 = require("../../../shared/constants/DITypes");
const UserRepositoryImpl_1 = require("../../database/repositories/UserRepositoryImpl");
const RefreshTokenRepositoryImpl_1 = require("../../database/repositories/RefreshTokenRepositoryImpl");
const RideRequestRepositoryImpl_1 = require("../../database/repositories/RideRequestRepositoryImpl");
const RideRepositoryImpl_1 = require("../../database/repositories/RideRepositoryImpl");
const DriverLocationRepository_1 = require("../../services/DriverLocationRepository");
const PaymentRepositoryImpl_1 = require("../../database/repositories/PaymentRepositoryImpl");
const TransactionRepositoryImpl_1 = require("../../database/repositories/TransactionRepositoryImpl");
const PayoutRepositoryImpl_1 = require("../../database/repositories/PayoutRepositoryImpl");
const WalletRepositoryImpl_1 = require("../../database/repositories/WalletRepositoryImpl");
const RatingRepositoryImpl_1 = require("../../database/repositories/RatingRepositoryImpl");
const MongoUnitOfWork_1 = require("../../database/repositories/MongoUnitOfWork");
const CouponRepositoryImpl_1 = require("../../database/repositories/CouponRepositoryImpl");
const CouponUsageRepositoryImpl_1 = require("../../database/repositories/CouponUsageRepositoryImpl");
const RideRequestGroupRepositoryImpl_1 = require("../../database/repositories/RideRequestGroupRepositoryImpl");
const ChatRoomRepositoryImpl_1 = require("../../database/repositories/ChatRoomRepositoryImpl");
const MessageRepositoryImpl_1 = require("../../database/repositories/MessageRepositoryImpl");
const MessageStatusRepositoryImpl_1 = require("../../database/repositories/MessageStatusRepositoryImpl");
const UserChatRepositoryImpl_1 = require("../../database/repositories/UserChatRepositoryImpl");
class RepositoryFactory {
    static register(container) {
        container
            .bind(DITypes_1.TYPES.UserRepository)
            .to(UserRepositoryImpl_1.UserRepositoryImpl);
        container
            .bind(DITypes_1.TYPES.RefreshTokenRepository)
            .to(RefreshTokenRepositoryImpl_1.RefreshTokenRepositoryImpl);
        container
            .bind(DITypes_1.TYPES.RideRequestRepository)
            .to(RideRequestRepositoryImpl_1.RideRequestRepositoryImpl);
        container
            .bind(DITypes_1.TYPES.RideRepository)
            .to(RideRepositoryImpl_1.RideRepositoryImpl);
        container
            .bind(DITypes_1.TYPES.DriverLocationRepository)
            .to(DriverLocationRepository_1.DriverLocationRepository);
        container
            .bind(DITypes_1.TYPES.PaymentRepository)
            .to(PaymentRepositoryImpl_1.PaymentRepositoryImpl);
        container
            .bind(DITypes_1.TYPES.TransactionRepository)
            .to(TransactionRepositoryImpl_1.TransactionRepositoryImpl);
        container
            .bind(DITypes_1.TYPES.PayoutRepository)
            .to(PayoutRepositoryImpl_1.PayoutRepositoryImpl);
        container.bind(DITypes_1.TYPES.UnitOfWork).to(MongoUnitOfWork_1.MongoUnitOfWork);
        container
            .bind(DITypes_1.TYPES.WalletRepository)
            .to(WalletRepositoryImpl_1.WalletRepositoryImpl);
        container
            .bind(DITypes_1.TYPES.RatingRepository)
            .to(RatingRepositoryImpl_1.RatingRepositoryImpl);
        container
            .bind(DITypes_1.TYPES.CouponRepository)
            .to(CouponRepositoryImpl_1.CouponRepositoryImpl);
        container
            .bind(DITypes_1.TYPES.CouponUsageRepository)
            .to(CouponUsageRepositoryImpl_1.CouponUsageRepositoryImpl);
        container
            .bind(DITypes_1.TYPES.RideRequestGroupRepository)
            .to(RideRequestGroupRepositoryImpl_1.RideRequestGroupRepositoryImpl);
        container
            .bind(DITypes_1.TYPES.ChatRoomRepository)
            .to(ChatRoomRepositoryImpl_1.ChatRoomRepositoryImpl);
        container
            .bind(DITypes_1.TYPES.MessageRepository)
            .to(MessageRepositoryImpl_1.MessageRepositoryImpl);
        container
            .bind(DITypes_1.TYPES.MessageStatusRepository)
            .to(MessageStatusRepositoryImpl_1.MessageStatusRepositoryImpl);
        container
            .bind(DITypes_1.TYPES.UserChatRepository)
            .to(UserChatRepositoryImpl_1.UserChatRepositoryImpl);
    }
}
exports.RepositoryFactory = RepositoryFactory;
//# sourceMappingURL=RepositoryFactory.js.map