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
exports.UploadFileUseCase = void 0;
const Result_1 = require("../../../shared/utils/Result");
const Logger_1 = require("../../../shared/utils/Logger");
const DITypes_1 = require("../../../shared/constants/DITypes");
const inversify_1 = require("inversify");
const FileUploadResponseDto_1 = require("../../dto/file/FileUploadResponseDto");
let UploadFileUseCase = class UploadFileUseCase {
    constructor(_fileUploadService, _userRepository) {
        this._fileUploadService = _fileUploadService;
        this._userRepository = _userRepository;
    }
    async execute(dto) {
        try {
            Logger_1.Logger.info("Uploading file", {
                userId: dto.userId,
                purpose: dto.purpose.toString(),
            });
            const user = await this._userRepository.findById(dto.userId);
            if (!user) {
                return Result_1.Result.failure(new Error("User not found"));
            }
            const errors = dto.validate();
            if (errors.length) {
                return Result_1.Result.failure(new Error(`Validation failed: ${errors.join(", ")}`));
            }
            const { url, publicId, filename, size } = await this._fileUploadService.upload(dto.file.buffer, dto.userId, dto.purpose.toString(), dto.file.originalname);
            Logger_1.Logger.info("File uploaded", { publicId, url });
            const response = new FileUploadResponseDto_1.FileUploadResponseDto(url, publicId, filename, size, dto.file.mimetype, new Date().toISOString());
            return Result_1.Result.success(response);
        }
        catch (err) {
            Logger_1.Logger.error("UploadFileUseCase failed", {
                error: err.message,
            });
            return Result_1.Result.failure(err);
        }
    }
};
exports.UploadFileUseCase = UploadFileUseCase;
exports.UploadFileUseCase = UploadFileUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.FileUploadService)),
    __param(1, (0, inversify_1.inject)(DITypes_1.TYPES.UserRepository)),
    __metadata("design:paramtypes", [Object, Object])
], UploadFileUseCase);
//# sourceMappingURL=UploadFileUseCase.js.map