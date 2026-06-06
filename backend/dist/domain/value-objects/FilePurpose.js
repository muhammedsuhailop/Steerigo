"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilePurpose = exports.FilePurposeEnum = void 0;
var FilePurposeEnum;
(function (FilePurposeEnum) {
    FilePurposeEnum["AVATAR"] = "avatar";
    FilePurposeEnum["LICENSE_FRONT"] = "licenseFront";
    FilePurposeEnum["LICENSE_BACK"] = "licenseBack";
    FilePurposeEnum["INSURANCE"] = "insurance";
    FilePurposeEnum["KYC_DOC_FRONT"] = "kycdocFront";
    FilePurposeEnum["KYC_DOC_BACK"] = "kycdocBack";
    FilePurposeEnum["PROFILE"] = "profile";
    FilePurposeEnum["DOCUMENT"] = "document";
})(FilePurposeEnum || (exports.FilePurposeEnum = FilePurposeEnum = {}));
class FilePurpose {
    constructor(value) {
        this.value = value;
    }
    static create(purpose) {
        const validPurpose = Object.values(FilePurposeEnum).find((p) => p === purpose);
        if (!validPurpose) {
            throw new Error(`Invalid file purpose: ${purpose}. Allowed values: ${Object.values(FilePurposeEnum).join(", ")}`);
        }
        return new FilePurpose(validPurpose);
    }
    getValue() {
        return this.value;
    }
    toString() {
        return this.value;
    }
    equals(other) {
        return this.value === other.value;
    }
    static getAllowedPurposes() {
        return Object.values(FilePurposeEnum);
    }
}
exports.FilePurpose = FilePurpose;
//# sourceMappingURL=FilePurpose.js.map