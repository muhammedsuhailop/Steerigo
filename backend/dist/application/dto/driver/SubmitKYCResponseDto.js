"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubmitKYCResponseDto = exports.KycDocumentsDto = void 0;
class KycDocumentsDto {
    constructor(license, id) {
        this.license = license;
        this.id = id;
    }
}
exports.KycDocumentsDto = KycDocumentsDto;
class SubmitKYCResponseDto {
    constructor(message, kycDocuments, licenseUpdated, idUpdated, driverUpdated) {
        this.message = message;
        this.kycDocuments = kycDocuments;
        this.licenseUpdated = licenseUpdated;
        this.idUpdated = idUpdated;
        this.driverUpdated = driverUpdated;
    }
}
exports.SubmitKYCResponseDto = SubmitKYCResponseDto;
//# sourceMappingURL=SubmitKYCResponseDto.js.map