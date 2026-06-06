"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VALID_BODY_TYPES = exports.VALID_GEAR_TYPES = exports.BodyType = exports.GearType = void 0;
var GearType;
(function (GearType) {
    GearType["MANUAL"] = "Manual";
    GearType["AUTOMATIC"] = "Automatic";
})(GearType || (exports.GearType = GearType = {}));
var BodyType;
(function (BodyType) {
    BodyType["SEDAN"] = "Sedan";
    BodyType["SUV"] = "SUV";
    BodyType["HATCHBACK"] = "Hatchback";
})(BodyType || (exports.BodyType = BodyType = {}));
exports.VALID_GEAR_TYPES = Object.values(GearType);
exports.VALID_BODY_TYPES = Object.values(BodyType);
//# sourceMappingURL=VehicleType.js.map