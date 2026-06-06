"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoIdGenerator = void 0;
const mongoose_1 = require("mongoose");
class MongoIdGenerator {
    generate() {
        return new mongoose_1.Types.ObjectId().toString();
    }
}
exports.MongoIdGenerator = MongoIdGenerator;
//# sourceMappingURL=MongoIdGenerator.js.map