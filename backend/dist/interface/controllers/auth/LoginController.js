"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginController = void 0;
const inversify_1 = require("inversify");
const UserAuthController_1 = require("./UserAuthController");
const TokenController_1 = require("./TokenController");
const DITypes_1 = require("@shared/constants/DITypes");
let LoginController = class LoginController {
    constructor(userAuthController, tokenController) {
        this.userAuthController = userAuthController;
        this.tokenController = tokenController;
    }
    async login(req, res) {
        return this.userAuthController.login(req, res);
    }
    async logout(req, res) {
        return this.tokenController.logout(req, res);
    }
    async refreshToken(req, res) {
        return this.tokenController.refreshToken(req, res);
    }
};
exports.LoginController = LoginController;
exports.LoginController = LoginController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.UserAuthController)),
    __param(1, (0, inversify_1.inject)(DITypes_1.TYPES.TokenController)),
    __metadata("design:paramtypes", [UserAuthController_1.UserAuthController,
        TokenController_1.TokenController])
], LoginController);
//# sourceMappingURL=LoginController.js.map