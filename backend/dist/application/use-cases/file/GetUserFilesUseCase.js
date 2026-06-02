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
exports.GetUserFilesUseCase = void 0;
const inversify_1 = require("inversify");
const Result_1 = require("@shared/utils/Result");
const Logger_1 = require("@shared/utils/Logger");
const DITypes_1 = require("@shared/constants/DITypes");
const GetUserFilesResponseDto_1 = require("@application/dto/file/GetUserFilesResponseDto");
const CloudinaryResourceDto_1 = require("@application/dto/file/CloudinaryResourceDto");
let GetUserFilesUseCase = class GetUserFilesUseCase {
    constructor(fileUploadService) {
        this.fileUploadService = fileUploadService;
    }
    async execute(userId) {
        try {
            Logger_1.Logger.info("Listing user files", { userId });
            const resources = await this.fileUploadService.listByPrefix(`steerigo/${userId}_`);
            const resourceDtos = resources.map((r) => new CloudinaryResourceDto_1.CloudinaryResourceDto(r.public_id, r.secure_url, r.format, r.bytes, r.created_at));
            return Result_1.Result.success(new GetUserFilesResponseDto_1.GetUserFilesResponseDto(resourceDtos));
        }
        catch (err) {
            Logger_1.Logger.error("GetUserFilesUseCase failed", {
                error: err.message,
            });
            return Result_1.Result.failure(err);
        }
    }
};
exports.GetUserFilesUseCase = GetUserFilesUseCase;
exports.GetUserFilesUseCase = GetUserFilesUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.FileUploadService)),
    __metadata("design:paramtypes", [Object])
], GetUserFilesUseCase);
//# sourceMappingURL=GetUserFilesUseCase.js.map