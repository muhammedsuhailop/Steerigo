import { FilePurpose } from "../../../domain/value-objects/FilePurpose";
export declare class FileUploadDto {
    readonly userId: string;
    readonly purpose: FilePurpose;
    readonly file: Express.Multer.File;
    constructor(data: {
        userId: string;
        purpose: string;
        file: Express.Multer.File;
    });
    validate(): string[];
    getUserId(): string;
    private getAllowedMimeTypesForPurpose;
    getFileSizeInMB(): number;
}
//# sourceMappingURL=FileUploadDto.d.ts.map