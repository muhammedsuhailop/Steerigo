"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultAccountStatusStrategy = exports.PendingVerificationStrategy = exports.DeactivatedAccountStrategy = exports.BlockedAccountStrategy = exports.SuspendedAccountStrategy = void 0;
const AuthConstants_1 = require("../../../shared/constants/AuthConstants");
class SuspendedAccountStrategy {
    getMessage() {
        return AuthConstants_1.AuthMessages.ACCOUNT_SUSPENDED;
    }
}
exports.SuspendedAccountStrategy = SuspendedAccountStrategy;
class BlockedAccountStrategy {
    getMessage() {
        return AuthConstants_1.AuthMessages.ACCOUNT_BLOCKED;
    }
}
exports.BlockedAccountStrategy = BlockedAccountStrategy;
class DeactivatedAccountStrategy {
    getMessage() {
        return AuthConstants_1.AuthMessages.ACCOUNT_DEACTIVATED;
    }
}
exports.DeactivatedAccountStrategy = DeactivatedAccountStrategy;
class PendingVerificationStrategy {
    getMessage() {
        return AuthConstants_1.AuthMessages.ACCOUNT_NOT_VERIFIED;
    }
}
exports.PendingVerificationStrategy = PendingVerificationStrategy;
class DefaultAccountStatusStrategy {
    getMessage() {
        return AuthConstants_1.AuthMessages.ACCOUNT_DEFAULT;
    }
}
exports.DefaultAccountStatusStrategy = DefaultAccountStatusStrategy;
//# sourceMappingURL=AccountStatusMessageStrategy.js.map