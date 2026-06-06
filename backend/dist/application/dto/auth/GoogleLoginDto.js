"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleLoginDto = void 0;
class GoogleLoginDto {
    constructor(data) {
        const input = (data ?? {});
        if (!input.code || typeof input.code !== "string") {
            throw new Error("Google login code is required");
        }
        this.code = input.code;
        this.state = typeof input.state === "string" ? input.state : undefined;
    }
}
exports.GoogleLoginDto = GoogleLoginDto;
//# sourceMappingURL=GoogleLoginDto.js.map