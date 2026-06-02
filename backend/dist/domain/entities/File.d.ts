import { FilePurpose } from "@domain/value-objects/FilePurpose";
export declare class File {
    readonly id: string;
    readonly userId: string;
    readonly filename: string;
    readonly originalName: string;
    readonly mimeType: string;
    readonly size: number;
    readonly url: string;
    readonly publicId: string;
    readonly purpose: FilePurpose;
    readonly uploadedAt: Date;
    readonly isActive: boolean;
    constructor(id: string, userId: string, filename: string, originalName: string, mimeType: string, size: number, url: string, publicId: string, purpose: FilePurpose, uploadedAt: Date, isActive?: boolean);
    static create(data: {
        id: string;
        userId: string;
        filename: string;
        originalName: string;
        mimeType: string;
        size: number;
        url: string;
        publicId: string;
        purpose: FilePurpose;
        uploadedAt?: Date;
    }): File;
    isImage(): boolean;
    isDocument(): boolean;
    getFileExtension(): string;
}
//# sourceMappingURL=File.d.ts.map