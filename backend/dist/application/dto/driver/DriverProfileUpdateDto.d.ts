import { Gender } from "../../../domain/value-objects/Gender";
type UserProfileUpdates = Partial<{
    name: string;
    mobile: string;
    dob: Date;
    gender: Gender;
    address: string;
}>;
interface DriverProfileUpdateRequestBody {
    name?: string;
    mobile?: string;
    dob?: string;
    gender?: Gender;
    address?: string;
    eligibleGearTypes?: string[];
    eligibleBodyTypes?: string[];
}
export declare class DriverProfileUpdateDto {
    private readonly userId;
    private readonly name?;
    private readonly mobile?;
    private readonly dob?;
    private readonly gender?;
    private readonly address?;
    private readonly eligibleGearTypes?;
    private readonly eligibleBodyTypes?;
    constructor(userId: string, name?: string | undefined, mobile?: string | undefined, dob?: Date | undefined, gender?: Gender | undefined, address?: string | undefined, eligibleGearTypes?: string[] | undefined, eligibleBodyTypes?: string[] | undefined);
    static fromRequest(userId: string, body: DriverProfileUpdateRequestBody): DriverProfileUpdateDto;
    getUserId(): string;
    getName(): string | undefined;
    getMobile(): string | undefined;
    getDob(): Date | undefined;
    getGender(): Gender | undefined;
    getAddress(): string | undefined;
    getEligibleGearTypes(): string[] | undefined;
    getEligibleBodyTypes(): string[] | undefined;
    hasUserProfileUpdates(): boolean;
    hasVehicleTypeUpdates(): boolean;
    getUserProfileUpdates(): UserProfileUpdates;
    validate(): string[];
}
export {};
//# sourceMappingURL=DriverProfileUpdateDto.d.ts.map