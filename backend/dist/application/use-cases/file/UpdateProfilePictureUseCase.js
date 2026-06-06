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
exports.UpdateProfilePictureUseCase = void 0;
const Result_1 = require("../../../shared/utils/Result");
const Logger_1 = require("../../../shared/utils/Logger");
const DITypes_1 = require("../../../shared/constants/DITypes");
const inversify_1 = require("inversify");
const UpdateProfilePictureResponseDto_1 = require("../../dto/file/UpdateProfilePictureResponseDto");
let UpdateProfilePictureUseCase = class UpdateProfilePictureUseCase {
    constructor(_fileUploadService, _userRepository) {
        this._fileUploadService = _fileUploadService;
        this._userRepository = _userRepository;
    }
    async execute(dto) {
        try {
            Logger_1.Logger.info("Updating profile picture", { userId: dto.userId });
            const errors = dto.validate();
            if (errors.length) {
                return Result_1.Result.failure(new Error(`Validation failed: ${errors.join(", ")}`));
            }
            const user = await this._userRepository.findById(dto.userId);
            if (!user) {
                return Result_1.Result.failure(new Error("User not found"));
            }
            const { url, publicId } = await this._fileUploadService.upload(dto.file.buffer, dto.userId, dto.purpose.getValue(), dto.file.originalname);
            await this._userRepository.updateById(dto.userId, {
                profilePicture: url,
            });
            user.updateProfilePicture(url);
            Logger_1.Logger.info("Profile picture updated successfully", {
                userId: dto.userId,
                publicId,
                url,
            });
            const response = new UpdateProfilePictureResponseDto_1.UpdateProfilePictureResponseDto(url, publicId, dto.userId, new Date().toISOString());
            return Result_1.Result.success(response);
        }
        catch (err) {
            Logger_1.Logger.error("UpdateProfilePictureUseCase failed", {
                userId: dto.userId,
                error: err.message,
            });
            return Result_1.Result.failure(err);
        }
    }
};
exports.UpdateProfilePictureUseCase = UpdateProfilePictureUseCase;
exports.UpdateProfilePictureUseCase = UpdateProfilePictureUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.FileUploadService)),
    __param(1, (0, inversify_1.inject)(DITypes_1.TYPES.UserRepository)),
    __metadata("design:paramtypes", [Object, Object])
], UpdateProfilePictureUseCase);
//# sourceMappingURL=UpdateProfilePictureUseCase.js.map