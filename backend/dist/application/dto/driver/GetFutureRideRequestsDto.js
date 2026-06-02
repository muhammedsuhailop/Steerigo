"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFutureRideRequestsDtoSchema = exports.GetFutureRideRequestsDto = void 0;
const zod_1 = require("zod");
const FutureRideRequestStatus_1 = require("../../../domain/value-objects/FutureRideRequestStatus");
const getFutureRideRequestsDtoSchema = zod_1.z.object({
    status: zod_1.z.nativeEnum(FutureRideRequestStatus_1.FutureRideRequestStatus).optional(),
    page: zod_1.z.coerce.number().int().positive().optional().default(1),
    limit: zod_1.z.coerce.number().int().positive().max(100).optional().default(10),
});
exports.getFutureRideRequestsDtoSchema = getFutureRideRequestsDtoSchema;
class GetFutureRideRequestsDto {
    constructor(userId, queryData) {
        this.userId = userId;
        this.data = getFutureRideRequestsDtoSchema.parse(queryData);
    }
    static fromRequest(userId, query) {
        return new GetFutureRideRequestsDto(userId, query);
    }
    getUserId() {
        return this.userId;
    }
    getStatus() {
        return this.data.status;
    }
    getPage() {
        return this.data.page;
    }
    getLimit() {
        return this.data.limit;
    }
    getOffset() {
        return (this.getPage() - 1) * this.getLimit();
    }
}
exports.GetFutureRideRequestsDto = GetFutureRideRequestsDto;
//# sourceMappingURL=GetFutureRideRequestsDto.js.map