"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toObjectId = toObjectId;
exports.toObjectIdOrNull = toObjectIdOrNull;
exports.toStringId = toStringId;
const mongoose_1 = require("mongoose");
// Convert a value (string | Types.ObjectId) to a mongoose ObjectId.
function toObjectId(value) {
    if (value instanceof mongoose_1.Types.ObjectId)
        return value;
    if (typeof value === "string") {
        if (/^[0-9a-fA-F]{24}$/.test(value)) {
            return new mongoose_1.Types.ObjectId(value);
        }
        return new mongoose_1.Types.ObjectId(value);
    }
    throw new TypeError("Invalid id: expected string or Types.ObjectId");
}
// Convert value to Types.ObjectId or return null for null/undefined.
function toObjectIdOrNull(value) {
    if (value == null)
        return null;
    try {
        return toObjectId(value);
    }
    catch {
        return null;
    }
}
// Convert persistence id (Types.ObjectId | string) to domain string id.
function toStringId(value) {
    if (value instanceof mongoose_1.Types.ObjectId)
        return value.toHexString();
    if (typeof value === "string")
        return value;
    throw new TypeError("Invalid id: expected Types.ObjectId or string");
}
//# sourceMappingURL=idHelper.js.map