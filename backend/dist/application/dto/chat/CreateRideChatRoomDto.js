"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRideChatRoomSchema = exports.CreateRideChatRoomDto = void 0;
const zod_1 = require("zod");
const createRideChatRoomSchema = zod_1.z.object({
    rideId: zod_1.z.string().trim().min(1, "Ride ID is required"),
});
exports.createRideChatRoomSchema = createRideChatRoomSchema;
class CreateRideChatRoomDto {
    constructor(userId, requestData) {
        this.userId = userId;
        this.data = createRideChatRoomSchema.parse(requestData);
    }
    static fromRequest(userId, requestData) {
        return new CreateRideChatRoomDto(userId, requestData);
    }
    getUserId() {
        return this.userId;
    }
    getRideId() {
        return this.data.rideId;
    }
}
exports.CreateRideChatRoomDto = CreateRideChatRoomDto;
//# sourceMappingURL=CreateRideChatRoomDto.js.map