"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindNearbyDriversResponseDto = void 0;
class FindNearbyDriversResponseDto {
    constructor(drivers, totalFound, searchedAt, searchCriteria, estimatedFare) {
        this.drivers = drivers;
        this.totalFound = totalFound;
        this.searchedAt = searchedAt;
        this.searchCriteria = searchCriteria;
        this.estimatedFare = estimatedFare;
    }
    static create(drivers, totalFound, searchCriteria, fareBreakdown) {
        return new FindNearbyDriversResponseDto(drivers, totalFound, new Date(), searchCriteria, fareBreakdown);
    }
}
exports.FindNearbyDriversResponseDto = FindNearbyDriversResponseDto;
//# sourceMappingURL=FindNearbyDriversResponseDto.js.map