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
exports.FileController = void 0;
const inversify_1 = require("inversify");
const FileUploadDto_1 = require("../../../application/dto/file/FileUploadDto");
const HttpStatusCodes_1 = require("../../../shared/enums/HttpStatusCodes");
const Logger_1 = require("../../../shared/utils/Logger");
const DITypes_1 = require("../../../shared/constants/DITypes");
const FileConstants_1 = require("../../../shared/constants/FileConstants");
const UpdateProfilePictureDto_1 = require("../../../application/dto/file/UpdateProfilePictureDto");
let FileController = class FileController {
    constructor(_uploadUc, _listUc, _deleteUc, _updateProfileUc) {
        this._uploadUc = _uploadUc;
        this._listUc = _listUc;
        this._deleteUc = _deleteUc;
        this._updateProfileUc = _updateProfileUc;
    }
    getUserId(req) {
        const user = req.user;
        return user?.userId ?? null;
    }
    async uploadFile(req, res) {
        try {
            const userId = this.getUserId(req);
            if (!userId) {
                res.status(HttpStatusCodes_1.HttpStatusCodes.UNAUTHORIZED).json({
                    success: false,
                    message: FileConstants_1.FILE_MESSAGES.UNAUTHORIZED,
                });
                return;
            }
            if (!req.file) {
                res.status(HttpStatusCodes_1.HttpStatusCodes.BAD_REQUEST).json({
                    success: false,
                    message: FileConstants_1.FILE_MESSAGES.FILE_REQUIRED,
                });
                return;
            }
            if (!req.body.purpose) {
                res.status(HttpStatusCodes_1.HttpStatusCodes.BAD_REQUEST).json({
                    success: false,
                    message: FileConstants_1.FILE_MESSAGES.PURPOSE_REQUIRED,
                });
                return;
            }
            const dto = new FileUploadDto_1.FileUploadDto({
                userId,
                purpose: req.body.purpose,
                file: req.file,
            });
            const result = await this._uploadUc.execute(dto);
            if (result.isSuccessful()) {
                res.status(HttpStatusCodes_1.HttpStatusCodes.CREATED).json({
                    success: true,
                    message: FileConstants_1.FILE_MESSAGES.FILE_UPLOADED,
                    data: result.getValue(),
                });
            }
            else {
                res.status(HttpStatusCodes_1.HttpStatusCodes.BAD_REQUEST).json({
                    success: false,
                    message: result.getError().message,
                });
            }
        }
        catch (error) {
            Logger_1.Logger.error("Upload file controller error", { error });
            res.status(HttpStatusCodes_1.HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: FileConstants_1.FILE_MESSAGES.INTERNAL_SERVER_ERROR,
            });
        }
    }
    async getUserFiles(req, res) {
        try {
            const userId = this.getUserId(req);
            if (!userId) {
                res.status(HttpStatusCodes_1.HttpStatusCodes.UNAUTHORIZED).json({
                    success: false,
                    message: FileConstants_1.FILE_MESSAGES.UNAUTHORIZED,
                });
                return;
            }
            const result = await this._listUc.execute(userId);
            if (result.isSuccessful()) {
                res.status(HttpStatusCodes_1.HttpStatusCodes.OK).json({
                    success: true,
                    message: FileConstants_1.FILE_MESSAGES.FILES_RETRIEVED,
                    data: result.getValue(),
                });
            }
            else {
                res.status(HttpStatusCodes_1.HttpStatusCodes.NOT_FOUND).json({
                    success: false,
                    message: result.getError().message,
                });
            }
        }
        catch (error) {
            Logger_1.Logger.error("Get user files controller error", { error });
            res.status(HttpStatusCodes_1.HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: FileConstants_1.FILE_MESSAGES.INTERNAL_SERVER_ERROR,
            });
        }
    }
    async deleteFile(req, res) {
        try {
            const userId = this.getUserId(req);
            if (!userId) {
                res.status(HttpStatusCodes_1.HttpStatusCodes.UNAUTHORIZED).json({
                    success: false,
                    message: FileConstants_1.FILE_MESSAGES.UNAUTHORIZED,
                });
                return;
            }
            const publicId = decodeURIComponent(req.params.publicId);
            if (!publicId) {
                res.status(HttpStatusCodes_1.HttpStatusCodes.BAD_REQUEST).json({
                    success: false,
                    message: FileConstants_1.FILE_MESSAGES.PUBLIC_ID_REQUIRED,
                });
                return;
            }
            const result = await this._deleteUc.execute(publicId);
            if (result.isSuccessful()) {
                const data = result.getValue();
                res.status(HttpStatusCodes_1.HttpStatusCodes.OK).json({
                    success: true,
                    message: data.message,
                });
            }
            else {
                res.status(HttpStatusCodes_1.HttpStatusCodes.BAD_REQUEST).json({
                    success: false,
                    message: result.getError().message,
                });
            }
        }
        catch (error) {
            Logger_1.Logger.error("Delete file controller error", { error });
            res.status(HttpStatusCodes_1.HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: FileConstants_1.FILE_MESSAGES.INTERNAL_SERVER_ERROR,
            });
        }
    }
    async updateProfilePicture(req, res) {
        try {
            const currentUserId = this.getUserId(req);
            if (!currentUserId) {
                res.status(HttpStatusCodes_1.HttpStatusCodes.UNAUTHORIZED).json({
                    success: false,
                    message: FileConstants_1.FILE_MESSAGES.UNAUTHORIZED,
                });
                return;
            }
            const { userId } = req.params;
            const currentUser = req.user;
            if (userId !== currentUserId && currentUser?.role !== "Admin") {
                res.status(HttpStatusCodes_1.HttpStatusCodes.FORBIDDEN).json({
                    success: false,
                    message: FileConstants_1.FILE_MESSAGES.PROFILE_PICTURE_UPDATE_FORBIDDEN,
                });
                return;
            }
            if (!req.file) {
                res.status(HttpStatusCodes_1.HttpStatusCodes.BAD_REQUEST).json({
                    success: false,
                    message: FileConstants_1.FILE_MESSAGES.FILE_REQUIRED,
                });
                return;
            }
            const dto = UpdateProfilePictureDto_1.UpdateProfilePictureDto.fromRequest(userId, req.file);
            const result = await this._updateProfileUc.execute(dto);
            if (result.isSuccessful()) {
                const data = result.getValue();
                res.status(HttpStatusCodes_1.HttpStatusCodes.OK).json({
                    success: true,
                    message: FileConstants_1.FILE_MESSAGES.PROFILE_PICTURE_UPDATE_SUCCESS,
                    data: {
                        profilePictureUrl: data.profilePictureUrl,
                        publicId: data.publicId,
                        userId: data.userId,
                        updatedAt: data.updatedAt,
                    },
                });
            }
            else {
                res.status(HttpStatusCodes_1.HttpStatusCodes.BAD_REQUEST).json({
                    success: false,
                    message: result.getError().message,
                });
            }
        }
        catch (error) {
            Logger_1.Logger.error("Update profile picture controller error", { error });
            res.status(HttpStatusCodes_1.HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: FileConstants_1.FILE_MESSAGES.INTERNAL_SERVER_ERROR,
            });
        }
    }
};
exports.FileController = FileController;
exports.FileController = FileController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.UploadFileUseCase)),
    __param(1, (0, inversify_1.inject)(DITypes_1.TYPES.GetUserFilesUseCase)),
    __param(2, (0, inversify_1.inject)(DITypes_1.TYPES.DeleteFileUseCase)),
    __param(3, (0, inversify_1.inject)(DITypes_1.TYPES.UpdateProfilePictureUseCase)),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], FileController);
//# sourceMappingURL=FileController.js.map