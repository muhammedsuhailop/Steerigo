export declare enum FilePurposeEnum {
    AVATAR = "avatar",
    LICENSE_FRONT = "licenseFront",
    LICENSE_BACK = "licenseBack",
    INSURANCE = "insurance",
    KYC_DOC_FRONT = "kycdocFront",
    KYC_DOC_BACK = "kycdocBack",
    PROFILE = "profile",
    DOCUMENT = "document"
}
export declare class FilePurpose {
    private readonly value;
    private constructor();
    static create(purpose: string): FilePurpose;
    getValue(): FilePurposeEnum;
    toString(): string;
    equals(other: FilePurpose): boolean;
    static getAllowedPurposes(): string[];
}
//# sourceMappingURL=FilePurpose.d.ts.map