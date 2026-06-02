"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountStatusErrorFactory = void 0;
const AccountStatusError_1 = require("../AccountStatusError");
const AccountStatusMessageStrategy_1 = require("../strategies/AccountStatusMessageStrategy");
class AccountStatusErrorFactory {
    static createError(status) {
        const strategy = this.strategies.get(status) || new AccountStatusMessageStrategy_1.DefaultAccountStatusStrategy();
        const message = strategy.getMessage();
        return new AccountStatusError_1.AccountStatusError(message, status);
    }
    static registerStrategy(status, strategy) {
        this.strategies.set(status, strategy);
    }
}
exports.AccountStatusErrorFactory = AccountStatusErrorFactory;
AccountStatusErrorFactory.strategies = new Map([
    ["Suspended", new AccountStatusMessageStrategy_1.SuspendedAccountStrategy()],
    ["Blocked", new AccountStatusMessageStrategy_1.BlockedAccountStrategy()],
    ["Deactivated", new AccountStatusMessageStrategy_1.DeactivatedAccountStrategy()],
    ["Pending Verification", new AccountStatusMessageStrategy_1.PendingVerificationStrategy()],
]);
//# sourceMappingURL=AccountStatusErrorFactory.js.map