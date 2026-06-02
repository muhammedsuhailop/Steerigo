"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidBodyTypeError = exports.InvalidGearTypeError = exports.InvalidLimitError = exports.InvalidRadiusError = exports.InvalidTimeRequiredError = exports.InvalidSearchDateRangeError = exports.InvalidSearchDateFormatError = exports.InvalidLongitudeError = exports.InvalidLatitudeError = exports.ValidationError = void 0;
const DomainError_1 = require("./DomainError");
const ErrorType_1 = require("@shared/enums/ErrorType");
const HttpStatusCodes_1 = require("@shared/enums/HttpStatusCodes");
class ValidationError extends DomainError_1.DomainError {
    constructor(message, field) {
        super(message, "VALIDATION_ERROR", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.BAD_REQUEST,
            errorType: ErrorType_1.ErrorType.VALIDATION_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "VALIDATION",
        });
        this.field = field;
        this.name = "ValidationError";
    }
}
exports.ValidationError = ValidationError;
class InvalidLatitudeError extends ValidationError {
    constructor(message = "Latitude must be a number between -90 and 90") {
        super(message, "latitude");
        this.name = "InvalidLatitudeError";
    }
}
exports.InvalidLatitudeError = InvalidLatitudeError;
class InvalidLongitudeError extends ValidationError {
    constructor(message = "Longitude must be a number between -180 and 180") {
        super(message, "longitude");
        this.name = "InvalidLongitudeError";
    }
}
exports.InvalidLongitudeError = InvalidLongitudeError;
class InvalidSearchDateFormatError extends ValidationError {
    constructor(message = "Search date must be a valid date") {
        super(message, "searchDate");
        this.name = "InvalidSearchDateFormatError";
    }
}
exports.InvalidSearchDateFormatError = InvalidSearchDateFormatError;
class InvalidSearchDateRangeError extends ValidationError {
    constructor(message = "Search date must be in the future or current") {
        super(message, "searchDate");
        this.name = "InvalidSearchDateRangeError";
    }
}
exports.InvalidSearchDateRangeError = InvalidSearchDateRangeError;
class InvalidTimeRequiredError extends ValidationError {
    constructor(message = "Time required must be between 1 and 480 minutes") {
        super(message, "timeRequired");
        this.name = "InvalidTimeRequiredError";
    }
}
exports.InvalidTimeRequiredError = InvalidTimeRequiredError;
class InvalidRadiusError extends ValidationError {
    constructor(message = "Radius must be between 0 and 50 km") {
        super(message, "radiusKm");
        this.name = "InvalidRadiusError";
    }
}
exports.InvalidRadiusError = InvalidRadiusError;
class InvalidLimitError extends ValidationError {
    constructor(message = "Limit must be between 1 and 100") {
        super(message, "limit");
        this.name = "InvalidLimitError";
    }
}
exports.InvalidLimitError = InvalidLimitError;
class InvalidGearTypeError extends ValidationError {
    constructor(message) {
        super(message, "gearType");
        this.name = "InvalidGearTypeError";
    }
}
exports.InvalidGearTypeError = InvalidGearTypeError;
class InvalidBodyTypeError extends ValidationError {
    constructor(message) {
        super(message, "bodyType");
        this.name = "InvalidBodyTypeError";
    }
}
exports.InvalidBodyTypeError = InvalidBodyTypeError;
//# sourceMappingURL=ValidationErrors.js.map