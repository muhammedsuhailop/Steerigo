"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UuidGenerator = void 0;
const uuid_1 = require("uuid");
class UuidGenerator {
    generate() {
        return (0, uuid_1.v4)();
    }
}
exports.UuidGenerator = UuidGenerator;
//# sourceMappingURL=UuidGenerator.js.map