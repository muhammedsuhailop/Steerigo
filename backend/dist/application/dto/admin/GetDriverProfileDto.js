"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetDriverProfileDto = void 0;
class GetDriverProfileDto {
    constructor(data) {
        this.driverId = data.driverId;
    }
    validate() {
        const errors = [];
        if (!this.driverId) {
            errors.push("Driver ID is required");
        }
        return errors;
    }
}
exports.GetDriverProfileDto = GetDriverProfileDto;
//# sourceMappingURL=GetDriverProfileDto.js.map