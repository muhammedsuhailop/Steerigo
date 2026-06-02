"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverSearchFiltersDto = void 0;
class DriverSearchFiltersDto {
    constructor(gearType, bodyType, minRating) {
        this.gearType = gearType;
        this.bodyType = bodyType;
        this.minRating = minRating;
    }
    hasFilters() {
        return ((this.gearType && this.gearType.trim().length > 0) ||
            (this.bodyType && this.bodyType.trim().length > 0) ||
            this.minRating !== undefined);
    }
    validate() {
        const errors = [];
        if (this.minRating !== undefined) {
            if (typeof this.minRating !== "number" ||
                this.minRating < 0 ||
                this.minRating > 5) {
                errors.push("Minimum rating must be between 0 and 5");
            }
        }
        return errors;
    }
}
exports.DriverSearchFiltersDto = DriverSearchFiltersDto;
//# sourceMappingURL=DriverSearchFiltersDto.js.map