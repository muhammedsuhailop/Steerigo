"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BcryptAdapter = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
class BcryptAdapter {
    async hash(data, saltRounds) {
        return bcrypt_1.default.hash(data, saltRounds);
    }
    async compare(data, hashedData) {
        return bcrypt_1.default.compare(data, hashedData);
    }
}
exports.BcryptAdapter = BcryptAdapter;
//# sourceMappingURL=CryptoAdapter.js.map