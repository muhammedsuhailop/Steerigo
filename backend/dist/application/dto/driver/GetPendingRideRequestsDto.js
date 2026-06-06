"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPendingRideRequestsSchema = exports.GetPendingRideRequestsDto = void 0;
const zod_1 = require("zod");
const getPendingRideRequestsSchema = zod_1.z.object({
    limit: zod_1.z.number().positive().optional().default(10),
    offset: zod_1.z.number().min(0).optional().default(0),
});
exports.getPendingRideRequestsSchema = getPendingRideRequestsSchema;
class GetPendingRideRequestsDto {
    constructor(userId, queryData) {
        this.userId = userId;
        this.data = getPendingRideRequestsSchema.parse(queryData);
    }
    static fromRequest(userId, query) {
        return new GetPendingRideRequestsDto(userId, query);
    }
    getUserId() {
        return this.userId;
    }
    getLimit() {
        return this.data.limit;
    }
    getOffset() {
        return this.data.offset;
    }
}
exports.GetPendingRideRequestsDto = GetPendingRideRequestsDto;
//# sourceMappingURL=GetPendingRideRequestsDto.js.map