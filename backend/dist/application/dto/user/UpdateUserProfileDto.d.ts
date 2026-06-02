import { Gender } from "../../../domain/value-objects/Gender";
export interface UpdateUserProfileInput {
    userId?: string;
    name?: string;
    mobile?: string;
    dob?: string | Date;
    gender?: Gender;
    address?: string;
    profilePicture?: string;
}
type UserProfileUpdates = {
    name: string;
    mobile: string;
    dob: Date;
    gender: Gender;
    address: string;
};
export declare class UpdateUserProfileDto {
    readonly userId: string;
    readonly name?: string;
    readonly mobile?: string;
    readonly dob?: Date;
    readonly gender?: Gender;
    readonly address?: string;
    readonly profilePicture?: string;
    constructor(data: unknown);
    static fromRequest(userId: string, requestBody: unknown): UpdateUserProfileDto;
    validate(): string[];
    hasUpdates(): boolean;
    getUserProfileUpdates(): Partial<UserProfileUpdates>;
}
export {};
//# sourceMappingURL=UpdateUserProfileDto.d.ts.map