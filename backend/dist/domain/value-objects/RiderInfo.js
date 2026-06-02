"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RiderInfoValueObject = void 0;
class RiderInfoValueObject {
    constructor(userId, name, mobile) {
        this.userId = userId;
        this.name = name;
        this.mobile = mobile;
    }
    static create(userId, name, mobile) {
        if (!userId || !name || !mobile) {
            throw new Error("All rider info fields are required");
        }
        return new RiderInfoValueObject(userId, name, mobile);
    }
    getId() {
        return this.userId;
    }
    getName() {
        return this.name;
    }
    getMobile() {
        return this.mobile;
    }
    toObject() {
        return {
            userId: this.userId,
            name: this.name,
            mobile: this.mobile,
        };
    }
}
exports.RiderInfoValueObject = RiderInfoValueObject;
//# sourceMappingURL=RiderInfo.js.map