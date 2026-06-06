"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminAction = exports.AdminUserAction = void 0;
var AdminUserAction;
(function (AdminUserAction) {
    AdminUserAction["ACTIVATE"] = "activate";
    AdminUserAction["DEACTIVATE"] = "deactivate";
    AdminUserAction["SUSPEND"] = "suspend";
    AdminUserAction["DELETE"] = "delete";
})(AdminUserAction || (exports.AdminUserAction = AdminUserAction = {}));
class AdminAction {
    constructor(value) {
        this.value = value;
    }
    static create(action) {
        if (!Object.values(AdminUserAction).includes(action)) {
            throw new Error(`Invalid admin action: ${action}`);
        }
        return new AdminAction(action);
    }
    getValue() {
        return this.value;
    }
    isDestructive() {
        return (this.value === AdminUserAction.DELETE ||
            this.value === AdminUserAction.SUSPEND);
    }
}
exports.AdminAction = AdminAction;
//# sourceMappingURL=AdminAction.js.map