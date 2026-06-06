"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NanoIdGenerator = void 0;
const inversify_1 = require("inversify");
const nanoid_1 = require("nanoid");
const nanoid = (0, nanoid_1.customAlphabet)("ABCDEFGHJKLMNPQRSTUVWXYZ23456789", 16);
let NanoIdGenerator = class NanoIdGenerator {
    generate(prefix) {
        const id = nanoid();
        return prefix ? `${prefix}-${id}` : id;
    }
};
exports.NanoIdGenerator = NanoIdGenerator;
exports.NanoIdGenerator = NanoIdGenerator = __decorate([
    (0, inversify_1.injectable)()
], NanoIdGenerator);
//# sourceMappingURL=NanoIdGenerator.js.map