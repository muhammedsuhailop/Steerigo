"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRideChatRoomSchema = exports.GetRideChatRoomDto = void 0;
const zod_1 = require("zod");
const getRideChatRoomSchema = zod_1.z.object({
    rideId: zod_1.z.string().trim().min(1, "Ride ID is required"),
});
exports.getRideChatRoomSchema = getRideChatRoomSchema;
class GetRideChatRoomDto {
    constructor(userId, requestData) {
        this.userId = userId;
        this.data = getRideChatRoomSchema.parse(requestData);
    }
    static fromRequest(userId, requestData) {
        return new GetRideChatRoomDto(userId, requestData);
    }
    getUserId() {
        return this.userId;
    }
    getRideId() {
        return this.data.rideId;
    }
}
exports.GetRideChatRoomDto = GetRideChatRoomDto;
//# sourceMappingURL=GetRideChatRoomDto.js.map