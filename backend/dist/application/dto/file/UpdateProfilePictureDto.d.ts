import { FilePurpose } from "@domain/value-objects/FilePurpose";
export declare class UpdateProfilePictureDto {
    readonly userId: string;
    readonly purpose: FilePurpose;
    readonly file: Express.Multer.File;
    constructor(data: {
        userId: string;
        file: Express.Multer.File;
    });
    static fromRequest(userId: string, file: Express.Multer.File): UpdateProfilePictureDto;
    validate(): string[];
    getFileSizeInMB(): number;
}
//# sourceMappingURL=UpdateProfilePictureDto.d.ts.map