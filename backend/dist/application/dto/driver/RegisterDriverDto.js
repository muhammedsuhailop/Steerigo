"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterDriverDto = void 0;
class RegisterDriverDto {
    constructor(data) {
        const input = (data ?? {});
        // Basic information
        this.name = input.name ?? "";
        this.mobile = input.mobile ?? "";
        this.dob = input.dob ?? "";
        this.gender = input.gender ?? "";
        this.state = input.state ?? "";
        this.pin = input.pin ?? "";
        this.address = input.address ?? "";
        // Array parsing helper
        const parseArray = (value) => {
            if (Array.isArray(value))
                return value;
            if (typeof value === "string") {
                try {
                    return JSON.parse(value);
                }
                catch {
                    return [];
                }
            }
            return [];
        };
        // Handle JSON/array fields
        this.bodyTypes = parseArray(input.bodyTypes);
        this.gearTypes = parseArray(input.gearTypes);
        this.licenseCategory = parseArray(input.licenseCategory);
        this.licenseNumber = input.licenseNumber ?? "";
        this.licenseIssueDate = input.licenseIssueDate ?? "";
        this.licenseExpiryDate = input.licenseExpiryDate ?? "";
        this.idType = input.idType ?? "DrivingLicense";
        this.idNumber = input.idNumber ?? "";
        this.idIssueDate = input.idIssueDate ?? "";
        this.idExpiryDate = input.idExpiryDate ?? "";
        this.licenseFrontImage = input.licenseFrontImage ?? "";
        this.licenseBackImage = input.licenseBackImage ?? "";
        this.idFrontImage = input.idFrontImage ?? "";
        this.idBackImage = input.idBackImage ?? "";
    }
    getFullAddress() {
        return `${this.address}, ${this.state}, ${this.pin}`;
    }
}
exports.RegisterDriverDto = RegisterDriverDto;
//# sourceMappingURL=RegisterDriverDto.js.map