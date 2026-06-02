"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.canUserLogin = exports.isActiveStatus = exports.UserStatus = void 0;
var UserStatus;
(function (UserStatus) {
    UserStatus["PENDING_VERIFICATION"] = "Pending Verification";
    UserStatus["ACTIVE"] = "Active";
    UserStatus["SUSPENDED"] = "Suspended";
    UserStatus["BLOCKED"] = "Blocked";
    UserStatus["DEACTIVATED"] = "Deactivated";
})(UserStatus || (exports.UserStatus = UserStatus = {}));
// Helper functions
const isActiveStatus = (status) => {
    return status === UserStatus.ACTIVE;
};
exports.isActiveStatus = isActiveStatus;
const canUserLogin = (status, isVerified) => {
    return isVerified && (0, exports.isActiveStatus)(status);
};
exports.canUserLogin = canUserLogin;
//# sourceMappingURL=UserStatus.js.map